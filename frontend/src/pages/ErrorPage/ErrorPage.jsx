import React from 'react'
import { useNavigate } from 'react-router-dom'
import BtnBig from '../../components/BtnBig'
import TopbarPolos from '../../components/TopbarPolos'
import Navbar from '../../components/Navbar';

function ErrorPage() {
  const navigate = useNavigate();

  const styles = {
    errorPage: {
      backgroundColor: '#B4B4B4',
      width: '100%',
      minHeight: '90vh'
    },
    '@media (min-height: 830px)': {
      errorPage: {
        minHeight: '682px'
      },
    },
  };

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
      <div style={styles.errorPage}></div>
      <Navbar />
    </div>
  )
}

export default ErrorPage