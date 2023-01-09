import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import GantiKode from './pages/GantiKode/GantiKode';
import Register from './pages/Register/Register';
import TransferList from './pages/Transfer/TransferList';
import DaftarAntarBank from './pages/DaftarAntarBank/DaftarAntarBank';
import DaftarRekening from './pages/DantarRekening/DaftarRekening';
import TransferRekening from './pages/TransferRekening/TransferRekening';
import TransferAntarBank from './pages/TransferAntarBank/TransferAntarBank';
import Profile from './pages/Profile/Profile';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import About from './pages/About/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/m-Info" element={<Info />} />
        <Route path="/m-Transfer" element={<TransferList />} />
        <Route path="/ganti-kode" element={<GantiKode />} />
        <Route path="/buka-rekening" element={<Register />} />
        <Route path="/daftar-antarBank" element={<DaftarAntarBank />} />
        <Route path="/daftar-rekening" element={<DaftarRekening />} />
        <Route path="/transfer-rekening" element={<TransferRekening />} />
        <Route path="/transfer-antarbank" element={<TransferAntarBank />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
