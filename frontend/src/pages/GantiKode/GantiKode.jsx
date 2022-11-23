import React, { useEffect, useState } from 'react'
import './GantiKode.css'
import TopbarBtn from '../../components/TopbarBtn';
import TopbarPolos from '../../components/TopbarPolos';

function GantiKode() {
  const [ip, setIp] = useState('0')

  const getDataIp = async () => {
    const response = await fetch('https://ipwho.is/');
    const ipcode = await response.json();
    setIp(ipcode.ip)
  }

  useEffect(()=>{
    getDataIp()
  })

  return (
    <div className='container'>
      <TopbarPolos />
      <TopbarBtn />
      <div className="ganti-kode">
      <p>ip : {ip}</p>
      </div>
    </div>
  )
}

export default GantiKode