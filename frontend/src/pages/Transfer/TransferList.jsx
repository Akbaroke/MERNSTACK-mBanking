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
    } else if (currRtt >= 10 && currRtt <= 300) {
      setNetwork('online')
    } else {
      setNetwork('pending')
    }
  }, 500);
  return (
    <div className='container'>
      <Topbar logout='disable' network={network} />
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
            <Link to='/daftar-antarBank' className="list-transfer">
              <p>Antar Rekening</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
            <div className="list-transfer">
              <p>Antar Bank</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="label-list-transfer">
              <p>Transfer</p>
            </div>
            <div className="list-transfer">
              <p>Antar Rekening</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="list-transfer">
              <p>Antar Bank</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
      <Navbar active="transaksi" />
    </div>
  )
}

export default TransferList