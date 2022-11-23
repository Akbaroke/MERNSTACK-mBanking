import React from 'react'
import { Link } from 'react-router-dom'
import './TopbarBtn.css'

function TopbarBtn() {
  return (
    <div className='topbar-btn'>
      <Link to='/'>Cancel</Link>
      <Link to='/'>OK</Link>
    </div>
  )
}

export default TopbarBtn