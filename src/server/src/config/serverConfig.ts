import dotenv from 'dotenv';
import { cleanEnv, port } from 'envalid';

dotenv.config();

const validateEnv = (env: NodeJS.ProcessEnv) => {
    const envValidated = cleanEnv(env, {
        SERVER_PORT: port(),
    });

    return {
        serverPort: envValidated.SERVER_PORT,
    };
};

const envVars = validateEnv(process.env);

const SERVER_PORT = envVars.serverPort;

export default SERVER_PORT;
