import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage.tsx';
import ProductPage from './pages/Product-Page.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;