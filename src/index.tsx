import './index.css';

import { StorageProvider } from '@core/storage';
import CalenderPage from '@pages/Calendar';
import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';

const App: FC = () => {
  return (
    <StorageProvider>
      <CalenderPage />
    </StorageProvider>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
