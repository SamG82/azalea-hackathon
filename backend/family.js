const mongoose = require('mongoose');

const Patient = require('./schemas/patient')


async function addPhoneNumberToPatient(firstName, lastName, phoneNumber) {
  try {
    const patient = await Patient.findOne({ firstName, lastName })

    if (!patient) {
      console.log('Patient not found');
      return;
    }

    patient.familyContact.push(phoneNumber);

    await patient.save();

    console.log('Phone number added successfully');
  } catch (error) {
    console.error('Error adding phone number:', error.message);
  }
}

module.exports = addPhoneNumberToPatient;