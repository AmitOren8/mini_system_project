import connectDB from './mongoService/service';
import mqttService from './mqttService';
import WebSocketService from './webSocketService';

const services = {
    connectDB,
    mqttService,
    WebSocketService,
};

export default services;
