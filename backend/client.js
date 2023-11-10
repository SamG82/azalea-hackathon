const axios = require('axios')


const fakeNPI = 1172881645

class FHIRClient {
    constructor(base_url, token) {
        this.axios = axios.create({
            baseURL: base_url,
            headers: {'Authorization': `Bearer ${token}`}
        })
    }

    createPractioner(firstName, lastName) {
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
                    "value": fakeNPI
                }
            ]
        }

        this.axios.post('/Practitioner', data)
        .then(response => console.log(response.data))
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

}



module.exports = FHIRClient