import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Topbar from '../../components/Topbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import mTransfer from '../../assets/Svg/m-transfer.svg'
import './TransferList.css'
import { Link } from 'react-router-dom';

function TransferList() {
  const [network, setNetwork] = useState('pending');

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

  return (
    <div className='container'>
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={network}></div>
          <div className='send' style={{ visibility: 'hidden' }}></div>
        </div>
      </div>
      <div className="m-transfer">
        <div className="card-transfer">
          <div className="header-transfer">
            <img src={mTransfer} alt="icon" />
            <p>m-Transfer</p>
          </div>
          <div className="menu-transfer">
            <div className="label-list-transfer">
              <p>Daftar Transfer</p>
            </div>
            <Link to='/daftar-rekening' className="list-transfer">
              <p>Antar Rekening</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <Link to='/daftar-antarBank' className="list-transfer">
              <p>Antar Bank</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <div className="label-list-transfer">
              <p>Transfer</p>
            </div>
            <Link to='/transfer-rekening' className="list-transfer">
              <p>Antar Rekening</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <Link to='/transfer-antarbank' className="list-transfer">
              <p>Antar Bank</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
          </div>
        </div>
      </div>
      <Navbar active="transaksi" />
    </div>
  )
}

export default TransferList