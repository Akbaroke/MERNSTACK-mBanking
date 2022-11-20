import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Home from './pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/m-Info" element={<Home />} />
        <Route path="/m-Transfer" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
