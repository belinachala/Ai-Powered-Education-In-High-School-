from sqlalchemy.orm import Session
from app.models.question import Question
from app.models.free_exam_attempt import FreeExamAttempt # Ensure you have this model

class ExamSubmissionService:
    @staticmethod
    def submit_exam(db: Session, exam_id: int, student_id: int, student_answers: dict):
        # 1. Fetch questions
        questions = db.query(Question).filter(Question.free_exam_id == exam_id).all()
        total_questions = len(questions)
        correct_count = 0
        
        # 2. Calculate Score
        for q in questions:
            student_ans = student_answers.get(str(q.id)) or student_answers.get(q.id)
            if student_ans:
                if str(q.correct_answer).strip().lower() == str(student_ans).strip().lower():
                    correct_count += 1
        
        score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0

        # 3. SAVE to Database
        new_attempt = FreeExamAttempt(
            free_exam_id=exam_id,
            student_id=student_id,
            score=correct_count,
            total_questions=total_questions,
            percentage=round(score_percentage, 2),
            answers_json=student_answers # Optional: store what they picked
        )
        
        db.add(new_attempt)
        db.commit()
        db.refresh(new_attempt)
        
        # 4. Return the object containing the NEW ID
        return new_attempt

submission_service = ExamSubmissionService()