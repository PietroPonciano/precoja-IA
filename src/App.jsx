import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projeto from './pages/Projeto';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projeto" element={<Projeto />} />
      </Routes>
    </Router>
  );
}
