import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopbarPolos from '../../components/TopbarPolos'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './Register.css'
import Logout from '../Logout'
import BtnBig from '../../components/BtnBig'
import axios from 'axios'

function Register() {
  const [msg, setMsg] = useState('')
  const [popupError, setPopupError] = useState("none")
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfPassword, setKonfPassword] = useState('')
  const [pin, setPin] = useState('')
  const [jenisCard, setJenisCard] = useState('')
  const [kodeAkses, setKodeAkses] = useState('')
  const [ip, setIp] = useState('0')

  useEffect(() => {
    getDataIp()
    Logout()
  })

  const getDataIp = async () => {
    const response = await fetch('https://ipwho.is/');
    const ipcode = await response.json();
    setIp(ipcode.ip)
  }

  const register = async () => {
    if (nama === '' || email === '' || password === '' || konfPassword === '' || pin === '' || jenisCard === '' || kodeAkses === '') {
      setMsg('Gagal - data harus di isi dengan lengkap dan benar.')
      handlePopupError()
      return false
    }
    if (nama.length < 3) {
      setMsg('Gagal - nama harus lengkap min.3 huruf')
      handlePopupError()
      return false
    }
    if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
      setMsg('Gagal - email salah.')
      handlePopupError()
      return false
    }
    if (password.length < 6) {
      setMsg('Gagal - password min.6 karakter')
      handlePopupError()
      return false
    }
    if (konfPassword !== password) {
      setMsg('Gagal - konfirmasi password tidak sama.')
      handlePopupError()
      return false
    }
    if (pin.length !== 6) {
      setMsg('Gagal - pin harus 6 angka.')
      handlePopupError()
      return false
    }
    if (kodeAkses.length !== 6) {
      setMsg('Gagal - kode akses harus 6 karakter.')
      handlePopupError()
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

    } catch (error) {
      clearInput()
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      handlePopupError()
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

  const handlePopupError = () => {
    if (popupError === 'block') {
      setPopupError('none')
      setMsg('')
    } else {
      setPopupError('block')
    }
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
              <input type="text" placeholder='Input nama lengkap' value={nama} onChange={e => setNama(e.target.value)} required />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Email</p>
            <div>
              <input type="text" onKeyDown={e => textOnly(e)} placeholder='Input email aktif' value={email} onChange={e => setEmail(e.target.value)} required />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Password</p>
            <div>
              <input type="password" onKeyDown={e => textOnly(e)} placeholder='Input password' value={password} onChange={e => setPassword(e.target.value)} required />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Konfirm Password</p>
            <div>
              <input type="password" onKeyDown={e => textOnly(e)} placeholder='Input ulang password' value={konfPassword} onChange={e => setKonfPassword(e.target.value)} required />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>PIN</p>
            <div>
              <input type="text" maxLength={6} onKeyDown={e => numberOnly(e)} placeholder='Input 6 angka' value={pin} onChange={e => setPin(e.target.value)} required />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="input-register">
            <p>Jenis Card</p>
            <div>
              <select style={{ color: jenisCard === "" ? "#ADADAD" : "#000" }} value={jenisCard} onChange={e => setJenisCard(e.target.value)} required >
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
              <input type="text" maxLength={6} onKeyDown={e => textOnly(e)} placeholder='Input 6 alphanum' value={kodeAkses} onChange={e => setKodeAkses(e.target.value)} required />
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register