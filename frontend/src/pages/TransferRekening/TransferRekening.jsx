import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import BtnBig from '../../components/BtnBig';
import Btn from '../../components/Btn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import './TransferRekening.css'

function TransferRekening() {
  const [network, setNetwork] = useState('pending');
  const [msg, setMsg] = useState('')
  const [popup, setPopup] = useState('');
  const [page, setPage] = useState(false);
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [objRek, setObjRek] = useState({})
  const [listNorekTerdaftar, setListNorekTerdaftar] = useState([])
  const [pin, setPin] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [btnSendVis, setBtnSendVis] = useState('hidden');
  const [nominal, setNominal] = useState('');
  const [beforeNominal, setBeforeNominal] = useState('');
  const [norekTujuan, setNorekTujuan] = useState('-PILIH-');
  const [berita, setBerita] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userId: '',
    pin: '',
    noRek: '',
    saldo: ''
  })

  useEffect(() => {
    refreshToken()
    getUsers()
    getListnorekTerdaftar()
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
      userId: response.data.id,
      pin: response.data.pin,
      noRek: response.data.no_rek,
      saldo: response.data.saldo,
    })
  }

  const getListnorekTerdaftar = async () => {
    const response = await axiosJWT.post('http://localhost:5000/list_banklain', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      bank: "BCA"
    })
    if (response.data.msg) {
      setObjRek('')
      return false
    }
    setObjRek(response.data)
    console.log(response.data);
  }

  let sampleListNorek = [];
  const getInfoNorek = async () => {
    for (let i in objRek) {
      const response = await axios.post('http://localhost:5000/infonorek', {
        norek: objRek[i].no_rek
      })
      sampleListNorek.push(response.data)
    }
    setListNorekTerdaftar(sampleListNorek);
    console.log(sampleListNorek);
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
              value={pin} onChange={e => setPin(e.target.value)} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); return false }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup(''); cekPin() }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'sukses') {
      return (
        <div className="popup" style={popup === 'sukses' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup" >
            <p style={{ fontSize: 14, fontWeight: 500, }} >m-Transfer</p>
            <p style={{ display: 'block', height: 204, width: 187, marginTop: 17, textAlign: 'left' }}>{msg}</p>
            <div className="action">
              <div onClick={() => { setPopup(''); navigate('/m-Transfer') }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'nominal') {
      return (
        <div className="popup" style={popup === 'nominal' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>Jumlah Uang</p>
            <input type="text" id='kodeAkses' placeholder='Masukan nominal angka'
              value={formatRupiah(beforeNominal)} onChange={e => setBeforeNominal(e.target.value)} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); setNominal(nominal); setBeforeNominal('') }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup(''); handelInputNominal(beforeNominal.replace('.', '').replace('.', '')); setBeforeNominal('') }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'berita') {
      return (
        <div className="popup" style={popup === 'berita' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>Berita</p>
            <input type="text" id='kodeAkses' placeholder='Masukan berita'
              value={berita} onChange={e => setBerita(e.target.value)} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); setBerita(berita) }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup(''); setBerita(berita) }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    }
  }

  const handelInputNominal = (nominalInput) => {
    if (parseInt(nominalInput) < 10000 || nominalInput === '') {
      setMsg('151 - Nilai transfer minimal Rp 10000.')
      setPopup('error')
      return false
    }
    setNominal(nominalInput);
  }

  function formatRupiah(angka, prefix) {
    var numberString = angka.toString().replace(/[^,\d]/g, ''),
      split = numberString.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix === undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
  }

  const FormDataTrasnfer = () => {
    return (
      <div className="formdataTransfer">
        <div className="card-formTransfer">
          <div className="list-formTransfer">
            <p>Dari Rekening:</p>
            <p>{user.noRek}</p>
          </div>
          <div onClick={() => { setPage(true); getInfoNorek() }} className="list-formTransfer">
            <div>
              <p>Ke Rekening:</p>
              <p>{norekTujuan}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="list-formTransfer">
            <p>Jumlah Uang</p>
          </div>
          <div className="nominal-formTransfer">
            <div>Rp</div>
            <div onClick={() => setPopup('nominal')}>
              <p>{formatRupiah(nominal)}</p>
              <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
            </div>
          </div>
          <div className="list-formTransfer" onClick={() => setPopup('berita')}>
            <div>
              <p>Berita</p>
              <p style={{ textTransform: 'none' }}>{berita}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
      </div>
    )
  }

  const PilihNomorRekening = () => {
    return (
      <div className="pilihNomorRekening">
        <div className="headTransfer">
          <div>Rekening Sendiri</div>
          <div>Daftar Trasnfer</div>
        </div>
        <div className="searchRekening">
          <input type="text" placeholder='Seacrh' value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
          <FontAwesomeIcon style={{ color: '#8D8D8D', width: 14 }} icon={faMagnifyingGlass} />
        </div>
        <div className="optionNomorRekening">
          {listNorekTerdaftar.filter((item) => {
            if (searchFilter === '') {
              return item
            } else if (item.nama.toLowerCase().includes(searchFilter.toLowerCase()) || item.no_rek.toLowerCase().includes(searchFilter.toLowerCase())) {
              return item
            }
          }).map((item, index) => (
            <div className="listNomor" key={index} onClick={() => { setNorekTujuan(item.no_rek); setPage(false) }}>
              <p>{item.nama}</p>
              <p>{item.no_rek}</p>
            </div>
          ))
          }
        </div>
      </div>
    )
  }

  const handelKirim = () => {
    // cek rekening
    if (norekTujuan === '') {
      setMsg('Silahkan pilih rekening tujuan')
      setPopup('error')
      return false
    }

    // cek jumlah
    if (nominal === '') {
      setMsg('140 - Anda belum menginputkan Jumlah Uang.')
      setPopup('error')
      return false
    }

    // cek saldo cukup atau tidak
    if (parseInt(nominal) > parseInt(user.saldo)) {
      setMsg('Saldo anda tidak cukup.')
      setPopup('error')
      return false
    }
    setPopup('pin')
  }

  const cekPin = () => {
    if (pin !== user.pin.toString()) {
      setMsg('PIN salah.')
      setPopup('error')
      return false
    }
    kirimTransfer()
    console.log('kirim');
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

  const kirimTransfer = async () => {
    try {
      const response = await axiosJWT.post('http://localhost:5000/transfer', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        saldoTf: nominal,
        noTujuan: norekTujuan
      })
      let rupiahNominal = formatRupiah(nominal).replace('.', ',')
      const pesanBerhasil = () => {
        return (
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <p>m-Transfer :</p>
            <p>BERHASIL</p>
            <p>{timeNow()}</p>
            <p>Ke {norekTujuan}</p>
            <p>{response.data.namaPenerima.toUpperCase()}</p>
            <p>Rp. {rupiahNominal}.00</p>
            <p>{berita === '' ? ' ' : berita}</p>
          </div>
        )
      }
      setMsg(pesanBerhasil)
      setPopup('sukses')
    } catch (error) {
      setMsg(error.response.data.msg);
      setPopup('error')
    }
  }

  return (
    <div className="container">
      {Popup(popup)}
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send' style={{ visibility: page === false ? 'visible' : btnSendVis }} onClick={handelKirim}>Send</div>
        </div>
      </div>
      {page === false ? FormDataTrasnfer() : PilihNomorRekening()}
      <Navbar active="transaksi" />
    </div>
  )
}

export default TransferRekening