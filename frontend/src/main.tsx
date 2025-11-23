import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global Tailwind styles
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // i18n configuration

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);