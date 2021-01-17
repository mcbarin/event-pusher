'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger')

const DataFlowManager = require('./google-cloud/dataFlow')
const BigQueryManager = require('./google-cloud/bigQuery')


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

app.get('/', async (req, res) => {

    let [
        numberOfDailyActiveUsers, 
        numberOfTotalUsers,
        averageSessionDuration,
    ] = await Promise.all([
        BigQueryManager.queryForNumberOfDailyActiveUsers(), 
        BigQueryManager.queryForTotalUsers(),
        BigQueryManager.queryForAverageSessionDuration(),
    ]);

    const response = {
        "dailyActiveUsers": numberOfDailyActiveUsers,
        "totalUsers": numberOfTotalUsers,
        "averageSessionDuration": averageSessionDuration
    }
    res.status(200).send(response)
})

app.post('/event', (req, res) => {
    const message = req.body
    const pubSubTopicName = process.env.GOOGLE_CLOUD_PUB_SUB_TOPIC_NAME

    DataFlowManager.publishMessage(JSON.stringify(message), pubSubTopicName)

    const response = { message: "Message is received and saved." }
    res.status(201).send(response)
})

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error')
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`)
})
