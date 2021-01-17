import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'

import cors from 'cors'
import { log, ExpressAPILogMiddleware } from '@rama41222/node-logger'

import DataFlowManager from './google-cloud/dataFlow'
import BigQueryManager from './google-cloud/bigQuery'

const GOOGLE_CLOUD_PUB_SUB_TOPIC_NAME: string = process.env.GOOGLE_CLOUD_PUB_SUB_TOPIC_NAME || "projects/codewayassignment/topics/eventpushertopic"

const config = {
    name: 'event-pusher',
    port: 3000,
    host: '0.0.0.0',
}

const app: Application = express()
const logger = log({ console: true, file: false, label: config.name })

app.use(bodyParser.json())
app.use(cors())
app.use(ExpressAPILogMiddleware(logger, { request: true }))

app.get('/', async (req: Request, res: Response) => {

    let [
        numberOfDailyActiveUsers, 
        numberOfTotalUsers,
        averageSessionDuration,
    ] = await Promise.all([
        BigQueryManager.getInstance().queryForNumberOfDailyActiveUsers(), 
        BigQueryManager.getInstance().queryForNumberOfTotalUsers(),
        BigQueryManager.getInstance().queryForAverageSessionDuration(),
    ]);

    const response = {
        "dailyActiveUsers": numberOfDailyActiveUsers,
        "totalUsers": numberOfTotalUsers,
        "averageSessionDuration": averageSessionDuration
    }
    res.status(200).send(response)
})

app.post('/event', (req: Request, res: Response) => {
    const message: any = req.body
    const pubSubTopicName: string = GOOGLE_CLOUD_PUB_SUB_TOPIC_NAME

    DataFlowManager.getInstance().publishMessage(JSON.stringify(message), pubSubTopicName)

    const response = { message: "Message is received and saved." }
    res.status(201).send(response)
})

app.listen(config.port, config.host, () => {
    console.log(`⚡️[server]: Server is running at https://${config.host}:${config.port}`);
});
