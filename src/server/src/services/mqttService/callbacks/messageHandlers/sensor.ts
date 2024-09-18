import mongoose from 'mongoose';
import webSocketService from '../../../webSocketService';
import mongoModles from '../../../../mongo/models';
import Logging from '../../../../library/logging';

const Device = mongoModles.device;
const Sensor = mongoModles.sensor;

interface ISensorPayload {
    ts: Date;
    temperature: number;
    co2: number;
    c2h4: number;
    humidity: number;
    nodeID: string;
}

const sensorMsgHandler = async (payload: ISensorPayload) => {
    const { ts, temperature, co2, c2h4, humidity, nodeID } = payload;

    try {
        const deviceDoc = await Device.findOne({ nodeID });

        if (!deviceDoc) {
            Logging.error(`Device with nodeID ${nodeID} not found`);
            throw new Error();
        }

        const sensorPayload = new Sensor({
            _id: new mongoose.Types.ObjectId(),
            ts,
            temperature,
            co2,
            c2h4,
            humidity,
            device: deviceDoc._id,
        });

        await sensorPayload.save();

        webSocketService.emitMqttData('sensorData', {
            ts: ts,
            temperature: temperature,
            co2: co2,
            c2h4: c2h4,
            humidity: humidity,
            node: nodeID,
        });
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Error saving MQTT sensor data to DB. Error: ${err.message}`);
        } else {
            Logging.error('An unknown error during saving MQTT sensor data to DB.');
        }
    }
};

export default sensorMsgHandler;
