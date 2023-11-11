import { useRef, useState } from "react"
import client from "../../client"
import { useNavigate } from "react-router-dom"

function PatientLogin() {
    const email = useRef('')
    const password = useRef('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const attemptLogin = (e) => {
        e.preventDefault()
        client.post('/users/patient/login', {
            email: email.current.value,
            password: password.current.value
        })
        .then(_ => navigate('/patient-dashboard'))
        .catch(e => setError(e.response.data.error))
    }
    return (
        <div className='account-form-container'>
            <h1 className='form-title'>Patient Login</h1>
            <form className='account-form'>
                <input type='text' ref={email} placeholder='Email'/>
                <input type='password' ref={password} placeholder='Password'/>
                <button onClick={e => attemptLogin(e)} className='submit-button'>Submit</button>
            </form>
            {error.length != '' && <h2 className='form-error'>{error}</h2>}
        </div>
    )
}

export default PatientLogin