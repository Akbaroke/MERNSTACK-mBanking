import React from 'react'

const style1 = {
  width: "100%",
  height: "57px",
  background: "linear-gradient(180deg, rgba(72,72,72,1) 0%, rgba(0,0,0,1) 100%)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px"
}

const style2 = {
  width: "150px",
  height: "30px",
  borderRadius: "5px",
  background: "linear-gradient(180deg, rgba(22,152,232,1) 0%, rgba(10,98,176,1) 32%, rgba(1,54,130,1) 90%)",
  color: "#fff",
  fontSize: "12px",
  textAlign: "center",
  padding: "8px",
  cursor: "pointer",
}

function TopbarBtn() {
  return (
    <div style={style1}>
      <div style={style2}>Cancel</div>
      <div style={style2}>OK</div>
    </div>
  )
}

export default TopbarBtn