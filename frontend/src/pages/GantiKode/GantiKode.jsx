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
  const [popup, setPopup] = useState('');
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
  }, [])

  const handleKlik = () => {
    if (kodeAksesLama.trim() === '' && kodeAksesBaru.trim() === '' && konfKodeAksesBaru.trim() === '' && email.trim() === '') {
      setMsg("Lengkapi data dengan benar.");
      setPopup('error')
      return false
    }
    setPopup('pin')
  }

  const gantiKodeAkses = async () => {
    if (pin.length !== 6) {
      setMsg("107 - PIN harus 6 berisi huruf.");
      setPin('')
      setPopup('error')
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
      setMsg('Selamat, kode akses dan perangkat berhasil di perbarui.')
      setPopup('sukses')

    } catch (error) {
      clearInput()
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      setPopup('error')
    }
  }

  const clearInput = () => {
    setPin('')
    setKodeAksesLama('')
    setKodeAksesBaru('')
    setKonfKodeAksesBaru('')
    setEmail('')
  }

  const numberOnly = (e) => {
    const key = e.key
    if (key === "Backspace" || key === "Delete") return true;
    if (!(parseInt(key) > -1)) e.preventDefault()
    if (key === " ") e.preventDefault();
    return true;
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
    } else if (props === 'pin') {
      return (
        <div className="popup" style={popup === 'pin' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>PIN</p>
            <input type="password" maxLength={6} id='kodeAkses' placeholder='Input PIN anda'
              value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => numberOnly(e)} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); return false }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup(''); gantiKodeAkses() }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'sukses') {
      return (
        <div className="popup" style={popup === 'sukses' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup" >
            <p style={{ fontSize: 14, fontWeight: 500, }} >m-BCA</p>
            <p style={{ display: 'block', height: 204, width: 187, marginTop: 17, textAlign: 'left' }}>{msg}</p>
            <div className="action">
              <div onClick={() => { setPopup(''); navigate('/') }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className='container'>
      {Popup(popup)}
      <TopbarPolos />
      <div className='topbar-btn'>
        <Link to='/' >Cancel</Link>
        <div type='submit' onClick={handleKlik} >OK</div>
      </div>
      <div className="ganti-kode">
        <div className="card-formKode">
          <div className="input-formKode">
            <p>Kode Akses Saat ini</p>
            <div>
              <input type="password" maxLength={6} placeholder='Input 6 alphanum' value={kodeAksesLama} onChange={e => setKodeAksesLama(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-formKode">
            <p>Kode Akses Baru</p>
            <div>
              <input type="password" maxLength={6} placeholder='Input 6 alphanum' value={kodeAksesBaru} onChange={e => setKodeAksesBaru(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-formKode">
            <p>Konfirmasi Kode Akses Baru</p>
            <div>
              <input type="password" maxLength={6} placeholder='Input 6 alphanum' value={konfKodeAksesBaru} onChange={e => setKonfKodeAksesBaru(e.target.value)} />
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