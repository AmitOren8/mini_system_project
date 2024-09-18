import App from './app';
import config from './config';
import Logging from './library/logging';
import services from './services';

const init = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await services.connectDB();

        // Connect to mqtt Broker
        const mqttService = services.mqttService;
        mqttService.connectMqtt();
        mqttService.subscribeToTopics(['node/+/sensor', 'node/+/image', 'node/+/cmd']);

        // Start app
        const PORT = config.serverPort || 5500;
        const app = new App(PORT);

        // Start websocket server
        const webSocketService = services.WebSocketService;
        webSocketService.init(app.server);

        // Start server
        app.listen();
    } catch (error) {
        Logging.error('Failed to start the server:');
        Logging.error(error);
        process.exit(1); // Exit process with failure
    }
};

init();
