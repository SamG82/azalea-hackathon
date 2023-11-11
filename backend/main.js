const usersRouter = require('./users')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
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
        
    app.use(cookieParser())
    app.use(cors(corsOptions))
    app.use(express.json())
    app.use('/users', usersRouter)

    app.get('/patients', async (req, res) => {
        let payload = {}
        try {
            payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        } catch(err) {
            console.log(err)
            return res.sendStatus(401)
        }

        if (payload.role != 'practitioner') {
            return res.sendStatus(401)
        }

        const patients = await fhir.getAllPatients()
        res.json(patients)
    })
    
    app.post('/procedure', async(req, res) => {
        let payload = {}
        try {
            payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        } catch(err) {
            console.log(err)
            return res.sendStatus(401)
        }

        if (payload.role != 'practitioner') {
            return res.sendStatus(401)
        }
        
        fhir.createProcedure(req.body.code, req.body.displayName, req.body.id)
        res.sendStatus(200)
    })

    app.get('/procedure', async(req, res) => {
        let payload = {}
        try {
            payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        } catch(err) {
            console.log(err)
            return res.sendStatus(401)
        }

        if (payload.role != 'patient') {
            return res.sendStatus(401)
        }

        fhir.getProcedures()
    })
    

    app.listen(3000, () => {
        console.log('Server started on port 3000')
    })
}

main()
