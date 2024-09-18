// src/services/webSocketService/service.ts
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import IMqttDataPayload from './types';
import Logging from '../../library/logging';

class WebSocketService {
    #io: SocketIOServer | null = null;

    public init(server: HttpServer): void {
        if (!this.#io) {
            this.#io = new SocketIOServer(server, {
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST'],
                },
            });

            this.configureListeners();
            Logging.info('WebSocket server initialized');
        }
    }

    private configureListeners(): void {
        this.#io?.on('connection', (socket: Socket) => {
            Logging.info(`New client connected: ${socket.id}`);

            socket.on('disconnect', () => {
                Logging.info(`Client disconnected: ${socket.id}`);
            });

            // Add custom event listeners as needed
        });
    }

    public emitMqttData(event: string, data: IMqttDataPayload): void {
        this.#io?.emit(event, data);
    }
}

export default WebSocketService;
