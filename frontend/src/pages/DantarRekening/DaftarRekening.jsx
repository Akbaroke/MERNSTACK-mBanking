import React from 'react'
import Navbar from '../../components/Navbar'
import './DaftarRekening.css'

function DaftarRekening() {
  return (
    <div className='container'>
      <div className='topbar-send'>
        <p>m-Transfer</p>
        <div>
          <div className={'online'}></div>
          <div className='send' onClick={''}>Send</div>
        </div>
      </div>
      <div className="daftarRekening">
        <p>hallo</p>
      </div>
      <Navbar active="transaksi" />
    </div>
  )
}

export default DaftarRekening