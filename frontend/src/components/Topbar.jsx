import React from 'react'
import bcaBlue from '../assets/Svg/bca-blue.svg'
import logoutIcon from '../assets/Svg/logout.svg'
import './Topbar.css'
import { useGlobalState } from '../store/state'

function Topbar(props) {
  const { logoutSet } = useGlobalState(state => state)

  return (
    <div className="topbar">
      <img src={bcaBlue} alt="bca blue" />
      <div>
        <div className={props.network} ></div>
        <div onClick={logoutSet} className={(props.logout === 'disable') ? "logout-none" : "logout"}><img src={logoutIcon} alt="logout icon" /></div>
      </div>
    </div>
  )
}

export default Topbar