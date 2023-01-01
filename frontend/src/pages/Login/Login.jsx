import React, { useState, useEffect } from 'react'
import bg from '../../assets/Svg/bg.svg'
import mbca from '../../assets/Svg/mbca.svg'
import klikbca from '../../assets/Svg/klikbca.svg'
import infobca from '../../assets/Svg/infobca.svg'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import Btn from '../../components/Btn'
import axios from 'axios';
import BtnBig from '../../components/BtnBig'
import Logout from '../Logout'
import { DeviceUUID } from 'device-uuid'


const Login = () => {
  const [ip, setIp] = useState("");
  const [popup, setPopup] = useState('');
  const [codeAkses, setCodeAkses] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();


  const getDataIp = async () => {
    const du = new DeviceUUID().parse();
    let dua = [
      du.language,
      du.platform,
      du.os,
      du.cpuCores,
      du.isAuthoritative,
      du.silkAccelerated,
      du.isKindleFire,
      du.isDesktop,
      du.isMobile,
      du.isTablet,
      du.isWindows,
      du.isLinux,
      du.isLinux64,
      du.isMac,
      du.isiPad,
      du.isiPhone,
      du.isiPod,
      du.isSmartTV,
      du.pixelDepth,
      du.isTouchScreen
    ];
    let uuid = du.hashMD5(dua.join(':'));
    setIp(uuid)
  }

  useEffect(() => {
    getDataIp()
    Logout()
  })

  const authKodeAkses = async () => {
    if (codeAkses.length !== 6) {
      setMsg("107 - Kode Akses harus 6 karakter dengan kombinasi huruf dan angka.");
      setCodeAkses('')
      setPopup('error')
      return false
    }
    try {
      await axios.post('http://localhost:5000/login', {
        kode_akses: codeAkses,
        ip_address: ip
      })
      setCodeAkses('')
      setPopup('')
      navigate("/home")
    } catch (error) {
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      setCodeAkses('')
      setPopup('error')
    }
  }

  const Popup = (props) => {
    if (props === 'error') {
      return (
        <div className="popup-error" style={props === 'error' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>{msg}</p>
            <div className="action">
              <div onClick={() => { setPopup('') }}><BtnBig label="Back" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'kodeakses') {
      return (
        <div className="popup" style={popup === 'kodeakses' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>Kode Akses</p>
            <input type="password" maxLength={6} id='kodeAkses' placeholder='Input 6 alphanum'
              value={codeAkses} onChange={e => setCodeAkses(e.target.value)} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); setCodeAkses('') }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup(''); authKodeAkses() }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className='container'>
      {Popup(popup)}
      <div className="card">
        <div onClick={() => setPopup('kodeakses')} className="button"><img src={mbca} alt="bg-bottom" /><p>m-BCA</p></div>
        <div className="button"><img src={klikbca} alt="bg-bottom" /><p>KlikBCA</p></div>
        <div className="button"><img src={infobca} alt="bg-bottom" /><p>Info BCA</p></div>
      </div>
      <div className="op">
        <Link to="/buka-rekening" className="button-op">Buka Rekening Baru</Link>
        <Link to="/ganti-kode" className="button-op">Ganti Kode Akses</Link>
        <Link to="/" className="button-op">Info Bca</Link>
      </div>
      <div className="bg"><img src={bg} alt="bg-bottom" /></div>
    </div>
  )
}

export default Login