import './App.css'
import { Link } from 'react-router-dom'

function App() {

  return (
    <div className='app'>
      <h1>Procedure Connect</h1>
      <h2>Keep your family members updated with your medical procedures.</h2>
      <div className='patient-buttons'>
        <Link to={'/patient-login'}>Login</Link>
        <Link to={'/patient-register'}>Register</Link>
      </div>
      <Link to={'/practitioner-login'} className='practitioner-login'>Practitioner Login</Link>
    </div>
  )
}

export default App
