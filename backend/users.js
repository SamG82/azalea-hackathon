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

router.post('/patient/register', async (req, res) => {
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
                email: req.body.email,
                familyContact: req.body.familyContact
            })
        
            newPatient.save().then(() => {
                console.log('created')
                fhir.createPatient(req.body.firstName, req.body.lastName, req.body.email, req.body.familyContact)
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
            const jwt = createJWT(practitioner._id, 'practitioner')
            
            if (status) {
                res.cookie('token', JSON.stringify(jwt), {
                    httpOnly: true
                })
    
                return res.sendStatus(200)
            } else {
                return res.status(401).json({'error': 'Invalid username or password'})
            }
            
        })
})

module.exports = router