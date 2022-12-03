import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import GantiKode from './pages/GantiKode/GantiKode';
import Register from './pages/Register/Register';
import TransferList from './pages/Transfer/TransferList';
import DaftarAntarBank from './pages/DaftarAntarBank/DaftarAntarBank';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/m-Info" element={<Info />} />
        <Route path="/m-Transfer" element={<TransferList />} />
        <Route path="/ganti-kode" element={<GantiKode />} />
        <Route path="/buka-rekening" element={<Register />} />
        <Route path="/daftar-antarBank" element={<DaftarAntarBank />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
