import React from 'react'
import bacWhite from '../../assets/Svg/bac-white.svg'
import './About.css'

function About() {
  return (
    <div className="container">
      <div className='topbar-send'>
        <p>About</p>
        <div>
          <div className={'online'}></div>
          <div className='send' style={{ visibility: 'hidden' }}></div>
        </div>
      </div>
      <div className="about">
        <img src={bacWhite} alt="logo bac" />
        <div>
          <p>Version</p>
          <p>1.0.0 (Beta Test)</p>
        </div>
        <p>Ini adalah aplikasi hanya untuk pembelajaran saya sebagai developer dalam memahami algoritma aplikasi sejenis m-banking. Semua data yang di inputkan sudah terencrypt secara system sebelum dimasukkan ke dalam database.</p>
        <div>
          <div>Verifikasi Ulang Perangkat</div>
          <div>Ubah PIN</div>
          <div>Custom Nomor Rekening</div>
        </div>
      </div>
    </div>
  )
}

export default About