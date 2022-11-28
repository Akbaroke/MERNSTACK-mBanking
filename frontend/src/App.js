import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import GantiKode from './pages/GantiKode/GantiKode';
import Register from './pages/Register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/m-Info" element={<Info />} />
        <Route path="/m-Transfer" element={<Home />} />
        <Route path="/ganti-kode" element={<GantiKode />} />
        <Route path="/buka-rekening" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
