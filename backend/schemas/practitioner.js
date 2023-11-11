const mongoose = require('mongoose')

const PractitionerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
})

const Practitioner = mongoose.model('Practitioner', PractitionerSchema)

module.exports = Practitioner
