import imageMsgHandler from './image';
import sensorMsgHandler from './sensor';

const mqttHandlers = [
    {
        topic: 'image',
        handler: imageMsgHandler,
    },
    {
        topic: 'sensor',
        handler: sensorMsgHandler,
    },
];

export default mqttHandlers;
