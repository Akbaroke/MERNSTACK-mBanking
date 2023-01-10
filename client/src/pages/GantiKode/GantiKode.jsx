import React, { useEffect, useRef, useState } from 'react'
import loader from '../../assets/Gif/loader.gif'
import TopbarPolos from '../../components/TopbarPolos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BtnBig from '../../components/BtnBig';
import Btn from '../../components/Btn';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../Logout';
import axios from 'axios';
import './GantiKode.css'
import { DeviceUUID } from 'device-uuid'


function GantiKode() {
  const [msg, setMsg] = useState('');
  const [popup, setPopup] = useState('');
  const [ip, setIp] = useState('0')
  const [kodeAksesLama, setKodeAksesLama] = useState('')
  const [kodeAksesBaru, setKodeAksesBaru] = useState('')
  const [konfKodeAksesBaru, setKonfKodeAksesBaru] = useState('')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [network, setNetwork] = useState('pending');
  const [page, setPage] = useState(false)
  const [otp, setOtp] = useState('');
  const [limitResendCode, setLimitResendCode] = useState(10)
  const navigate = useNavigate();

  const pin1Ref = useRef(null);
  const pin2Ref = useRef(null);
  const pin3Ref = useRef(null);
  const pin4Ref = useRef(null);

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');

  const getDataIp = async () => {
    const du = new DeviceUUID().parse();
    let dua = [
      du.language,
      du.platform,
      du.os,
      du.cpuCores,
      du.isAuthoritative,
      du.silkAccelerated,
      du.isKindleFire,
      du.isDesktop,
      du.isMobile,
      du.isTablet,
      du.isWindows,
      du.isLinux,
      du.isLinux64,
      du.isMac,
      du.isiPad,
      du.isiPhone,
      du.isiPod,
      du.isSmartTV,
      du.pixelDepth,
      du.isTouchScreen
    ];
    let uuid = du.hashMD5(dua.join(':'));
    setIp(uuid)
  }

  useEffect(() => {
    getDataIp()
    Logout()
  }, [])

  useEffect(() => {
    cekLimitResendCode()
  }, [page])

  useEffect(() => {
    const hitungMundur = setInterval(() => {
      setLimitResendCode(limitResendCode - 1);
    }, 1000);

    return () => clearInterval(hitungMundur);
  }, [limitResendCode]);

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

  const handleKlik = () => {
    if (kodeAksesLama.trim() === '' && kodeAksesBaru.trim() === '' && konfKodeAksesBaru.trim() === '' && email.trim() === '') {
      setMsg("Lengkapi data dengan benar.");
      setPopup('error')
      return false
    }
    if (kodeAksesLama === kodeAksesBaru) {
      setMsg("Kode akses baru tidak boleh sama dengan kode akses baru.");
      setPopup('error')
      return false
    }
    setPopup('pin')
  }


  const cekPin = () => {
    setPopup('loading')
    if (pin.length !== 6) {
      setMsg("107 - PIN harus 6 berisi huruf.");
      setPin('')
      setPopup('error')
      return false
    }
    getUserNameByEmail()
  }

  const getUserNameByEmail = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getInfoUsernameByEmail', {
        email: email
      })
      sendReqOtp(response.data.nama)
    } catch (error) {
      setPage(false)
      setMsg(error.response.data.msg)
      setPopup('error')
    }
  }

  const sendReqOtp = async (nama) => {
    try {
      // send otp
      await axios.post('http://localhost:5000/otp', {
        nama: nama,
        emailTo: email,
        ip_address: ip
      })
      setPage(true)
      setPopup('')
    } catch (error) {
      setLimitResendCode(error.response.data.time);
      setPopup('')
    }
  }

  const cekLimitResendCode = async () => {
    const response = await axios.post('http://localhost:5000/otp/ceklimit', {
      ip_address: ip
    })
    setLimitResendCode(response.data.time);
  }

  const OtpAuth = async () => {
    try {
      await axios.post('http://localhost:5000/otp/auth', {
        emailTo: email,
        otpKode: otp,
        ip_address: ip
      })
      requestGantiKode()

    } catch (error) {
      setMsg(error.response.data.msg);
      setPopup('error')
      setPin1('')
      setPin2('')
      setPin3('')
      setPin4('')
    }
  }

  const requestGantiKode = async () => {
    try {
      await axios.post('http://localhost:5000/gantikode', {
        kodeLama: kodeAksesLama,
        kodeBaru: kodeAksesBaru,
        konfirmKodeBaru: kodeAksesBaru,
        pin: pin,
        email: email,
        ip_address: ip
      })
      clearInput()
      setMsg('Selamat, kode akses dan perangkat berhasil di perbarui.')
      setPopup('sukses')

    } catch (error) {
      clearInput()
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      setPopup('error')
    }
  }

  const clearInput = () => {
    setPin('')
    setKodeAksesLama('')
    setKodeAksesBaru('')
    setKonfKodeAksesBaru('')
    setEmail('')
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
            <p style={{ fontSize: 14, fontWeight: 500, }} >m-BCA</p>
            <p style={{ display: 'block', height: 204, width: 187, marginTop: 17, textAlign: 'left' }}>{msg}</p>
            <div className="action">
              <div onClick={() => { setPopup(''); navigate('/') }}><Btn label="OK" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'loading') {
      return (
        <div className="popup" style={popup === 'loading' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup" style={{ borderRadius: 10, width: '90%', minHeight: 98, textAlign: 'center', top: 250, backgroundColor: '#fff' }}>
            <img src={loader} alt="loading" style={{ width: 34, height: 34 }} />
            <p style={{ height: 12, width: 54, margin: '10px auto', textAlign: 'center', color: '#000' }}>Sending</p>
          </div>
        </div>
      )
    }
  }

  function hideEmail(email) {
    const [username, domain] = email.split("@");
    const obscuredUsername = username.slice(0, 3) + "***" + username[username.length - 1];
    const formattedEmail = obscuredUsername + "@" + domain;
    return formattedEmail
  }

  useEffect(() => {
    setOtp(pin1 + "" + pin2 + "" + pin3 + "" + pin4)
  }, [pin1, pin2, pin3, pin4, otp]);

  const verifikasiOtp = () => {
    return (
      <>
        <div className='topbar-send'>
          <div className='send' onClick={() => { setPage(false); clearInput() }} style={{ position: 'absolute', left: 20, background: 'linear-gradient(to bottom, #B2B2B2, #5E5E5E)' }}>Close</div>
          <p>BAC mobile</p>
          <div>
            <div className={network}></div>
            <div className='send' style={{ visibility: otp.length === 4 ? 'visible' : 'hidden' }} onClick={() => { setPopup('loading'); OtpAuth() }}>Send</div>
          </div>
        </div>
        <div className="verifikasi-otp">
          <p>Masukkan Kode OTP</p>
          <p>Demi keamanan Anda, silakan masukkan kode OTP yang telah kami kirimkan ke email Anda untuk verifikasi ganti kode akses BCA mobile.</p>
          <p>{hideEmail(email)}</p>
          <div>
            <input ref={pin1Ref} type="text" maxLength={1} onKeyDown={e => numberOnly(e)} value={pin1} onChange={e => {
              setPin1(e.target.value);
              pin1 != null ? pin2Ref.current.focus() : pin1Ref.current.focus();
            }
            }
              style={{ border: pin1 !== '' ? '2px solid #013682' : '2px solid #B0B0B0' }} />
            <input ref={pin2Ref} type="text" maxLength={1} onKeyDown={e => numberOnly(e)} value={pin2} onChange={e => {
              setPin2(e.target.value);
              pin2 != null ? pin3Ref.current.focus() : pin2Ref.current.focus();
            }
            } style={{ border: pin2 !== '' ? '2px solid #013682' : '2px solid #B0B0B0' }} />
            <input ref={pin3Ref} type="text" maxLength={1} onKeyDown={e => numberOnly(e)} value={pin3} onChange={e => {
              setPin3(e.target.value);
              pin3 != null ? pin4Ref.current.focus() : pin3Ref.current.focus();
            }
            } style={{ border: pin3 !== '' ? '2px solid #013682' : '2px solid #B0B0B0' }} />
            <input ref={pin4Ref} type="text" maxLength={1} onKeyDown={e => numberOnly(e)} value={pin4} onChange={e => {
              setPin4(e.target.value);
              pin4 != null ? pin1Ref.current.focus() : pin4Ref.current.focus();
            }
            } style={{ border: pin4 !== '' ? '2px solid #013682' : '2px solid #B0B0B0' }} />
          </div>
          <p>Tidak menerima Kode OTP ?</p>
          {limitResendCode <= 0 ? (
            <p style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => limitResendCode <= 0 ? sendReqOtp() : console.log('Error')}>Kirim Kode OTP</p>
          ) : (
            <p>Kirim ulang kode dalam {limitResendCode} detik</p>
          )}
        </div>
      </>
    )
  }

  const formGantiKode = () => {
    return (
      <>
        <TopbarPolos />
        <div className='topbar-btn'>
          <Link to='/' >Cancel</Link>
          <div type='submit' onClick={handleKlik} >OK</div>
        </div>
        <div className="ganti-kode">
          <div className="card-formKode">
            <div className="input-formKode">
              <p>Kode Akses Saat ini</p>
              <div>
                <input type="password" maxLength={6} placeholder='Input 6 alphanum' value={kodeAksesLama} onChange={e => setKodeAksesLama(e.target.value)} />
                <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
              </div>
            </div>
            <div className="input-formKode">
              <p>Kode Akses Baru</p>
              <div>
                <input type="password" maxLength={6} placeholder='Input 6 alphanum' value={kodeAksesBaru} onChange={e => setKodeAksesBaru(e.target.value)} />
                <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
              </div>
            </div>
            <div className="input-formKode">
              <p>Konfirmasi Kode Akses Baru</p>
              <div>
                <input type="password" maxLength={6} placeholder='Input 6 alphanum' value={konfKodeAksesBaru} onChange={e => setKonfKodeAksesBaru(e.target.value)} />
                <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
              </div>
            </div>
            <div className="input-formKode">
              <p>Email</p>
              <div>
                <input type="email" placeholder='Input email terdaftar' value={email} onChange={e => setEmail(e.target.value)} />
                <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className='container'>
      {Popup(popup)}
      {page ? verifikasiOtp() : formGantiKode()}
    </div>
  )
}

export default GantiKode