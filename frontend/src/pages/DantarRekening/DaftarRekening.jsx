import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './DaftarRekening.css'
import { useNavigate } from 'react-router-dom';
import BtnBig from '../../components/BtnBig';
import Btn from '../../components/Btn';

function DaftarRekening() {
  const [network, setNetwork] = useState('pending');
  const [msg, setMsg] = useState('')
  const [popup, setPopup] = useState('');
  const [page, setPage] = useState('');
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [ArrRek, setArrRek] = useState([])
  const [pin, setPin] = useState('')
  const navigate = useNavigate();
  const [inputRek1, setInputRek1] = useState('');
  const [inputRek2, setInputRek2] = useState('');
  const [inputRek3, setInputRek3] = useState('');
  let arrDataRekening = [];

  const [user, setUser] = useState({
    userId: '',
    pin: '',
    noRek: '',
  })

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
      const decoded = jwt_decode(response.data.accessToken)
      setExpire(decoded.exp)
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
      userId: response.data.id,
      pin: response.data.pin,
      noRek: response.data.no_rek
    })
  }

  const handleInput = () => {
    let fail = false;
    if (inputRek1 === '' && inputRek1 === '' && inputRek1 === '') {
      setMsg('110 - Anda belum menginput no rekening tujuan yang akan didaftarkan.')
      setPopup('error')
      return false
    }
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

    function findDuplicates(arr) {
      var result = {};
      for (var i = 0; i < arr.length; i++) {
        if (result[arr[i]]) {
          result[arr[i]] = 'duplicate';
        } else {
          result[arr[i]] = true;
        }
      }
      return result;
    }


    let arrSample = []
    for (let key in resRek) {
      if (resRek[key] !== null) {
        console.log(`${key}: ${resRek[key]}`)
        arrSample.push(resRek[key])
      }
    }
    let obj = findDuplicates(arrSample);
    for (const prop in obj) {
      cekDataRekening(prop);
    }

    setArrRek(arrDataRekening)
    arrDataRekening = [...[]]

    if (fail === true) {
      setMsg('Nomor rekening tujuan harus 10 digit')
      setPopup('error')
    };
  }

  const cekDataRekening = async (noRek) => {
    try {
      const response = await axios.post('http://localhost:5000/ceknomor', {
        userId: user.userId,
        no_rek: noRek
      })
      const proses = {
        nama: response.data.nama,
        noRek: response.data.no_rek,
        status: true
      }
      console.log(response.data.no_rek);

      if (response.data.no_rek === noRek) {
        proses.nama = "OWN ACCOUNT NUMBER"
        proses.noRek = noRek
        proses.status = false

        arrDataRekening.push(proses)
        console.log(arrDataRekening);
        return false
      }

      console.log(proses.noRek + " : " + noRek);

      if (response.data.msg) {
        proses.nama = response.data.msg
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
      console.log(error);
    }
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
            <input type="text" maxLength={6} id='kodeAkses' placeholder='Input PIN anda'
              value={pin} onChange={e => setPin(e.target.value)} />
            <div className="action">
              <div onClick={() => { setPopup('') }}><Btn label="Cancel" /></div>
              <div onClick={''}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'sukses') {
      return (
        <div className="popup" style={popup === 'sukses' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p style={{ fontSize: 14, fontWeight: 500 }} >m-Transfer</p>
            <p style={{ display: 'block', height: 154, width: 187, marginTop: 17, textAlign: 'left' }}>{msg}</p>
            <div className="action">
              <div onClick={() => { setPopup('') }}><BtnBig label="OK" /></div>
            </div>
          </div>
        </div>
      )
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
      {Popup(popup)}
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send' onClick={handleInput}>Send</div>
        </div>
      </div>
      {page === '' ? FormDaftarRekening() : ValidasiDataTransfer()}
      <Navbar active="transaksi" />
    </div>
  )
}

export default DaftarRekening