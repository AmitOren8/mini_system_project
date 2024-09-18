import mqtt from 'mqtt';
import Logging from '../../library/logging';
import mqttCallbacks from './callbacks/callbacks';

class MQTTService {
    #options: mqtt.IClientOptions;
    #client: mqtt.MqttClient | null = null;
    #callBacks: (client: mqtt.MqttClient) => void;

    public constructor(options: mqtt.IClientOptions) {
        this.#options = options;
        this.#callBacks = mqttCallbacks;
    }

    public connectMqtt(): void {
        const options = this.#options;

        try {
            const client = mqtt.connect(options);
            this.#client = client;

            this.#callBacks(client);
        } catch (err) {
            Logging.error(`Unable to connect to MQTT broker ${err}`);
        }
    }

    public subscribeToTopics(topics: string[]): void {
        if (this.#client) {
            topics.forEach((topic) => {
                this.#client!.subscribe(topic, (err) => {
                    if (err) {
                        Logging.error(`Error subscribing to topic: ${topic}`);
                    }
                });
            });
        } else {
            Logging.error('MQTT client is not connected');
        }
    }

    public publishToTopic(topic: string, message: string, options?: mqtt.IClientPublishOptions): void {
        if (this.#client) {
            this.#client.publish(topic, message, options || {}, (err) => {
                if (err) {
                    Logging.error(`Failed to publish message to topic ${topic}: ${err}`);
                } else {
                    Logging.info(`MQTT message published to topic ${topic}: ${message}`);
                }
            });
        } else {
            Logging.error('MQTT client is not connected');
        }
    }

    public disconnectMqtt(): void {
        if (this.#client) {
            this.#client.end((err) => {
                if (err) {
                    Logging.error(`Error while disconnecting MQTT client: ${err}`);
                } else {
                    Logging.info('Successfully disconnected from MQTT broker');
                }
            });
            this.#client = null;
        } else {
            Logging.error('MQTT client is not connected');
        }
    }
}

export default MQTTService;
