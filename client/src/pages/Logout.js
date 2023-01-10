import axios from 'axios';

async function Logout() {
  try {
    await axios.delete('http://localhost:5000/logout')
  } catch (error) {
    console.log(error);
  }
}

export default Logout