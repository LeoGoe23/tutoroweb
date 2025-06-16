import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Newsletter from './pages/newsletter';
import Info from "./pages/info"; // Assuming you have an info page

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/newsletter" element={<Newsletter />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
}
