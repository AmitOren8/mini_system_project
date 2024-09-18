import express, { Application, Request, Response, NextFunction } from 'express';
import { Server as HttpServer, createServer } from 'http';
import cookieParser from 'cookie-parser';
import routers from './http/routes';
import Logging from './library/logging';

class App {
    #port: number;
    #app: Application;
    server: HttpServer;

    public constructor(port: number) {
        this.#port = port;
        this.#app = express();
        this.server = createServer(this.#app);

        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    private configureMiddleware() {
        this.#app.use(cookieParser());

        // Logging
        this.#app.use((req: Request, res: Response, next: NextFunction) => {
            /** Log the request */
            Logging.info(`Request -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

            res.on('finish', () => {
                /** Log the response */
                Logging.info(
                    `Response -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`,
                );
            });

            next();
        });

        // Utility
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.json());

        // Cors
        this.#app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

            if (req.method == 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                return res.status(200).json({});
            }

            next();
        });
    }

    private configureRoutes() {
        this.#app.use('/login', routers.login);
        this.#app.use('/auth', routers.auth);
        this.#app.use('/device', routers.device);
    }

    private configureErrorHandling() {
        /** Error handling */
        this.#app.use((req: Request, res: Response) => {
            const error = new Error('Url Not Found');
            Logging.error(error);

            return res.status(404).json({ message: error.message });
        });

        /** Generic error handler */
        this.#app.use((err: Error, req: Request, res: Response) => {
            Logging.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
    }

    public listen() {
        this.server.listen(this.#port, () => {
            Logging.info(`Server is running on port ${this.#port}`);
        });
    }
}

export default App;
