import React, { useEffect, useState } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import './TransferAntarBank.css'
import BtnBig from '../../components/BtnBig';
import Btn from '../../components/Btn';
import { useNavigate } from 'react-router-dom';

function TransferAntarBank() {
  const [network, setNetwork] = useState('pending');
  const [page, setPage] = useState(false);
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [bank, setBank] = useState('');
  const [objBank, setObjBank] = useState({})
  const [listBank, setListBank] = useState([])
  const [listNorekTerdaftar, setListNorekTerdaftar] = useState([])
  const [searchFilter, setSearchFilter] = useState('')
  const [msg, setMsg] = useState('')
  const [pin, setPin] = useState('')
  const [popup, setPopup] = useState('');
  const [layanan, setLayanan] = useState('-PILIH-');
  const [berita, setBerita] = useState('');
  const [noRek_tujuan, setNoRek_tujuan] = useState('0');
  const [nominal, setNominal] = useState('0');
  const [beforeNominal, setBeforeNominal] = useState('');
  const [user, setUser] = useState({
    userId: '',
    pin: '',
    noRek: '',
    saldo: ''
  })
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken()
    getUsers()
    getListBankTerdaftar()
  }, []);

  useEffect(() => {
    setNoRek_tujuan('0')
    setLayanan('-PILIH-')
    setBerita('')
  }, [bank])

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

  const getListBankTerdaftar = async () => {
    const response = await axiosJWT.post('http://localhost:5000/listBankTerdaftar', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.data.msg) {
      setObjBank('')
      return false
    }
    setObjBank(response.data)
    console.log(response.data);
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

  const numberOnly = (e) => {
    const key = e.key
    if (key === "Backspace" || key === "Delete") return true;
    if (!(parseInt(key) > -1)) e.preventDefault()
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
    } else if (props === 'pin') {
      return (
        <div className="popup" style={popup === 'pin' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>PIN</p>
            <input type="password" maxLength={6} id='kodeAkses' placeholder='Input PIN anda'
              value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => numberOnly(e)} autoFocus />
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
              <div onClick={() => { setPopup(''); handelInputNominal(beforeNominal.replaceAll('.', '')); setBeforeNominal('') }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'pilihbank') {
      return (
        <div className="popup" onClick={() => setPopup('')} style={popup === 'pilihbank' ? { display: 'block' } : { display: 'none' }}>
          {listBank.length === 0 ? (
            <div className="card-popup">
              <p>Harap daftarkan bank tujuan terlebih dahulu.</p>
              <div className="action">
                <div onClick={() => { setPopup('') }}><BtnBig label="Back" /></div>
              </div>
            </div>
          ) : (
            <div className="card-listOption">
              {listBank.map(e => (
                <div key={e} onClick={() => { setBank(e) }} >{e}</div>
              ))}
            </div>
          )}
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

  function findDuplicates(arr) {
    var result = {};
    for (var i = 0; i < arr.length; i++) {
      if (result[arr[i].bank]) {
        result[arr[i].bank] = 'duplicate';
      } else {
        result[arr[i].bank] = true;
      }
    }
    return result;
  }

  const pilihBank = () => {
    let arrSample = []
    for (let i in objBank) {
      if (objBank[i] !== null) {
        arrSample.push(objBank[i])
      }
    }
    let obj = findDuplicates(arrSample);
    setListBank(Object.keys(obj))
  }

  let sampleListNorek = [];
  let objRek = [];
  const getInfoNorek = async () => {
    console.log(objRek);
    for (let i in objRek) {
      const response = await axios.post('http://localhost:5000/infonorek', {
        norek: objRek[i].no_rek
      })
      sampleListNorek.push(response.data)
    }
    setListNorekTerdaftar(sampleListNorek);
    console.log(sampleListNorek);
  }

  const getListnorekTerdaftar = async () => {
    const response = await axiosJWT.post('http://localhost:5000/listRekening', {
      userId: user.userId,
      bank: bank
    })
    console.log(bank);
    if (response.data.msg) {
      objRek = '';
      return false
    }
    objRek = response.data
    console.log(response.data);
    console.log(listNorekTerdaftar);
    getInfoNorek()
  }

  const handelKirim = () => {
    // cek rekening
    if (noRek_tujuan === '') {
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
    let mon = date.getMonth() + 1;
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
        noTujuan: noRek_tujuan
      })
      let rupiahNominal = formatRupiah(nominal).replaceAll('.', ',')
      const pesanBerhasil = () => {
        return (
          <p style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <p>m-Transfer :</p>
            <p>BERHASIL</p>
            <p>{timeNow()}</p>
            <p>Ke {noRek_tujuan}</p>
            <p>{response.data.namaPenerima.toUpperCase()}</p>
            <p>Rp. {rupiahNominal}.00</p>
            {berita.trim() === '' ? ('') : (<p>{berita}</p>)}
          </p>
        )
      }
      setMsg(pesanBerhasil)
      setPopup('sukses')
    } catch (error) {
      setMsg('Transfer gagal, lakukan beberapa saat lagi.');
      setPopup('error')
    }
  }

  const PilihNomorRekening = () => {
    return (
      <div className="pilihNomorRekening">
        <div className="headTransfer">
          <div style={{ width: "100%", backgroundColor: "#015EAB" }}>Daftar Trasnfer</div>
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
            <div className="listNomor" key={index} onClick={() => { setNoRek_tujuan(item.no_rek); setPage(false) }}>
              <p>{item.nama}</p>
              <p>{item.no_rek}</p>
            </div>
          ))
          }
        </div>
      </div>
    )
  }

  const pilihLayanan = () => {
    return (
      <div className="pilihLayanan">
        <p>Layanan Transfer</p>
        <div className="card-layanan" onClick={() => { setLayanan('BI FAST'); setPage(false) }}>
          <p>BI FAST</p>
          <div className='info-layanan'>
            <div>
              <p>Minimal Transaksi</p>
              <p>Biaya</p>
              <p>Waktu Layanan</p>
            </div>
            <div>
              <p>Rp 10,000.00</p>
              <p>Rp 2,500.00</p>
              <p>24 Jam</p>
            </div>
          </div>
        </div>
        <div className="card-layanan" onClick={() => { setLayanan('Realtime Online'); setPage(false) }}>
          <p>Realtime Online</p>
          <div className='info-layanan'>
            <div>
              <p>Minimal Transaksi</p>
              <p>Biaya</p>
              <p>Waktu Layanan</p>
            </div>
            <div>
              <p>Rp 10,000.00</p>
              <p>Rp 6,500.00</p>
              <p>24 Jam</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handelClickRekTujuan = () => {
    if (bank !== '') {
      setPage('pilihNomerRekening')
      refreshToken()
      getListnorekTerdaftar()
    }
  }

  const formTransferBank = () => {
    return (
      <div className='formTransferBank'>
        <div className="card-form">
          <div className="list-form input" onClick={() => { setPopup('pilihbank'); console.log(listBank); pilihBank() }}>
            <div>
              <p>Bank</p>
              <p>{bank === '' ? '- PILIH -' : bank}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className={bank === '' ? "list-form" : "list-form input"} onClick={handelClickRekTujuan}>
            <div>
              <p>Ke Rekening Tujuan</p>
              <p style={{ visibility: bank === '' ? "hidden" : "visible", color: noRek_tujuan === '0' ? "#F8F8F8" : "#9A9A9A" }}>{noRek_tujuan}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} style={{ display: bank === '' ? "none" : "block" }} />
          </div>
          <div className="list-form input" onClick={() => setPopup('nominal')}>
            <div>
              <p>Jumlah Uang</p>
              <p style={{ visibility: nominal === '0' ? "hidden" : "visible" }}>{formatRupiah(nominal)}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="list-form input" onClick={() => setPage(true)} style={{ display: noRek_tujuan === '0' ? "none" : "flex" }}>
            <div>
              <p>Layanan Transfer</p>
              <p style={{ textTransform: 'capitalize' }}>{layanan}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="list-form" style={{ display: layanan === '-PILIH-' ? "none" : "flex" }}>
            <div>
              <p>Biaya</p>
              <p>{layanan === "BI FAST" ? "2.500" : "6.500"}</p>
            </div>
          </div>
          <div className="list-form" style={{ display: nominal === '0' ? "none" : "flex" }} onClick={() => setPopup('berita')}>
            <div>
              <p>Berita</p>
              <p style={{ textTransform: 'none' }}>{berita}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="list-form">
            <div>
              <p>Dari Rekening</p>
              <p>{user.noRek}</p>
            </div>
          </div>
        </div>
      </div >
    )
  }

  return (
    <div className='container'>
      {Popup(popup)}
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send' style={{ visibility: page === false ? 'visible' : 'hidden' }} onClick={handelKirim}>Send</div>
        </div>
      </div>
      {page === false ? formTransferBank() : page === 'pilihNomerRekening' ? PilihNomorRekening() : pilihLayanan()}
      <Navbar active="transaksi" />
    </div>
  )
}

export default TransferAntarBank