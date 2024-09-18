import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotenv.config();

const validateEnv = (env: NodeJS.ProcessEnv) => {
    const envValidated = cleanEnv(env, {
        MONGO_USERNAME: str(),
        MONGO_PASSWORD: str(),
        MONGO_DATABASE_NAME: str(),
    });

    return {
        mongoUsername: envValidated.MONGO_USERNAME,
        mongoPassword: envValidated.MONGO_PASSWORD,
        mongoDatabaseName: envValidated.MONGO_DATABASE_NAME,
    };
};

const envVars = validateEnv(process.env);

const MONGO_URL = `mongodb+srv://${envVars.mongoUsername}:${envVars.mongoPassword}@data.qupvs9l.mongodb.net/${envVars.mongoDatabaseName}`;

export default MONGO_URL;
