import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage.tsx';
import AdminNavigation from './pages/admin/AdminNavigation.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminNavigation />} />
      </Routes>
    </Router>
  );
}

export default App;