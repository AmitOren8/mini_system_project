// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import config from '../../config';
// import Logging from '../../library/logging';

// const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, config.jwt.ACCESS_TOKEN, (err, user) => {
//             if (err) {
//                 Logging.warning(`JWT verification failed: ${err.message}`);
//                 return res.sendStatus(403); // Forbidden
//             }

//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             (req as any).user = user;
//             next();
//         });
//     } else {
//         Logging.warning('Authorization header missing');
//         res.sendStatus(401); // Unauthorized
//     }
// };

// export default authenticateJWT;
