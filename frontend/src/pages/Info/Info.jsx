import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar'
import Topbar from '../../components/Topbar'
import mInfo from '../../assets/Svg/m-info.svg'
import BtnBig from '../../components/BtnBig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import './Info.css'

function Info() {
  const [popupSaldo, setPopupSaldo] = useState("none")
  const [popup, setPopup] = useState('');
  const [msg, setMsg] = useState('')
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [network, setNetwork] = useState('pending');
  const [users, setUsers] = useState([])
  const [saldo, setSaldo] = useState("0")
  const [noRek, setNoRek] = useState("-")
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken()
    getDataUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [100]);

  setInterval(() => {
    let currRtt = navigator.connection.rtt;
    if (currRtt === 0 || currRtt === 2000) {
      setNetwork('offline')
    } else if (currRtt >= 10 && currRtt <= 300) {
      setNetwork('online')
    } else {
      setNetwork('pending')
    }
  }, 500);

  const getDataUser = () => {
    refreshToken()
    getUsers()
  }

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token')
      const decoded = jwt_decode(response.data.accessToken)
      setExpire(decoded.exp)
    } catch (error) {
      if (error.response) {
        navigate('/')
      }
    }
  }

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token')
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      setToken(response.data.accessToken)
    }
    return config;
  }, (error) => {
    return Promise.reject(error)
  })

  const getUsers = async () => {
    const response = await axiosJWT.get('http://localhost:5000/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setUsers(response.data)
  }

  setTimeout(() => {
    setSaldo(users.saldo ? users.saldo.toString() : '')
    setNoRek(users.saldo ? users.no_rek.toString() : '')
  }, 500);

  const handlePopupSaldo = () => {
    if (network !== 'online') {
      setMsg('Transaksi dapat dilakukan setelah lampu indikator berwarna hijau.')
      setPopup('error')
      return false
    }
    getUsers()
    if (popupSaldo === 'block') {
      setPopupSaldo('none')
    } else {
      setPopupSaldo('block')
    }
    console.log('p');
  }

  // Rupiah format
  const rupiahFormat = (nominal) => {
    let num_str = nominal.toString(),
      sisa = num_str.length % 3,
      rp = num_str.substr(0, sisa),
      rb = num_str.substr(sisa).match(/\d{3}/g);
    if (rb) {
      let sparator = sisa ? ',' : ''
      rp += sparator + rb.join(',')
    }
    return rp
  }

  // Date time
  const timeNow = () => {
    const date = new Date();
    let mon = date.getMonth();
    let dt = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return `${mon}/${dt} ${h}:${m}:${s}`
  }


  return (
    <div className='container'>
      <div className="popup-error" style={popup === 'error' ? { display: 'block' } : { display: 'none' }}>
        <div className="card-popup">
          <p>{msg}</p>
          <div className="action">
            <div onClick={() => { setPopup('') }}><BtnBig label="Back" /></div>
          </div>
        </div>
      </div>
      <div className="popup" style={{ display: popupSaldo }}>
        <div className="card-popup">
          <p>m-Info</p>
          <div>
            <div className='time-saldo'>
              <p>m-Info:</p>
              <p>{timeNow()}</p>
            </div>
            <div className='info-saldo'>
              <p>{noRek}</p>
              <p>Rp. {rupiahFormat(saldo)}. 00</p>
            </div>
          </div>
          <div onClick={handlePopupSaldo}><BtnBig label="OK" /></div>
        </div>
      </div>
      <Topbar logout='disable' network={network} />
      <div className="m-info">
        <div className="card-info">
          <div className="header-info">
            <img src={mInfo} alt="icon" />
            <p>m-Info</p>
          </div>
          <div className="menu-info">
            <div onClick={handlePopupSaldo} className="list-info">
              <p>Info Saldo</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="list-info">
              <p>Mutasi Rekening</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Info