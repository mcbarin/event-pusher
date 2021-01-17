'use strict'

const { PubSub } = require(`@google-cloud/pubsub`);


class DataFlowManager {
    constructor() {
        this.pubSubClient = new PubSub()
    }

    publishMessage = async (message, pubSubTopicName) => {
        const dataBuffer = Buffer.from(message)

        try {
            const messageId = await this.pubSubClient.topic(pubSubTopicName).publish(dataBuffer)
            console.log(`Message ${messageId} published.`)
            return true
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}`)
            return false
        }
    }
}

module.exports = new DataFlowManager()
