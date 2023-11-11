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

    createProcedure(code, displayName, patientID){
        console.log(`${code} ${displayName} ${patientID}`)
        const data = {
                "resourceType": "Procedure",
                "status": "unknown",
                "code": {
                    "coding": [
                        {
                            "system": "http://www.ama-assn.org/go/cpt",
                            "code": code,
                        }
                    ],
                },
                "subject": {
                    "reference": `Patient/${patientID}`,
                    "type": "Patient",
                    "display": displayName
                },
                "performedPeriod": {
                    "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
                            "valueCode": "unknown"
                        }
                    ]
                }
        }   
            this.axios.post('/Procedure', data)
            .then(response => console.log(response.headers['Location']))
            .catch(err => {
            console.log(err.response.data.issue)
        })
    }

    async getProcedures(firstName, lastName) {
        
    }

}



module.exports = FHIRClient