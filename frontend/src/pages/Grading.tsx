import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Grading: React.FC = () => {
  const { t } = useTranslation();
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/teacher/grades').then(res => setGrades(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">{t('grading')}</h2>
        <ul>
          {grades.map(grade => <li key={grade.id} className="mb-2">{grade.student} - {grade.score} - <button className="text-blue-500 hover:underline">{t('grade')}</button></li>)}
        </ul>
      </div>
    </div>
  );
};

export default Grading;