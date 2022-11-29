import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopbarPolos from '../../components/TopbarPolos'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './Register.css'
import Logout from '../Logout'

function Register() {
  const [msg, setMsg] = useState('')
  const [popupInput, setPopupInput] = useState("none")
  const [popupError, setPopupError] = useState("none")
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfPassword, setKonfPassword] = useState('')
  const [pin, setPin] = useState('')
  const [jenisCard, setJenisCard] = useState('')
  const [kodeAkses, setKodeAkses] = useState('')
  const [ip, setIp] = useState('0')
  const navigate = useNavigate();

  useEffect(()=>{
    getDataIp()
    Logout()
  })

  const getDataIp = async () => {
    const response = await fetch('https://ipwho.is/');
    const ipcode = await response.json();
    setIp(ipcode.ip)
  }

  const register = async()=>{
    if(nama === '' || email === '' || password === '' || konfPassword === '' || pin === '' || jenisCard === '' || kodeAkses === ''){
      return false
    }
    if(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null){
      return false
    }

    console.log(nama);
    console.log(email);
    console.log(password);
    console.log(konfPassword);
    console.log(pin);
    console.log(jenisCard);
    console.log(kodeAkses);
    console.log(ip);
    clearInput()
  }

  const clearInput = ()=>{
    setMsg('')
    setNama('')
    setEmail('')
    setPassword('')
    setKonfPassword('')
    setPin('')
    setJenisCard('')
    setKodeAkses('')
  }

  const handlePopupInput =()=>{
    if(popupInput === 'block') {
      setPopupInput('none') 
    } else { 
      setPopupInput('block')
    }
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
            <input type="text" placeholder='Input email aktif' value={email} onChange={e => setEmail(e.target.value)} required />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Password</p>
          <div>
            <input type="password" placeholder='Input password' value={password} onChange={e => setPassword(e.target.value)} required />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Konfirm Password</p>
          <div>
            <input type="password" placeholder='Input ulang password' value={konfPassword} onChange={e => setKonfPassword(e.target.value)} required />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>PIN</p>
          <div>
            <input type="text" placeholder='Input 6 angka' value={pin} onChange={e => setPin(e.target.value)} required />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Jenis Card</p>
          <div>
            <select id='select-card' value={jenisCard} onChange={e => setJenisCard(e.target.value)} required >
              <option value="">- Pilih kartu -</option>
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
            <input type="text" placeholder='Input 6 alphanum' value={kodeAkses} onChange={e => setKodeAkses(e.target.value)} required />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Register