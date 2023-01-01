import React from 'react'
import qris from '../assets/Svg/qris.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faWallet, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar(props) {
  const active = props.active

  return (
    <div className='navbar'>
      <div>
        <Link to='/home' className="btn-navbar" id={(active === "home") ? "active" : ""}>
          <FontAwesomeIcon icon={faHouse} />
          <p>Home</p>
        </Link>
        <Link to='/m-Transfer' className="btn-navbar" id={(active === "transaksi") ? "active" : ""}>
          <FontAwesomeIcon icon={faWallet} />
          <p>Transaksi</p>
        </Link>
      </div>
      <Link to='/error'><img className='qris' src={qris} alt="" /></Link>
      <div>
        <div className="btn-navbar" id={(active === "notifikasi") ? "active" : ""}>
          <FontAwesomeIcon icon={faBell} />
          <p>Notifikasi</p>
        </div>
        <Link to='/profil' className="btn-navbar" id={(active === "akun") ? "active" : ""}>
          <FontAwesomeIcon icon={faUser} />
          <p>Akun Saya</p>
        </Link>
      </div>
    </div>
  )
}

export default Navbar