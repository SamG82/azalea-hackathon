const axios = require('axios')
require('dotenv').config()

class FHIRClient {
    constructor() {
        this.axios = axios.create({
            baseURL: process.env.ROOT_URL,
            headers: {'Authorization': `Bearer ${process.env.TOKEN}`}
        })
    }

    async getAllPatients() {
        const response = await this.axios.get('/Patient')
        return response.data.entry.map((patient, _) => {
            return {
                id: patient.resource.id,
                displayName: patient.resource.name[0].text
            }
        })
    }

    async addFamilyNumber(patientId, familyPhoneNumber) {
        const response = await this.axios.get(`/Patient/${patientId}`);
        const patientData = response.data;
    
        const selectedPatient = {
            id: patientData.id,
            displayName: patientData.name[0].text,
            phoneNumber: familyPhoneNumber 
        };
        console.log(selectedPatient)
        return selectedPatient;
    }
    createPractioner(firstName, lastName, npi) {
        const data = {
            "name": [
                {
                    "use": "usual",
                    "text": `${firstName} ${lastName}`,
                    "family": lastName,
                    "given": [
                        firstName
                    ]
                }   
            ],
            "identifier": [
                {
                    "type": {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "NPI" 
                            }
                        ]
                    },
                    "system": "http://hl7.org/fhir/sid/us-npi",
                    "value": npi
                }
            ]
        }

        this.axios.post('/Practitioner', data)
        .then(response => console.log(response.status))
        .catch(err => {
            console.log(err)
        })
    }

    createPatient(firstName, lastName, dateOfBirth, phoneNumber) {
         const data = {
                    "active": true,
                    "name": [
                        {
                            "use": "usual",
                            "text": `${firstName} ${lastName}`,
                            "family": lastName,
                            "given": [
                                firstName
                            ]
                        }
                    ],
                    "telecom": [
                        {
                            "system": "phone",
                            "value": phoneNumber,
                            "use": "home"
                        }
                    ],

                    "birthDate": dateOfBirth
        }

        this.axios.post('/Patient', data)
        .then(response => console.log(response.data))
        .catch(err => {
            console.log(err)
        })
    }


    getCurrentTime() {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
    
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return formattedTime;
    }

    createProcedure(text, firstName, lastName, patientID){
        const data = {
                "status": "preparation",
                "code": {
                    "coding": [
                        {
                            "system": "http://www.ama-assn.org/go/cpt",
                            "code": "66982",
                            "display": text
                        }
                    ],
                    "text": text
                },
                "subject": {
                    "reference": `Patient/${patientID}`,
                    "type": "Patient",
                    "display": `${firstName} ${lastName}`
                },
                "performedPeriod": {
                    "start": this.getCurrentTime()
                }
        }   
            this.axios.post('/Procedure', data)
            .then(response => console.log(response.data))
            .catch(err => {
            console.log(err)
        })
    }

}



module.exports = FHIRClient