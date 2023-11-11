const express = require('express')
const Practitioner = require('./schemas/practitioner')
const Patient = require('./schemas/patient')
const FHIRClient = require('./client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const fhir = new FHIRClient()
const router = express.Router()

const createJWT = (id, role) => {
    return jwt.sign({
        id,
        role
    }, process.env.JWT_SECRET)
}
router.get('/practitioner', async(req, res) => {
    let payload = {}
    try {
        payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    } catch(err) {
        console.log(err)
        return res.sendStatus(401)
    }

    const practitioner = await Practitioner.findById(payload.id)
    
    res.json({name: practitioner.firstName})
})

router.post('/patient/login', async(req, res) => {
    const patient = await Patient.findOne({email: req.body.email})
    if (patient == null) {
        return res.status(401).json({'error': 'Invalid username or password'})
    }

    bcrypt.compare(req.body.password, patient.password)
        .then(status => {
            const new_token = createJWT(patient._id, 'practitioner')
            
            console.log(status)
            if (status) {
                res.cookie('token', new_token, {
                    httpOnly: true
                })
    
                return res.sendStatus(200)
            } else {
                return res.status(401).json({'error': 'Invalid username or password'})
            }
            
        })
})

router.post('/patient/register', async(req, res) => {
    const potentialPatient = await Patient.findOne({email: req.body.email})
    if (potentialPatient != null) {
        return res.status(401).json({'error': 'Email already in use'})
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            const newPatient = new Patient({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                email: req.body.email
            })
        
            newPatient.save().then(() => {
                console.log('created')
                fhir.createPatient(req.body.firstName, req.body.lastName, req.body.email)
                res.sendStatus(200)
            })
        })
    })
})

router.post('/practitioner/register', async (req, res) => {
    const potentialPractitioner = await Practitioner.findOne({email: req.body.email})
    if (potentialPractitioner != null) {
        return res.status(401).json({'error': 'Email already in use'})
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            const newPractitioner = new Practitioner({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                email: req.body.email
            })
        
            newPractitioner.save().then(() => {
                console.log('created')
                fhir.createPractioner(req.body.firstName, req.body.lastName, req.body.npi)
                res.sendStatus(200)
            })
        })
    })
})

router.post('/practitioner/login', async (req, res) => {
    const practitioner = await Practitioner.findOne({email: req.body.email})
    if (practitioner == null) {
        return res.status(401).json({'error': 'Invalid username or password'})
    }

    bcrypt.compare(req.body.password, practitioner.password)
        .then(status => {
            const new_token = createJWT(practitioner._id, 'practitioner')
            
            if (status) {
                res.cookie('token', new_token, {
                    httpOnly: true
                })
    
                return res.sendStatus(200)
            } else {
                return res.status(401).json({'error': 'Invalid username or password'})
            }
            
        })
})

module.exports = router