import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './DaftarAntarBank.css'

function DaftarAntarBank() {
  const [network, setNetwork] = useState('pending');


  setInterval(() => {
    let currRtt = navigator.connection.rtt;
    if (currRtt === 0 || currRtt === 2000) {
      setNetwork('offline')
    } else if (currRtt >= 100 && currRtt <= 300) {
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
          <div className='send'>Send</div>
        </div>
      </div>
      <div className="daftarAntarBank">
        <div className="card-daftarAntarBank">
          <div>
            <p>No.Rekening Tujuan</p>
            <input type="text" value="" />
          </div>
          <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
        </div>
        <div className="card-daftarAntarBank">
          <div>
            <p>Bank</p>
            <select name="" id="">
              <option value="">-PILIH-</option>
            </select>
          </div>
          <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
        </div>
      </div>
    </div>
  )
}

export default DaftarAntarBank