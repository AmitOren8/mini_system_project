import mqtt from 'mqtt';
import config from '../../config';

// Setup connection options
const MQTT_OPTIONS: mqtt.IClientOptions = {
    host: 'localhost',
    port: config.MQTT_CONFIG.PORT,
    protocol: 'mqtt',
    username: config.MQTT_CONFIG.USERNAME,
    password: config.MQTT_CONFIG.PWD,
};

export default MQTT_OPTIONS;
