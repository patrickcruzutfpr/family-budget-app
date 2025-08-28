import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from '@/i18n';
import { NotificationProvider } from '@/components';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </I18nProvider>
  </React.StrictMode>
);