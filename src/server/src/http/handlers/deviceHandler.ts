import { Request, Response, RequestHandler } from 'express';
import services from '../../services';
import mongoModles from '../../mongo/models';
import Logging from '../../library/logging';

const Device = mongoModles.device;

const mqttService = services.mqttService;

const getDevice: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { nodeID } = req.params;

        const deviceDoc = await Device.findOne({ nodeID });

        if (!deviceDoc) {
            Logging.error(`Device with nodeID ${nodeID} not found`);
            return res.status(404).json({ message: 'Device not found' });
        }

        res.status(200).json(deviceDoc);
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Failed to retrieve device doc. Error: ${err.message}`);
        } else {
            Logging.error('An unknown error occurred while retrieving the device.');
        }
        res.status(500).json({ message: 'Unable to fetch device at the moment.' });
    }
};

const listDevices: RequestHandler = async (req: Request, res: Response) => {
    try {
        const allDevices = await Device.find({});

        res.status(200).json(allDevices);
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Failed to retrieve device list. Error: ${err.message}`);
        } else {
            Logging.error('An unknown error occurred while retrieving the device list.');
        }
        res.status(500).json({ message: 'Unable to fetch device list at the moment.' });
    }
};

const startDevice: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { nodeID } = req.params;

        if (!mqttService) {
            Logging.error('MQTT service is not initialized');
            return res.status(500).json({ message: 'MQTT service is not available' });
        }

        const deviceDoc = await Device.findOne({ nodeID });

        if (!deviceDoc) {
            Logging.error(`Device with nodeID ${nodeID} not found`);
            return res.status(404).json({ message: 'Device not found' });
        }

        const isActive = deviceDoc.active;

        if (isActive) {
            return res.status(409).json({ message: 'Device is already active' });
        }

        mqttService.publishToTopic(`node/${nodeID}/cmd`, 'start');
        deviceDoc.active = true;
        await deviceDoc.save();

        return res.status(200).json({ message: 'Device started successfully' });
    } catch (err) {
        Logging.error(`Error in startRoom: ${err}`);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

const stopDevice: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { nodeID } = req.params;

        if (!mqttService) {
            Logging.error('MQTT service is not initialized');
            return res.status(500).json({ message: 'MQTT service is not available' });
        }

        const deviceDoc = await Device.findOne({ nodeID });

        if (!deviceDoc) {
            Logging.error(`Device with nodeID ${nodeID} not found`);
            return res.status(404).json({ message: 'Device not found' });
        }

        const isActive = deviceDoc.active;

        if (!isActive) {
            return res.status(409).json({ message: 'Device is already not active' });
        }

        mqttService.publishToTopic(`node/${nodeID}/cmd`, 'stop');
        deviceDoc.active = false;
        await deviceDoc.save();

        return res.status(200).json({ message: 'Device stopped successfully' });
    } catch (err) {
        Logging.error(`Error in stoptRoom: ${err}`);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

export default {
    getDevice,
    listDevices,
    startDevice,
    stopDevice,
};
