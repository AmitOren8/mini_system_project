import express from 'express';
import deviceController from '../handlers/deviceHandler';

const deviceRouter = express.Router();

deviceRouter.route('/:nodeID/info').get(deviceController.getDevice);
deviceRouter.route('/list').get(deviceController.listDevices);
deviceRouter.route('/:nodeID/start').post(deviceController.startDevice);
deviceRouter.route('/:nodeID/stop').post(deviceController.stopDevice);

export default deviceRouter;
