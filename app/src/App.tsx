import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { installClickTracking } from './lib/analytics';
import HomePage from './pages/HomePage';

export default function App() {
  useEffect(() => installClickTracking(), []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Only the homepage exists in this phase; other paths are served by the live site. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
