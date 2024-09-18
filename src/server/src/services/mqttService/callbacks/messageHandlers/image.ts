import mongoose from 'mongoose';
import webSocketService from '../../../webSocketService';
import mongoModles from '../../../../mongo/models';
import Logging from '../../../../library/logging';

const Device = mongoModles.device;
const Image = mongoModles.image;

interface IImagePayload {
    nodeID: string;
    ts: Date;
    image: string;
}

const imageMsgHandler = async (payload: IImagePayload) => {
    const { ts, image, nodeID } = payload;

    try {
        const deviceDoc = await Device.findOne({ nodeID });

        if (!deviceDoc) {
            Logging.error(`Device with nodeID ${nodeID} not found`);
            throw new Error();
        }

        const imagePayload = new Image({
            _id: new mongoose.Types.ObjectId(),
            ts,
            image,
            device: deviceDoc._id,
        });

        await imagePayload.save();

        webSocketService.emitMqttData('imageData', { ts: ts, image: image, node: nodeID });
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Error saving MQTT image data to DB. Error: ${err.message}`);
        } else {
            Logging.error('An unknown error during saving MQTT image data to DB.');
        }
    }
};

export default imageMsgHandler;
