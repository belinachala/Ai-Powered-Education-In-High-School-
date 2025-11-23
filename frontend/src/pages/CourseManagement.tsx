import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CourseManagement: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/teacher/courses').then(res => setCourses(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">{t('courseManagement')}</h2>
        <ul>
          {courses.map((course: any) => <li key={course.id} className="mb-2">{course.name} - <button className="text-blue-500 hover:underline">{t('edit')}</button></li>)}
        </ul>
      </div>
    </div>
  );
};

export default CourseManagement;