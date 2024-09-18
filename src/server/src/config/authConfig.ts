import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotenv.config();

const validateEnv = (env: NodeJS.ProcessEnv) => {
    const envValidated = cleanEnv(env, {
        ACCESS_TOKEN_SECRET: str(),
        REFRESH_TOKEN_SECRET: str(),
    });

    return {
        accessToken: envValidated.ACCESS_TOKEN_SECRET,
        refreshToken: envValidated.REFRESH_TOKEN_SECRET,
    };
};

const envVars = validateEnv(process.env);

const ACCESS_TOKEN = envVars.accessToken;
const REFRESH_TOKEN = envVars.refreshToken;

export default {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
};
