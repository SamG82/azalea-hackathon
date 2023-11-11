const express = require('express')
const Practitioner = require('./schemas/practitioner')
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

router.post('/practitioner/register', async (req, res) => {
    const potentialPractitioner = await Practitioner.findOne({email: req.body.email})
    if (potentialPractitioner != null) {
        return res.json({'error': 'Email already in use'})
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
                fhir.createPractioner(req.body.firstName, req.body.lastName)
                res.sendStatus(200)
            })
        })
    })
})

router.post('/practitioner/login', async (req, res) => {
    const practitioner = await Practitioner.findOne({email: req.body.email})
    if (practitioner == null) {
        return res.json({'error': 'invalid username or password'})
    }

    console.log(practitioner._id.toString())
    bcrypt.compare(req.body.password, practitioner.password)
        .then(status => {
            const jwt = createJWT(practitioner._id, 'practitioner')
            res.cookie('token', JSON.stringify(jwt), {
                httpOnly: true
            })
            
            res.sendStatus(200)
        })
        .catch(err => {
            res.sendStatus(401)
        })
})

module.exports = router