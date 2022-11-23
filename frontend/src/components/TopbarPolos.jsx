import React from 'react'

const style1 = {
  width: "100%",
  height: "58px",
  backgroundColor: "#F8F8F8",
  textAlign: "center",
  padding: "20px"
}

const style2 = {
  fontSize: "15px",
  color: "#015A9E",
  fontWeight: "500"
}

function TopbarPolos() {
  return (
    <div style={style1}>
      <p style={style2}>BCA mobile</p>
    </div>
  )
}

export default TopbarPolos