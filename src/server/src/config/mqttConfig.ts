import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config();

const validateEnv = (env: NodeJS.ProcessEnv) => {
    const envValidated = cleanEnv(env, {
        MQTT_PORT: port(),
        MQTT_SERVER: str(),
        MQTT_SERVER_PWD: str(),
    });

    return {
        mqttPort: envValidated.MQTT_PORT,
        mqttUsername: envValidated.MQTT_SERVER,
        mqttPwd: envValidated.MQTT_SERVER_PWD,
    };
};

const envVars = validateEnv(process.env);

const MQTT_CONFIG = {
    PORT: envVars.mqttPort,
    USERNAME: envVars.mqttUsername,
    PWD: envVars.mqttPwd,
};

export default MQTT_CONFIG;
