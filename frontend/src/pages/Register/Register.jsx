import React from 'react'
import { Link } from 'react-router-dom'
import TopbarPolos from '../../components/TopbarPolos'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import './Register.css'

function Register() {
  return (
    <div className='container'>
      <TopbarPolos />
      <div className='topbar-btn'>
        <Link to='/' >Cancel</Link>
        <div onClick={''} >OK</div>
      </div>
      <div className="register">
      <div className="card-register">
        <div className="input-register">
          <p>Nama</p>
          <div>
            <input type="text" placeholder='Input nama lengkap' />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Email</p>
          <div>
            <input type="text" placeholder='Input email aktif' />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Password</p>
          <div>
            <input type="text" placeholder='Input password' />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Konfirm Password</p>
          <div>
            <input type="text" placeholder='Input ulang password' />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>PIN</p>
          <div>
            <input type="text" placeholder='Input 6 angka' />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Jenis Card</p>
          <div>
            <select id='select-card'>
              <option value="">- Pilih kartu -</option>
              <option value="blue">Blue</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
        <div className="input-register">
          <p>Kode Akses</p>
          <div>
            <input type="text" placeholder='Input 6 alphanum' />
            <FontAwesomeIcon className='icon-formKode' icon={faChevronRight} />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Register