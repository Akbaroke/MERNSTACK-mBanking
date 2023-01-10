import React from 'react'
import './Btn.css'

function BtnBig(props) {
  return (
    <div className='btn-big'>
      {props.label}
    </div>
  )
}

export default BtnBig