const express = require('express')
const Practitioner = require('./schemas/practitioner')
const FHIRClient = require('./client')
const bcrypt = require('bcrypt')

const fhir = new FHIRClient()

const router = express.Router()

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

module.exports = router