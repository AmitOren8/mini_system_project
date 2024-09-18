import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import mongoModles from '../../mongo/models';
import Logging from '../../library/logging';

const Auth = mongoModles.auth;

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        Logging.warning('Refresh token not provided');
        return res.sendStatus(401); // Unauthorized
    }

    try {
        const decoded = jwt.verify(refreshToken, config.jwt.REFRESH_TOKEN) as { id: string; username: string };

        const userTokenRecord = await Auth.findOne({ token: refreshToken, userId: decoded.id });
        if (!userTokenRecord) {
            Logging.warning('Refresh token not found in database');
            return res.sendStatus(403); // Forbidden
        }

        // Create new access token
        const accessToken = jwt.sign({ id: decoded.id, username: decoded.username }, config.jwt.ACCESS_TOKEN, {
            expiresIn: '30s',
        });
        Logging.info(`Access token issued for user ID ${decoded.id}`);
        res.json({ accessToken });
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Error refreshing token: ${err.message}`);
        } else {
            Logging.error(`Unexpected error during token refresh`);
        }
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

export const validateToken = (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        Logging.warning('Authorization header missing');
        return res.sendStatus(401); // Unauthorized
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, config.jwt.ACCESS_TOKEN);
        res.sendStatus(200); // OK
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Token validation failed: ${err.message}`);
            res.status(403).json({ message: 'Invalid token' });
        } else {
            Logging.error(`Unexpected error during token validation`);
            res.status(403).json({ message: 'Invalid token' });
        }
    }
};
