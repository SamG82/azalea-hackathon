const axios = require('axios')
require('dotenv').config()

class FHIRClient {
    constructor() {
        this.axios = axios.create({
            baseURL: process.env.ROOT_URL,
            headers: {'Authorization': `Bearer ${process.env.TOKEN}`}
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
    
        const formattedTime = `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
        return formattedTime;
    }

    createProcedure(firstName, lastName, patientID){
        const data = {
                "resourceType": "Procedure",
                "meta": {
                    "lastUpdated": this.getCurrentTime,
                    "profile": [
                        "https://app.azaleahealth.com/fhir/R4/142443/StructureDefinition/Procedure",
                        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure"
                    ]
                },
                "status": "unknown",
                "code": {
                    "coding": [
                        {
                            "system": "http://www.ama-assn.org/go/cpt",
                            "code": "66982",
                            "display": "XCAPSL CTRC RMVL CPLX WO ECP"
                        }
                    ],
                    "text": "XCAPSL CTRC RMVL CPLX WO ECP"
                },
                "subject": {
                    "reference": `Patient/${patientID}`,
                    "type": "Patient",
                    "display": `${firstName} ${lastName}`
                },
                "performedPeriod": {
                    "start": this.getCurrentTime
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