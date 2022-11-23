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


const Login = () => {
  const [ip, setIp] = useState("");
  const [codeAkses, setCodeAkses] = useState('');
  const [popupInput, setPopupInput] = useState("none");
  const [popupError, setPopupError] = useState("none");
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const getDataIp = async () => {
    const response = await fetch('https://ipwho.is/');
    const ipcode = await response.json();
    setIp(ipcode.ip)
  }
  
  useEffect( () => {
    getDataIp()
    logout()
  })

  const logout = async() =>{
    try {
      await axios.delete('http://localhost:5000/logout')
    } catch (error) {
      console.log(error);
    }
  }

  const authKodeAkses = async() =>{
    if(codeAkses.length !== 6){
      setMsg("107 - Kode Akses harus 6 karakter dengan kombinasi huruf dan angka.");
      setCodeAkses('')
      handlePopupInput()
      handlePopupError()
      return false
    }
    try {
      await axios.post('http://localhost:5000/login', {
        kode_akses: codeAkses,
        ip_address: ip
      })
      setCodeAkses('')
      handlePopupInput()
      navigate("/home")
    } catch (error) {
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      setCodeAkses('')
      handlePopupInput()
      handlePopupError()
    }
  }

  const handlePopupInput =()=>{
    if(popupInput === 'block') {
      setPopupInput('none') 
    } else { 
      setPopupInput('block')
    }
    console.log(ip);
  }
  const handlePopupError =()=>{
    if(popupError === 'block') {
      setPopupError('none') 
      setMsg('')
    } else { 
      setPopupError('block')
    }
  }
  
  return (
    <div className='container'>
      <div className="popup-error" style={{display: popupError}}>
        <div className="card-popup">
          <p>{msg}</p>
          <div className="action">
            <div onClick={handlePopupError}><BtnBig label="Back"/></div>
          </div>
        </div>
      </div>
      <div className="popup" style={{display: popupInput}}>
        <div className="card-popup">
          <p>Kode Akses</p>
          <input type="text" id='kodeAkses' placeholder='Input 6 alphanum'
          value={codeAkses} onChange={e => setCodeAkses(e.target.value)}/>
          <div className="action">
            <div onClick={handlePopupInput}><Btn label="Cancel"/></div>
            <div onClick={authKodeAkses}><Btn label="Login" /></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div onClick={handlePopupInput} className="button"><img src={mbca} alt="bg-bottom" /><p>m-BCA</p></div>
        <div className="button"><img src={klikbca} alt="bg-bottom" /><p>KlikBCA</p></div>
        <div className="button"><img src={infobca} alt="bg-bottom" /><p>Info BCA</p></div>
      </div>
      <div className="op">
        <Link to="/" className="button-op">Buka Rekening Baru</Link>
        <Link to="/gantiKode" className="button-op">Ganti Kode Akses</Link>
        <Link to="/" className="button-op">Info Bca</Link>
      </div>
      <div className="bg"><img src={bg} alt="bg-bottom" /></div>
    </div>
  )
}

export default Login