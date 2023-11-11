const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    familyContact: [String]
})

const Patient = mongoose.model('Patient', PatientSchema)

module.exports = Patient