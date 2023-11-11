import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup'
import client from '../../client'
import './practitioner-dashboard.css'

function CreateProcedureForm() {
    return (
        <div className='account-form-container'>
            <form className='account-form'>
                <input type='text' ref={firstName} placeholder='First Name'/>
                <input type='text' ref={lastName} placeholder='Last name'/>
                <input type='text' ref={npi} placeholder='NPI'/>
                <input type='text' ref={email} placeholder='Email'/>
                <input type='password' ref={password} placeholder='Password'/>
                <button onClick={e => submitUser(e)}className='submit-button'>Submit</button>
            </form>
        </div>
        
    )
}

function PractitionerDashboard() {
    const [name, setName] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        client.get('/users/practitioner').then(response => {
            setName(response.data.name)
        }).catch(_ => {
            navigate('/practitioner-login')
        })
    }, [])

    return (
        <div className="practitioner-dashboard">
            <div className='header'>
                <h1>Practitioner Dashboard</h1>
                <h2 className='greeting'>Welcome back, {name}</h2>
                <span className='spacer'></span>
            </div>
            <div className='dashboard-main'>
                <Popup
                trigger={<button className='create-procedure'>Start Procedure</button>}
                position="bottom center"
                >
                    <CreateProcedureForm/>
                </Popup>
            </div>
        </div>
    )
}

export default PractitionerDashboard