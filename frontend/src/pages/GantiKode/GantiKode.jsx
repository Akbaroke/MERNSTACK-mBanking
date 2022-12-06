import React, { useEffect, useState } from 'react'
import TopbarPolos from '../../components/TopbarPolos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BtnBig from '../../components/BtnBig';
import Btn from '../../components/Btn';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../Logout';
import axios from 'axios';
import './GantiKode.css'
import { DeviceUUID } from 'device-uuid'


function GantiKode() {
  const [msg, setMsg] = useState('');
  const [popupInput, setPopupInput] = useState("none");
  const [popupError, setPopupError] = useState("none");
  const [ip, setIp] = useState('0')
  const [kodeAksesLama, setKodeAksesLama] = useState('')
  const [kodeAksesBaru, setKodeAksesBaru] = useState('')
  const [konfKodeAksesBaru, setKonfKodeAksesBaru] = useState('')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
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

  const gantiKodeAkses = async () => {
    if (pin.length !== 6) {
      setMsg("107 - PIN harus 6 berisi huruf.");
      setPin('')
      handlePopupInput()
      handlePopupError()
      return false
    }

    try {
      await axios.post('http://localhost:5000/gantikode', {
        kodeLama: kodeAksesLama,
        kodeBaru: kodeAksesBaru,
        konfirmKodeBaru: kodeAksesBaru,
        pin: pin,
        email: email,
        ip_address: ip
      })
      clearInput()
      handlePopupInput()
      navigate("/home")

    } catch (error) {
      clearInput()
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      handlePopupInput()
      handlePopupError()
    }
  }

  const clearInput = () => {
    setPin('')
    setKodeAksesLama('')
    setKodeAksesBaru('')
    setKonfKodeAksesBaru('')
    setEmail('')
  }

  const handlePopupInput = () => {
    if (popupInput === 'block') {
      setPopupInput('none')
    } else {
      setPopupInput('block')
    }
  }
  const handlePopupError = () => {
    if (popupError === 'block') {
      setPopupError('none')
      setMsg('')
    } else {
      setPopupError('block')
    }
  }

  return (
    <div className='container'>
      <div className="popup-error" style={{ display: popupError }}>
        <div className="card-popup">
          <p>{msg}</p>
          <div className="action">
            <div onClick={handlePopupError}><BtnBig label="Back" /></div>
          </div>
        </div>
      </div>
      <div className="popup" style={{ display: popupInput }}>
        <div className="card-popup">
          <p>PIN</p>
          <input type="text" maxLength={6} id='kodeAkses' placeholder='Input PIN anda'
            value={pin} onChange={e => setPin(e.target.value)} />
          <div className="action">
            <div onClick={handlePopupInput}><Btn label="Cancel" /></div>
            <div onClick={gantiKodeAkses}><Btn label="OK" /></div>
          </div>
        </div>
      </div>
      <TopbarPolos />
      <div className='topbar-btn'>
        <Link to='/' >Cancel</Link>
        <div type='submit' onClick={handlePopupInput} >OK</div>
      </div>
      <div className="ganti-kode">
        <div className="card-formKode">
          <div className="input-formKode">
            <p>Kode Akses Saat ini</p>
            <div>
              <input type="text" maxLength={6} placeholder='Input 6 alphanum' value={kodeAksesLama} onChange={e => setKodeAksesLama(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-formKode">
            <p>Kode Akses yang Baru</p>
            <div>
              <input type="text" maxLength={6} placeholder='Input 6 alphanum' value={kodeAksesBaru} onChange={e => setKodeAksesBaru(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-formKode">
            <p>Konfirmasi Kode Akses yang Baru</p>
            <div>
              <input type="text" maxLength={6} placeholder='Input 6 alphanum' value={konfKodeAksesBaru} onChange={e => setKonfKodeAksesBaru(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-formKode">
            <p>Email</p>
            <div>
              <input type="email" placeholder='Input email terdaftar' value={email} onChange={e => setEmail(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GantiKode