import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../client'

import './practitioner-dashboard.css'

function CreateProcedureForm() {
    const [patients, setPatients] = useState([])
    const [selected, setSelected] = useState(0)
    const cptCode = useRef('')

    const createProcedure = (e) => {
        e.preventDefault()
        console.log(selected)
        console.log(cptCode.current.value)
        client.post('/procedure', {
            id: selected,
            code: cptCode.current.value
        }).then(response => {
            cptCode.current.value =''
            setSelected(0)
        })
    }

    useEffect(() => {
        client.get('/patients').then(response => {
            setPatients(response.data)
        })
    }, [])

    return (
        <div className='procedure-form'>
            <h2 className='select-a-patient'>Select a patient</h2>
            <div className='patient-selection'>
            {patients.map((patient, idx) => (
                <button
                    className={selected === patient.id ? 'patient-selected' : 'patient'}
                    key={idx}
                    onClick={e => setSelected(patient.id)}
                    >{patient.displayName}</button>
            ))}
            </div>
            <div className='account-form-container'>
            <form className='account-form'>
                <input type='text' ref={cptCode} placeholder='CPT Code'/>
                <button onClick={e => createProcedure(e)} className='submit-button'>Submit</button>
            </form>
        </div>
        </div>
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