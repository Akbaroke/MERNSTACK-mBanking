import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'
import Topbar from '../../components/Topbar';
import mInfo from '../../assets/Svg/m-info.svg'
import mTransfer from '../../assets/Svg/m-transfer.svg'
import Navbar from '../../components/Navbar';


function Home() {
  const [nama, setNama] = useState('')
  const [expire, setExpire] = useState('')
  const [network, setNetwork] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken()
  })

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

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token')
      const decoded = jwt_decode(response.data.accessToken)
      setNama(decoded.nama)
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
      const decoded = jwt_decode(response.data.accessToken)
      setNama(decoded.nama)
      setExpire(decoded.exp)
    }
    return config;
  }, (error) => {
    return Promise.reject(error)
  })

  return (
    <div className='container'>
      <Topbar network={network} />
      <div className="home">
        <div className="welcome">
          <p>Selamat datang,</p>
          <h4>{nama}</h4>
        </div>
        <div className="con-menu">
          <div className="menu">
            <Link to="/m-Info" ><img src={mInfo} alt="" /></Link>
            <p>m-Info</p>
          </div>
          <div className="menu">
            <Link to="/m-Transfer" ><img src={mTransfer} alt="" /></Link>
            <p>m-Transfer</p>
          </div>
        </div>
      </div>
      <Navbar active="home" />
    </div>
  )
}

export default Home