'use strict'

const { PubSub } = require(`@google-cloud/pubsub`);


class GoogleCloudManager {
    constructor() {
        this.pubSubClient = new PubSub()
        this.pubSubTopicName = process.env.GOOGLE_CLOUD_PUB_SUB_TOPIC_NAME
    }

    publishMessage = async (message) => {
        const dataBuffer = Buffer.from(message)

        try {
            const messageId = await this.pubSubClient.topic(this.pubSubTopicName).publish(dataBuffer)
            console.log(`Message ${messageId} published.`)
            return true
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}`)
            return false
        }
    }
}

module.exports = new GoogleCloudManager()
