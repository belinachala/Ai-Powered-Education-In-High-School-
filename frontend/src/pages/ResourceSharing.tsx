import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ResourceSharing: React.FC = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/teacher/resources').then(res => setResources(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">{t('resources')}</h2>
        <button className="bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-600 transition duration-200">{t('uploadResource')}</button>
        <ul>
          {resources.map(resource => <li key={resource.id} className="mb-2">{resource.name} - <button className="text-blue-500 hover:underline">{t('download')}</button></li>)}
        </ul>
      </div>
    </div>
  );
};

export default ResourceSharing;