import React, { useState } from 'react'
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
  const [bank, setBank] = useState('');
  const [msg, setMsg] = useState('')
  const [pin, setPin] = useState('')
  const [popup, setPopup] = useState('');
  const [noRek_tujuan, setNoRek_tujuan] = useState('-');
  const [nominal, setNominal] = useState('0');
  const [user, setUser] = useState({
    userId: '',
    pin: '',
    noRek: '',
    saldo: ''
  })
  const navigate = useNavigate();

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
              <div onClick={() => { setPopup(''); }}><Btn label="OK" /></div>
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
              value={formatRupiah('')} onChange={''} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); setNominal(nominal); }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup(''); }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'pilihbank') {
      return (
        <div className="popup" style={popup === 'pilihbank' ? { display: 'block' } : { display: 'none' }}>

        </div>
      )
    }
  }

  const formTransferBank = () => {
    return (
      <div className='formTransferBank'>
        <div className="card-form">
          <div className="list-form input">
            <div>
              <p>Bank</p>
              <p>{bank === '' ? '- PILIH -' : bank}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className={bank === '' ? "list-form" : "list-form input"} >
            <div>
              <p>Ke Rekening Tujuan</p>
              <p style={{ visibility: bank === '' ? "hidden" : "visible" }}>{noRek_tujuan}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} style={{ display: bank === '' ? "none" : "block" }} />
          </div>
          <div className="list-form input">
            <div>
              <p>Jumlah Uang</p>
              <p style={{ visibility: nominal === '0' ? "hidden" : "visible" }}>{nominal}</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="list-form" style={{ display: noRek_tujuan === '-' ? "none" : "flex" }}>
            <div>
              <p>Layanan Transfer</p>
              <p style={{ textTransform: 'capitalize' }}>Realtime Online</p>
            </div>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
          <div className="list-form" style={{ display: nominal === '0' ? "none" : "flex" }}>
            <div>
              <p>Biaya</p>
              <p>6.500</p>
            </div>
          </div>
          <div className="list-form">
            <div>
              <p>Dari Rekening</p>
              <p>8730647647</p>
            </div>
          </div>
        </div>
      </div >
    )
  }

  return (
    <div className='container'>
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send'>Send</div>
        </div>
      </div>
      {page === false ? formTransferBank() : ''}
      <Navbar active="transaksi" />
    </div>
  )
}

export default TransferAntarBank