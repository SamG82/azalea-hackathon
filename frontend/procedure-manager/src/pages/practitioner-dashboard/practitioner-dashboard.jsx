import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../client'
import './practitioner-dashboard.css'

function CreateProcedureForm() {
    const cptCode = useRef('')
    return (
        <>
        <div className='patient-selection'>
            
        </div>
        <div className='account-form-container'>
            <form className='account-form'>
                <input type='text' ref={cptCode} placeholder='cptcode'/>
                <button className='submit-button'>Submit</button>
            </form>
        </div>
        </>
    )
}

function PractitionerDashboard() {
    const [name, setName] = useState('')
    const navigate = useNavigate()
    const [create, setCreate] = useState(false)

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
                <button onClick={e => setCreate(!create)} className='create-procedure'>Start Procedure</button>
                {create && <CreateProcedureForm/>}
            </div>
        </div>
    )
}

export default PractitionerDashboard