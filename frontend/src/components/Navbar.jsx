import React from 'react'
import qris from '../assets/Svg/qris.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faWallet, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import './Navbar.css'

function Navbar(props) {

  const active = props.active

  return (
    <div className='navbar'>
      <div>
        <div className="btn-navbar" id={(active === "home") ? "active" : ""}>
          <FontAwesomeIcon icon={faHouse} />
          <p>Home</p>
        </div>
        <div className="btn-navbar" id={(active === "transaksi") ? "active" : ""}>
          <FontAwesomeIcon icon={faWallet} />
          <p>Transaksi</p>
        </div>
      </div>
      <img className='qris' src={qris} alt="" />
      <div>
        <div className="btn-navbar" id={(active === "notifikasi") ? "active" : ""}>
          <FontAwesomeIcon icon={faBell} />
          <p>Notifikasi</p>
        </div>
        <div className="btn-navbar" id={(active === "akun") ? "active" : ""}>
          <FontAwesomeIcon icon={faUser} />
          <p>Akun Saya</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar