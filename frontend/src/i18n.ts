import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        teacherMenu: 'Teacher Menu',
        dashboard: 'Dashboard',
        profile: 'Profile',
        courses: 'Courses',
        questionBank: 'Question Bank',
        createExam: 'Create Exam',
        manageExams: 'Manage Exams',
        students: 'Students',
        grading: 'Grading',
        results: 'Results',
        notifications: 'Notifications',
        resources: 'Resources',
        integrity: 'Integrity',
        welcome: 'Welcome',
        todayIs: 'Today is',
        footerText: '© 2025 Digital Online Exam Platform - Last Updated',
        allExaminee: 'All Examinee',
        exams: 'Exams',
        questions: 'Questions',
        totalAccounts: 'Total Accounts',
        add: 'Add',
        name: 'Name',
        email: 'Email',
        department: 'Department',
        update: 'Update',
        profileUpdated: 'Profile updated successfully!',
        courseManagement: 'Course Management',
        edit: 'Edit',
        addQuestion: 'Add Question',
        examTitle: 'Exam Title',
        durationMin: 'Duration (minutes)',
        create: 'Create',
        examCreated: 'Exam created successfully!',
        download: 'Download',
        uploadResource: 'Upload Resource',
        configure: 'Configure',
        manage: 'Manage',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;