import React, { useEffect, useState } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './DaftarAntarBank.css'
import BtnBig from '../../components/BtnBig';
import Btn from '../../components/Btn';

function DaftarAntarBank() {
  const [msg, setMsg] = useState('')
  const [popup, setPopup] = useState('');
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [pinUser, setPinUser] = useState('')
  const [network, setNetwork] = useState('pending');
  const [listBank, setListBank] = useState([]);
  const [noRek, setNoRek] = useState('');
  const [bank, setBank] = useState('');
  const [pin, setPin] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken()
    getListBank()
    getUsers()
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
    setPinUser(response.data.pin)
  }


  const getListBank = async () => {
    const response = await axios.get('http://localhost:5000/listbank')
    setListBank(response.data)
  }

  const clearInput = () => {
    setMsg('')
    setBank('')
    setNoRek('')
    setPin('')
  }


  const daftarAntarBank = async () => {
    if (parseInt(pin) !== parseInt(pinUser)) {
      setPin('')
      setMsg('Gagal - pin anda salah.')
      setPopup('error')
      return false
    }
    try {
      await axiosJWT.post('http://localhost:5000/daftar_antarbank', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        no_rek: noRek,
        bank: bank
      })
      clearInput()
      setMsg('No.Rekening Tujuan Bank Lain berhasil didaftarkan No.Rekening Tujuan otomatis tampil di Daftar Transfer pada Menu Transfer Antar Bank.')
      setPopup('sukses')
      console.log(msg);

    } catch (error) {
      clearInput()
      setMsg(error.response.data.msg);
      setPopup('error')
    }
  }

  const showInfoRekTujuan = async () => {
    if (network !== 'online') {
      setMsg('Transaksi dapat dilakukan setelah lampu indikator berwarna hijau.')
      setPopup('error')
      return false
    }
    if (noRek === '' || bank === '') {
      setMsg('Gagal - data harus di isi dengan lengkap dan benar.')
      setPopup('error')
      return false
    }

    try {
      const response = await axios.post('http://localhost:5000/ceknomor', {
        no_rek: noRek
      })
      const result = response.data
      setMsg(`${bank} - ${result.no_rek} - ${result.nama}`)
      setPopup('dataRek')

    } catch (error) {
      clearInput()
      setMsg(error.response.data.msg);
      setPopup('error')
    }
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
      <div className="popup" style={popup === 'pin' ? { display: 'block' } : { display: 'none' }}>
        <div className="card-popup">
          <p>PIN</p>
          <input type="text" maxLength={6} id='kodeAkses' placeholder='Input PIN anda'
            value={pin} onChange={e => setPin(e.target.value)} />
          <div className="action">
            <div onClick={() => { setPopup('') }}><Btn label="Cancel" /></div>
            <div onClick={daftarAntarBank}><Btn label="OK" /></div>
          </div>
        </div>
      </div>
      <div className="popup" style={popup === 'sukses' ? { display: 'block' } : { display: 'none' }}>
        <div className="card-popup">
          <p style={{ fontSize: 14, fontWeight: 500 }} >m-Transfer</p>
          <p style={{ display: 'block', height: 154, width: 187, marginTop: 17, textAlign: 'left' }}>{msg}</p>
          <div className="action">
            <div onClick={() => { setPopup('') }}><BtnBig label="OK" /></div>
          </div>
        </div>
      </div>
      <div className="popup" style={popup === 'dataRek' ? { display: 'block' } : { display: 'none' }}>
        <div className="card-popup">
          <p style={{ fontSize: 14, fontWeight: 500 }} >m-Transfer</p>
          <p style={{ display: 'block', height: 154, marginTop: 17, textAlign: 'left', textTransform: 'uppercase' }}>{msg}</p>
          <div className="action">
            <div onClick={() => { setPopup('') }}><Btn label="Cancel" /></div>
            <div onClick={() => { setPopup('pin') }}><Btn label="OK" /></div>
          </div>
        </div>
      </div>
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send' onClick={showInfoRekTujuan}>Send</div>
        </div>
      </div>
      <div className="daftarAntarBank">
        <div className="card-daftarAntarBank">
          <div className="input-daftarAntarBank">
            <div>
              <p>No.Rekening Tujuan</p>
              <input type="number" value={noRek} onChange={e => setNoRek(e.target.value)} autoFocus />
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="input-daftarAntarBank">
            <div>
              <p>Bank</p>
              <select style={{ color: bank === "" ? "#ADADAD" : "#000" }} value={bank} onChange={e => setBank(e.target.value)}>
                <option disabled={true} value="">-PILIH-</option>
                {listBank.map((bank) => (
                  <option style={{ color: "#000" }} value={bank.code} key={bank.bank_code}>{bank.code}</option>
                ))}
              </select>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaftarAntarBank