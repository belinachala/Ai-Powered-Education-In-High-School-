import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ExamManagement: React.FC = () => {
  const { t } = useTranslation();
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/teacher/exams').then(res => setExams(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">{t('manageExams')}</h2>
        <ul>
          {exams.map(exam => <li key={exam.id} className="mb-2">{exam.title} - <button className="text-blue-500 hover:underline">{t('edit')}</button></li>)}
        </ul>
      </div>
    </div>
  );
};

export default ExamManagement;