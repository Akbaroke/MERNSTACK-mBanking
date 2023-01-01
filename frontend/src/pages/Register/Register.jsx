import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopbarPolos from '../../components/TopbarPolos'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './Register.css'
import Logout from '../Logout'
import BtnBig from '../../components/BtnBig'
import axios from 'axios'
import { DeviceUUID } from 'device-uuid'
import Btn from '../../components/Btn'

function Register() {
  const [msg, setMsg] = useState('')
  const [popup, setPopup] = useState('');
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfPassword, setKonfPassword] = useState('')
  const [pin, setPin] = useState('')
  const [jenisCard, setJenisCard] = useState('')
  const [kodeAkses, setKodeAkses] = useState('')
  const [ip, setIp] = useState('0')
  const navigate = useNavigate();

  useEffect(() => {
    getDataIp()
    Logout()
  })

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

  const register = async () => {
    if (nama === '' || email === '' || password === '' || konfPassword === '' || pin === '' || jenisCard === '' || kodeAkses === '') {
      setMsg('Gagal - data harus di isi dengan lengkap dan benar.')
      setPopup('error')
      return false
    }
    if (nama.length < 3) {
      setMsg('Gagal - nama harus lengkap min.3 huruf')
      setPopup('error')
      return false
    }
    if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
      setMsg('Gagal - email salah.')
      setPopup('error')
      return false
    }
    if (password.length < 6) {
      setMsg('Gagal - password min.6 karakter')
      setPopup('error')
      return false
    }
    if (konfPassword !== password) {
      setMsg('Gagal - konfirmasi password tidak sama.')
      setPopup('error')
      return false
    }
    if (pin.length !== 6) {
      setMsg('Gagal - pin harus 6 angka.')
      setPopup('error')
      return false
    }
    if (kodeAkses.length !== 6) {
      setMsg('Gagal - kode akses harus 6 karakter.')
      setPopup('error')
      return false
    }

    try {
      await axios.post('http://localhost:5000/users', {
        nama: nama,
        email: email,
        password: password,
        confPassword: password,
        pin: pin,
        jenis_card: jenisCard,
        kode_akses: kodeAkses,
        ip_address: ip
      })
      clearInput()
      setMsg('Selamat, pendaftaran akun anda telah berhasil. Sekarang anda dapat menggunakan BCA mobile bangking dengan masuk ke menu m-BCA dan memasukan kode akses yang telah di daftarkan dengan perangkat ini.')
      setPopup('sukses')

    } catch (error) {
      clearInput()
      setMsg(error.response.data.msg);
      setPopup('error')
    }
  }

  const clearInput = () => {
    setMsg('')
    setNama('')
    setEmail('')
    setPassword('')
    setKonfPassword('')
    setPin('')
    setJenisCard('')
    setKodeAkses('')
  }

  const numberOnly = (e) => {
    const key = e.key
    if (key === "Backspace" || key === "Delete") return true;
    if (!(parseInt(key) > -1)) e.preventDefault()
    if (key === " ") e.preventDefault();
    return true;
  }

  const textOnly = (e) => {
    const key = e.key
    if (key === "Backspace" || key === "Delete") return true;
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
        <div type='submit' onClick={register} >OK</div>
      </div>
      <div className="register">
        <div className="card-register">
          <div className="input-register">
            <p>Nama</p>
            <div>
              <input type="text" placeholder='Input nama lengkap' value={nama} onChange={e => setNama(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Email</p>
            <div>
              <input type="text" onKeyDown={e => textOnly(e)} placeholder='Input email aktif' value={email} onChange={e => setEmail(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Password</p>
            <div>
              <input type="password" onKeyDown={e => textOnly(e)} placeholder='Input password' value={password} onChange={e => setPassword(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Konfirm Password</p>
            <div>
              <input type="password" onKeyDown={e => textOnly(e)} placeholder='Input ulang password' value={konfPassword} onChange={e => setKonfPassword(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>PIN</p>
            <div>
              <input type="password" maxLength={6} onKeyDown={e => numberOnly(e)} placeholder='Input 6 angka' value={pin} onChange={e => setPin(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Jenis Card</p>
            <div>
              <select style={{ color: jenisCard === "" ? "#ADADAD" : "#000" }} value={jenisCard} onChange={e => setJenisCard(e.target.value)} >
                <option disabled={true} value="">
                  -- Pilih kartu --
                </option>
                <option value="blue">Blue</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Kode Akses</p>
            <div>
              <input type="password" maxLength={6} onKeyDown={e => textOnly(e)} placeholder='Input 6 alphanum' value={kodeAkses} onChange={e => setKodeAkses(e.target.value)} />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register