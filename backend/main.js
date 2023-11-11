const usersRouter = require('./users')
const mongoose = require('mongoose')
const express = require('express')
require('dotenv').config()

const FHIRClient = require('./client')
require('dotenv').config()

const root_url = process.env.ROOT_URL
const token = process.env.TOKEN

const fhir = new FHIRClient(root_url, token)

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PW}@cluster0.sccfncw.mongodb.net/?retryWrites=true&w=majority`)
    
    const app = express()
    app.use(express.json())
    app.use('/users', usersRouter)

    app.listen(3000, () => {
        console.log('Server started on port 3000')
    })
}

main()
