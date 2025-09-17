import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage.tsx';
import ProductPage from './pages/products.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productTest" element={<ProductPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;