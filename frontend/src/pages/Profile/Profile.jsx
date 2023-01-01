import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import Navbar from '../../components/Navbar';
import blueCard from '../../assets/Svg/card-blue.svg'
import goldCard from '../../assets/Svg/card-gold.svg'
import platCard from '../../assets/Svg/card-plat.svg'
import btnCopy from '../../assets/Svg/btn-copy.svg'
import btnCopyCheck from '../../assets/Svg/btn-copyCheck.svg'
import './Profile.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [iconCopy, setInconCopy] = useState(btnCopy);
  const [network, setNetwork] = useState('pending');
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [user, setUser] = useState({
    noCard: ''
  })

  setInterval(() => {
    let currRtt = navigator.connection.rtt;
    if (currRtt === 0 || currRtt === 2000) {
      setNetwork('offline')
    } else if (currRtt >= 10 && currRtt <= 600) {
      setNetwork('online')
    } else {
      setNetwork('pending')
    }
  }, 500);

  useEffect(() => {
    refreshToken()
    getUsers()
  }, []);

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
    setUser({
      pin: response.data.pin,
      nama: response.data.nama,
      noCard: response.data.no_card,
      jenisCard: response.data.jenis_card
    })
  }

  const formatNoCardSpasi = (nomor) => {
    for (let i = 4; i < nomor.length; i += 5) {
      nomor = nomor.substring(0, i) + ' ' + nomor.substring(i);
    }
    return nomor
  }

  const handleBtnCopy = () => {
    navigator.clipboard.writeText(user.noCard)
    setInconCopy(btnCopyCheck);
    setTimeout(() => {
      setInconCopy(btnCopy);
    }, 3000);
  }

  return (
    <div className='container'>
      <div className='topbar-send'>
        <p>Akun Saya</p>
        <div>
          <div className={network}></div>
          <div className='send' style={{ visibility: 'hidden' }}></div>
        </div>
      </div>
      <div className="profile">
        <p>Jenis Kartu</p>
        <p>Paspor BCA {user.jenisCard}</p>
        <div className='pasporCard'>
          <img src={user.jenisCard === 'gold' ? goldCard : user.jenisCard === 'platinum' ? platCard : user.jenisCard === 'blue' ? blueCard : ''} alt="" />
          <p>{user.nama}</p>
        </div>
        <div className="btn-LihatKartu">
          <p>Lihat Detail Kartu</p>
        </div>
        <div className="nomorKartu">
          <div>
            <p>Nomor Kartu</p>
            <p>{formatNoCardSpasi(user.noCard)}</p>
          </div>
          <img src={iconCopy} alt="" onClick={handleBtnCopy} />
        </div>
      </div>
      <Navbar active="akun" />
    </div>
  )
}

export default Profile