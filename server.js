'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger')
const GoogleCloudManager = require('./googleCloudManager')

const config = {
    name: 'event-pusher',
    port: 3000,
    host: '0.0.0.0',
}

const app = express()
const logger = log({ console: true, file: false, label: config.name })

app.use(bodyParser.json())
app.use(cors())
app.use(ExpressAPILogMiddleware(logger, { request: true }))

app.post('/event', (req, res) => {
    const message = req.body
    GoogleCloudManager.publishMessage(JSON.stringify(message))

    const response = { message: "Message is received and saved." }
    res.status(201).send(response)
})

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error')
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`)
})
