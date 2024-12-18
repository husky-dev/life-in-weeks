import './index.css';

import CalendarPage from '@/pages/Calendar';
import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';

const App: FC = () => {
  return <CalendarPage />;
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
