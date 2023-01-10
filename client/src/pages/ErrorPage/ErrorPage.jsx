import React from 'react'
import { useNavigate } from 'react-router-dom'
import BtnBig from '../../components/BtnBig'
import TopbarPolos from '../../components/TopbarPolos'
import Navbar from '../../components/Navbar';
import './ErrorPage.css'

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="popup-error" style={{ display: 'block' }}>
        <div className="card-popup">
          <p>Mohon maaf fitur ini sedang dalam tahap pengembangan.</p>
          <div className="action">
            <div onClick={() => { navigate('/home') }}><BtnBig label="Back" /></div>
          </div>
        </div>
      </div>
      <TopbarPolos />
      <div className='error-page'></div>
      <Navbar />
    </div>
  )
}

export default ErrorPage