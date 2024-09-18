import mongoose from 'mongoose';
import config from '../../config';
import Logging from '../../library/logging';

const maxRetries = 5;
const retryDelay = 5000;

const connectDB = async (retries = 0) => {
    try {
        await mongoose.connect(config.mongoUrl, { retryWrites: true, w: 'majority', appName: 'MQTT-MONGO' });
        Logging.info('Connected to mongoDB');
    } catch (err) {
        Logging.error(`Unable to connect to mongoDB: ${err}`);

        if (retries < maxRetries) {
            Logging.warning(`Retrying MongoDB connection... Attempt ${retries + 1} of ${maxRetries}`);
            setTimeout(() => connectDB(retries + 1), retryDelay);
        } else {
            Logging.error('Max retries reached. Unable to connect to MongoDB.');
        }
    }
};

export default connectDB;
