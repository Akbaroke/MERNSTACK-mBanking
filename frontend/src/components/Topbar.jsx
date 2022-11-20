import React from 'react'
import { Link } from 'react-router-dom'
import bcaBlue from '../assets/Svg/bca-blue.svg'
import logoutIcon from '../assets/Svg/logout.svg'
import { Detector } from "react-detect-offline";
import './Topbar.css'

function Topbar() {
  return (
    <div className="topbar">
        <Detector
          render={({ online }) => (
            <>
              <img src={bcaBlue} alt="bca blue" />
              <div>
                <div className={online ? "online" : "offline"} ></div>
                <Link to="/" className="logout"><img src={logoutIcon} alt="logout icon" /></Link>
              </div>
            </>
          )}
        />
    </div>
  )
}

export default Topbar