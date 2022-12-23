import React, { useState } from 'react'

function TransferAntarBank() {
  const [network, setNetwork] = useState('pending');
  const [page, setPage] = useState(false);

  setInterval(() => {
    let currRtt = navigator.connection.rtt;
    if (currRtt === 0 || currRtt === 2000) {
      setNetwork('offline')
    } else if (currRtt >= 10 && currRtt <= 300) {
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
      <div className="formTransferBank">
        <p>hallo</p>
      </div>
    </div>
  )
}

export default TransferAntarBank