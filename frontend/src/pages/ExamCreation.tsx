import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type ExamForm = {
  title: string;
  description: string;
  duration: number;
  subject: string;
  instructions: string;
  totalMarks: number;
  passingMarks: number;
  examDate: string;
  startTime: string;
  endTime: string;
  isRandomized: boolean;
  showResults: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
};

const ExamCreation: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ExamForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: ExamForm) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    try {
      // In a real application, this would be an API call
      // await axios.post('/api/teacher/exams', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchDifficulty = watch('difficulty', 'medium');
  const watchIsRandomized = watch('isRandomized', false);
  const watchShowResults = watch('showResults', true);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">{t('createNewExam')}</h1>
            <p className="text-indigo-200 mt-2">{t('examCreationDescription')}</p>
          </div>
          
          <div className="px-6 py-8">
            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-green-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{t('examCreatedSuccessfully')}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('basicInformation')}</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('examTitle')} *
                    </label>
                    <input
                      id="title"
                      {...register('title', { required: t('titleRequired') })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enterExamTitle')}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('description')}
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...register('description')}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={t('enterExamDescription')}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('subject')} *
                    </label>
                    <select
                      id="subject"
                      {...register('subject', { required: t('subjectRequired') })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t('selectSubject')}</option>
                      <option value="math">{t('mathematics')}</option>
                      <option value="science">{t('science')}</option>
                      <option value="history">{t('history')}</option>
                      <option value="english">{t('english')}</option>
                      <option value="computer">{t('computerScience')}</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('difficultyLevel')}
                    </label>
                    <select
                      id="difficulty"
                      {...register('difficulty')}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="easy">{t('easy')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="hard">{t('hard')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Timing & Duration Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('timingDuration')}</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('durationMinutes')} *
                    </label>
                    <input
                      id="duration"
                      type="number"
                      min="1"
                      {...register('duration', { 
                        required: t('durationRequired'),
                        min: { value: 1, message: t('durationMinError') }
                      })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="60"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('examDate')} *
                    </label>
                    <input
                      id="examDate"
                      type="date"
                      {...register('examDate', { required: t('dateRequired') })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.examDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.examDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.examDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('startTime')} *
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      {...register('startTime', { required: t('timeRequired') })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.startTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Grading Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('gradingSystem')}</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('totalMarks')} *
                    </label>
                    <input
                      id="totalMarks"
                      type="number"
                      min="1"
                      {...register('totalMarks', { 
                        required: t('totalMarksRequired'),
                        min: { value: 1, message: t('marksMinError') }
                      })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.totalMarks ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="100"
                    />
                    {errors.totalMarks && (
                      <p className="mt-1 text-sm text-red-600">{errors.totalMarks.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('passingMarks')} *
                    </label>
                    <input
                      id="passingMarks"
                      type="number"
                      min="0"
                      {...register('passingMarks', { 
                        required: t('passingMarksRequired'),
                        validate: value => {
                          const totalMarks = watch('totalMarks');
                          return !totalMarks || value <= totalMarks || t('passingMarksError');
                        }
                      })}
                      className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.passingMarks ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="40"
                    />
                    {errors.passingMarks && (
                      <p className="mt-1 text-sm text-red-600">{errors.passingMarks.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Exam Settings Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('examSettings')}</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isRandomized"
                        type="checkbox"
                        {...register('isRandomized')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isRandomized" className="font-medium text-gray-700">
                        {t('randomizeQuestions')}
                      </label>
                      <p className="text-gray-500">{t('randomizeQuestionsDescription')}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="showResults"
                        type="checkbox"
                        {...register('showResults')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="showResults" className="font-medium text-gray-700">
                        {t('showResultsImmediately')}
                      </label>
                      <p className="text-gray-500">{t('showResultsDescription')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('specialInstructions')}
                  </label>
                  <textarea
                    id="instructions"
                    rows={3}
                    {...register('instructions')}
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={t('enterSpecialInstructions')}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-5">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        {t('creatingExam')}
                      </>
                    ) : (
                      t('createExam')
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreation;