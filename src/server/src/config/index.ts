import MONGO_URL from './mongoConfig';
import MQTT_CONFIG from './mqttConfig';
import SERVER_PORT from './serverConfig';
import JWT from './authConfig';

const config = {
    mongoUrl: MONGO_URL,
    MQTT_CONFIG: MQTT_CONFIG,
    serverPort: SERVER_PORT,
    jwt: JWT,
};

export default config;
