import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../client'
import './practitioner-login.css'

function PractitionerLogin() {
    const email = useRef('')
    const password = useRef('')
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const attemptLogin = (e) => {
        e.preventDefault()
        client.post('/users/practitioner/login', {
            email: email.current.value,
            password: password.current.value
        })
        .then(_ => navigate('/practitioner-dashboard'))
        .catch(err => {
            setError(err.response.data.error)
            console.log(err.response.data.error)
        })
    }
    return (
        <div className='account-form-container'>
            <h1 className='form-title'>Practitioner Login</h1>
            <form className='account-form'>
                <input type='text' ref={email} placeholder='Email'/>
                <input type='password' ref={password} placeholder='Password'/>
                <button onClick={e => attemptLogin(e)} className='submit-button'>Submit</button>
            </form>
            {error.length != '' && <h2 className='form-error'>{error}</h2>}
            <Link className='practitioner-register' to={'/practitioner-register'}>Don't have a practitioner account yet?</Link>
        </div>
    )
}

export default PractitionerLogin