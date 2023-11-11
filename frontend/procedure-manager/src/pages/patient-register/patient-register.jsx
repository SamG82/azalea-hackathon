import './patient-register.css'
import { useRef, useState } from 'react'
import client from '../../client'
import { useNavigate } from 'react-router-dom'

function PatientRegister() {
    const email = useRef('')
    const password = useRef('')
    const firstName = useRef('')
    const lastName = useRef('')
    
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const submitUser = (e) => {
        e.preventDefault()
        client.post('/users/patient/register', {
            email: email.current.value,
            password: password.current.value,
            firstName: firstName.current.value,
            lastName: lastName.current.value,
        })
        .then(_ => navigate('/patient-login'))
        .catch(err => setError(err.response.data.error))
    }
    return (
        <div className='account-form-container'>
            <h1 className='form-title'>Patient Register</h1>
            <form className='account-form'>
                <input type='text' ref={firstName} placeholder='First Name'/>
                <input type='text' ref={lastName} placeholder='Last name'/>
                <input type='text' ref={email} placeholder='Email'/>
                <input type='password' ref={password} placeholder='Password'/>
                <button onClick={e => submitUser(e)}className='submit-button'>Submit</button>
            </form>
            {error.length != '' && <h2 className='form-error'>{error}</h2>}
        </div>
    )
}

export default PatientRegister