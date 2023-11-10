const FHIRClient = require('./client')
require('dotenv').config()

const root_url = process.env.ROOT_URL
const token = process.env.OATH

const fhir = new FHIRClient(root_url, token)


