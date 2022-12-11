import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './DaftarRekening.css'
import { useNavigate } from 'react-router-dom';

function DaftarRekening() {
  const [network, setNetwork] = useState('pending');
  // const [msg, setMsg] = useState('')
  // const [popup, setPopup] = useState('');
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const navigate = useNavigate();

  const [user, setUser] = useState({
    pin: '',
    noRek: '',
  })

  const [inputRek1, setInputRek1] = useState('');
  const [inputRek2, setInputRek2] = useState('');
  const [inputRek3, setInputRek3] = useState('');
  const arrDataRekening = [];

  const resRek = {
    norek1: null,
    norek2: null,
    norek3: null,
  }

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

  useEffect(() => {
    refreshToken()
    getUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [100]);

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
      noRek: response.data.no_rek
    })
  }

  const handleInput = () => {
    let fail = false;
    if (inputRek1 !== '') {
      if (inputRek1.length >= 8) {
        resRek.norek1 = inputRek1
        fail = false;
      } else {
        fail = true;
      }
    } else {
      resRek.norek1 = null
    }
    if (inputRek2 !== '') {
      if (inputRek2.length >= 8) {
        resRek.norek2 = inputRek2
        fail = false;
      } else {
        fail = true;
      }
    } else {
      resRek.norek2 = null
    }
    if (inputRek3 !== '') {
      if (inputRek3.length >= 8) {
        resRek.norek3 = inputRek3
        fail = false;
      } else {
        fail = true;
      }
    } else {
      resRek.norek3 = null
    }

    for (let key in resRek) {
      if (resRek[key] !== null) {
        console.log(`${key}: ${resRek[key]}`)
        cekDataRekening(resRek[key]);
      }
    }
    if (fail === true) return console.log('GAGAL');
  }

  const cekDataRekening = async (noRek) => {
    try {
      const response = await axios.post('http://localhost:5000/ceknomor', {
        no_rek: noRek
      })
      const proses = {
        nama: response.data.nama,
        noRek: response.data.no_rek,
        status: true
      }
      if (proses.noRek === user.noRek) {
        proses.nama = "OWN ACCOUNT NUMBER"
        proses.noRek = noRek
        proses.status = false

        arrDataRekening.push(proses)
        console.log(arrDataRekening);
        return false
      }

      arrDataRekening.push(proses)
      console.log(arrDataRekening);

    } catch (error) {
      const prosesInvalid = {
        nama: "INVALID",
        noRek: noRek,
        status: false
      }
      arrDataRekening.push(prosesInvalid)
      console.log(arrDataRekening);
    }
  }


  const ValidasiDataTransfer = () => {
    return (
      <div className="validasiRekening">

      </div>
    )
  }

  const FormDaftarRekening = () => {
    return (
      <div className="daftarRekening">
        <p>No.Rekening Tujuan</p>
        <div className="card-daftarRekening">
          <div>
            <input type="number" placeholder='Rekening 1' value={inputRek1} onChange={e => setInputRek1(e.target.value)} />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div>
            <input type="number" placeholder='Rekening 2' value={inputRek2} onChange={e => setInputRek2(e.target.value)} />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div>
            <input type="number" placeholder='Rekening 3' value={inputRek3} onChange={e => setInputRek3(e.target.value)} />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send' onClick={handleInput}>Send</div>
        </div>
      </div>
      {ValidasiDataTransfer()}
      <Navbar active="transaksi" />
    </div>
  )
}

export default DaftarRekening