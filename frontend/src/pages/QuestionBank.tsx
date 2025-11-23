import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
};

type QuestionForm = {
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation: string;
};

const QuestionBank: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<QuestionForm>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample questions for demonstration
  const sampleQuestions: Question[] = [
    {
      id: '1',
      text: 'What is the capital of France?',
      type: 'multiple-choice',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
      points: 5,
      difficulty: 'easy',
      category: 'Geography'
    },
    {
      id: '2',
      text: 'JavaScript is a statically typed language.',
      type: 'true-false',
      correctAnswer: 'false',
      points: 3,
      difficulty: 'medium',
      category: 'Programming',
      explanation: 'JavaScript is dynamically typed, not statically typed.'
    },
    {
      id: '3',
      text: 'Explain the concept of object-oriented programming.',
      type: 'essay',
      correctAnswer: '',
      points: 10,
      difficulty: 'hard',
      category: 'Programming'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch questions
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        // In a real app: await axios.get('/api/teacher/questions')
        await new Promise(resolve => setTimeout(resolve, 800));
        setQuestions(sampleQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const questionType = watch('type', 'multiple-choice');

  const filteredQuestions = questions.filter(question => {
    const matchesCategory = filterCategory === 'all' || question.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const categories = Array.from(new Set(questions.map(q => q.category)));

  const onSubmit = async (data: QuestionForm) => {
    setIsAdding(true);
    
    try {
      let questionData: Question;
      
      if (data.type === 'multiple-choice') {
        const options = [data.option1, data.option2, data.option3, data.option4].filter(opt => opt.trim() !== '');
        questionData = {
          id: editingQuestion ? editingQuestion.id : Date.now().toString(),
          text: data.text,
          type: data.type,
          options,
          correctAnswer: data.correctAnswer,
          points: data.points,
          difficulty: data.difficulty,
          category: data.category,
          explanation: data.explanation
        };
      } else if (data.type === 'true-false') {
        questionData = {
          id: editingQuestion ? editingQuestion.id : Date.now().toString(),
          text: data.text,
          type: data.type,
          correctAnswer: data.correctAnswer,
          points: data.points,
          difficulty: data.difficulty,
          category: data.category,
          explanation: data.explanation
        };
      } else {
        questionData = {
          id: editingQuestion ? editingQuestion.id : Date.now().toString(),
          text: data.text,
          type: data.type,
          correctAnswer: data.correctAnswer,
          points: data.points,
          difficulty: data.difficulty,
          category: data.category,
          explanation: data.explanation
        };
      }

      if (editingQuestion) {
        // Update existing question
        setQuestions(questions.map(q => q.id === editingQuestion.id ? questionData : q));
      } else {
        // Add new question
        setQuestions([...questions, questionData]);
      }

      reset();
      setShowForm(false);
      setEditingQuestion(null);
    } catch (err) {
      console.error('Error saving question:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
    
    // Prepopulate form with question data
    setValue('text', question.text);
    setValue('type', question.type);
    setValue('points', question.points);
    setValue('difficulty', question.difficulty);
    setValue('category', question.category);
    setValue('explanation', question.explanation || '');
    
    if (question.type === 'multiple-choice' && question.options) {
      setValue('option1', question.options[0] || '');
      setValue('option2', question.options[1] || '');
      setValue('option3', question.options[2] || '');
      setValue('option4', question.options[3] || '');
      setValue('correctAnswer', question.correctAnswer as string);
    } else if (question.type === 'true-false') {
      setValue('correctAnswer', question.correctAnswer as string);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDeleteQuestion'))) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">{t('questionBank')}</h1>
            <p className="text-indigo-200 mt-2">{t('manageExamQuestions')}</p>
          </div>

          <div className="px-6 py-8">
            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('category')}
                  </label>
                  <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">{t('allCategories')}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('difficulty')}
                  </label>
                  <select
                    id="difficulty-filter"
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">{t('allLevels')}</option>
                    <option value="easy">{t('easy')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="hard">{t('hard')}</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('searchQuestions')}
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Add Question Button */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                {t('addQuestion')}
              </button>
            )}

            {/* Question Form */}
            {showForm && (
              <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">
                  {editingQuestion ? t('editQuestion') : t('addNewQuestion')}
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('questionText')} *
                    </label>
                    <textarea
                      id="text"
                      {...register('text', { required: t('questionTextRequired') })}
                      rows={3}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.text ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enterQuestionText')}
                    />
                    {errors.text && (
                      <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('questionType')} *
                      </label>
                      <select
                        id="type"
                        {...register('type', { required: true })}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="multiple-choice">{t('multipleChoice')}</option>
                        <option value="true-false">{t('trueFalse')}</option>
                        <option value="short-answer">{t('shortAnswer')}</option>
                        <option value="essay">{t('essay')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('points')} *
                      </label>
                      <input
                        id="points"
                        type="number"
                        min="1"
                        {...register('points', { 
                          required: t('pointsRequired'),
                          min: { value: 1, message: t('pointsMinError') }
                        })}
                        className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.points ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.points && (
                        <p className="mt-1 text-sm text-red-600">{errors.points.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('difficulty')} *
                      </label>
                      <select
                        id="difficulty"
                        {...register('difficulty', { required: true })}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="easy">{t('easy')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="hard">{t('hard')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('category')} *
                      </label>
                      <input
                        id="category"
                        type="text"
                        {...register('category', { required: t('categoryRequired') })}
                        className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('enterCategory')}
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Options for multiple choice */}
                  {questionType === 'multiple-choice' && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-700">{t('options')} *</h3>
                      
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                          <label htmlFor={`option${num}`} className="block text-sm text-gray-700 mb-1">
                            {t('option')} {num}
                          </label>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              {...register('correctAnswer', { required: questionType === 'multiple-choice' ? t('correctAnswerRequired') : false })}
                              value={num}
                              className="mr-2"
                            />
                            <input
                              id={`option${num}`}
                              {...register(`option${num}` as const)}
                              className="block flex-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder={`${t('option')} ${num}`}
                            />
                          </div>
                        </div>
                      ))}
                      {errors.correctAnswer && (
                        <p className="mt-1 text-sm text-red-600">{errors.correctAnswer.message}</p>
                      )}
                    </div>
                  )}

                  {/* Options for true/false */}
                  {questionType === 'true-false' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('correctAnswer')} *
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register('correctAnswer', { required: questionType === 'true-false' ? t('correctAnswerRequired') : false })}
                            value="true"
                            className="mr-2"
                          />
                          {t('true')}
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register('correctAnswer', { required: questionType === 'true-false' ? t('correctAnswerRequired') : false })}
                            value="false"
                            className="mr-2"
                          />
                          {t('false')}
                        </label>
                      </div>
                      {errors.correctAnswer && (
                        <p className="mt-1 text-sm text-red-600">{errors.correctAnswer.message}</p>
                      )}
                    </div>
                  )}

                  {/* Answer field for short answer and essay */}
                  {(questionType === 'short-answer' || questionType === 'essay') && (
                    <div>
                      <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                        {questionType === 'short-answer' ? t('sampleAnswer') : t('gradingGuidelines')}
                      </label>
                      <textarea
                        id="correctAnswer"
                        {...register('correctAnswer')}
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={questionType === 'short-answer' ? t('enterSampleAnswer') : t('enterGradingGuidelines')}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('explanation')}
                    </label>
                    <textarea
                      id="explanation"
                      {...register('explanation')}
                      rows={2}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={t('enterExplanation')}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          {editingQuestion ? t('updating') : t('adding')}
                        </>
                      ) : (
                        editingQuestion ? t('updateQuestion') : t('addQuestion')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Questions List */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('questions')} ({filteredQuestions.length})</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <i className="fas fa-question-circle text-gray-400 text-4xl mb-3"></i>
                  <p className="text-gray-500">{t('noQuestionsFound')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{question.text}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {question.type}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {question.points} {t('points')}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {question.category}
                            </span>
                          </div>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700">{t('options')}:</h4>
                              <ul className="mt-1 space-y-1">
                                {question.options.map((option, index) => (
                                  <li key={index} className="text-sm text-gray-600">
                                    {option === question.correctAnswer ? (
                                      <span className="font-medium text-green-600">✓ {option}</span>
                                    ) : (
                                      option
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {question.explanation && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700">{t('explanation')}:</h4>
                              <p className="text-sm text-gray-600">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(question)}
                            className="text-indigo-600 hover:text-indigo-900"
                            aria-label={t('edit')}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={t('delete')}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;