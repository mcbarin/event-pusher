import { PubSub } from '@google-cloud/pubsub'


class DataFlowManager {
    private static instance: DataFlowManager;
    private pubSubClient: PubSub;

    constructor() {
        this.pubSubClient = new PubSub()
    }

    static getInstance(): DataFlowManager {
        if (!DataFlowManager.instance) {
            DataFlowManager.instance = new DataFlowManager();
        }

        return DataFlowManager.instance;
    }

    public async publishMessage (message: string, pubSubTopicName: string) {
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

export = DataFlowManager
