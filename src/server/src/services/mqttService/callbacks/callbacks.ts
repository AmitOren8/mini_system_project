import Logging from '../../../library/logging';
import mqtt from 'mqtt';
import mqttHandlers from './messageHandlers';

const mqttCallbacks = (client: mqtt.MqttClient) => {
    client.on('connect', () => {
        Logging.info('Server connected to MQTT broker');
    });

    client.on('message', (topic, rawpayload) => {
        const stringPayload = rawpayload.toString();

        // Extract the last part of the topic (e.g., 'sensor' or 'image')
        const topicSuffix = topic.split('/').pop();

        mqttHandlers.forEach((handelr) => {
            if (handelr.topic === topicSuffix) {
                try {
                    const payload = JSON.parse(stringPayload);
                    handelr.handler(payload);
                } catch (err) {
                    if (err instanceof Error) {
                        Logging.error(`Failed to parse MQTT topic: ${topic} message to JSON. Error: ${err.message}`);
                    } else {
                        Logging.error('An unknown error occurred while parsing MQTT message to JOSN.');
                    }
                }
            }
        });
    });

    client.on('offline', () => {
        Logging.warning('Server connection to MQTT borker stopped');
    });
};

export default mqttCallbacks;
