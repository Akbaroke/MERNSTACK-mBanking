import React from 'react'
import './Btn.css'

function Btn(props) {
  return (
    <div className='btn'>
      {props.label}
    </div>
  )
}

export default Btn