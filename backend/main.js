const usersRouter = require('./users')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const FHIRClient = require('./client')
require('dotenv').config()

const root_url = process.env.ROOT_URL
const token = process.env.TOKEN

const fhir = new FHIRClient(root_url, token)

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PW}@cluster0.sccfncw.mongodb.net/?retryWrites=true&w=majority`)
    
    const app = express()

    const corsOptions = {
        credentials: true,
        origin: ['http://localhost:5173']
    }
    
    const result = await fhir.getAllPatients()
    console.log(result)

    app.get('/patients', async (req, res) => {
        const patients = await fhir.getAllPatients();
        res.json(patients);
    });
    
    app.use(cors(corsOptions))
    app.use(cookieParser())
    app.use(express.json())
    app.use('/users', usersRouter)

    app.listen(3000, () => {
        console.log('Server started on port 3000')
    })
}

main()
