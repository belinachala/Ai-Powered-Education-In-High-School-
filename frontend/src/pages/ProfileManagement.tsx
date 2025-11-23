import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type ProfileForm = { 
  name: string; 
  email: string; 
  department: string;
  phone: string;
  office: string;
  bio: string;
};

// Sample teacher data (would come from backend in real app)
const sampleTeacherData = {
  name: "Dr. Sarah Johnson",
  email: "s.johnson@university.edu",
  department: "Computer Science",
  phone: "+1 (555) 123-4567",
  office: "Building A, Room 305",
  bio: "Professor of Computer Science with 10 years of experience. Specialized in Algorithms and Data Structures.",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

const ProfileManagement: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [teacherData, setTeacherData] = useState<ProfileForm & { avatar?: string }>(sampleTeacherData);

  // Simulate fetching teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/teacher/profile');
        // setTeacherData(response.data);
        
        // Using sample data for demonstration
        setTimeout(() => {
          setTeacherData(sampleTeacherData);
          reset(sampleTeacherData); // Prepopulate form with current data
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    
    try {
      // In a real app, this would be an API call
      // await axios.put('/api/teacher/profile', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new data
      setTeacherData({...data, avatar: teacherData.avatar});
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setTeacherData({...teacherData, avatar: e.target.result as string});
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">{t('profileManagement')}</h1>
            <p className="text-indigo-200 mt-2">{t('manageYourProfileInfo')}</p>
          </div>
          
          <div className="px-6 py-8">
            {/* Success Message */}
            {updateSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-green-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{t('profileUpdatedSuccessfully')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="md:flex md:space-x-8">
              {/* Avatar Section */}
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                      src={teacherData.avatar}
                      alt={teacherData.name}
                    />
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 text-white cursor-pointer shadow-md">
                      <i className="fas fa-camera text-sm"></i>
                      <input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{teacherData.name}</h2>
                  <p className="text-sm text-gray-500">{teacherData.department}</p>
                  
                  <div className="mt-6 w-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('accountInfo')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-envelope mr-2 text-indigo-500"></i>
                        <span>{teacherData.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-shield-alt mr-2 text-indigo-500"></i>
                        <span>{t('teacherAccount')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar-alt mr-2 text-indigo-500"></i>
                        <span>{t('memberSince')} January 2020</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="md:w-2/3">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('personalInformation')}</h3>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('fullName')} *
                        </label>
                        <input
                          id="name"
                          {...register('name', { required: t('nameRequired') })}
                          className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('emailAddress')} *
                        </label>
                        <input
                          id="email"
                          type="email"
                          {...register('email', { 
                            required: t('emailRequired'),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t('invalidEmailAddress')
                            }
                          })}
                          className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('department')} *
                        </label>
                        <input
                          id="department"
                          {...register('department', { required: t('departmentRequired') })}
                          className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.department ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.department && (
                          <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('phoneNumber')}
                        </label>
                        <input
                          id="phone"
                          {...register('phone')}
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('officeLocation')}
                      </label>
                      <input
                        id="office"
                        {...register('office')}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="mt-4">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('bio')}
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        {...register('bio')}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => reset()}
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            {t('updating')}
                          </>
                        ) : (
                          t('updateProfile')
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;