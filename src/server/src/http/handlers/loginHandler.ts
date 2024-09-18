import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import mongoModles from '../../mongo/models';
import Logging from '../../library/logging';

const User = mongoModles.user;
const Auth = mongoModles.auth;

const loginHandler: RequestHandler = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            Logging.warning(`Login attempt with invalid username: ${username}`);
            return res.status(401).json({ message: 'Invalid username or password' }); // Unauthorized
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            Logging.warning(`Login attempt with invalid password for username: ${username}`);
            return res.status(401).json({ message: 'Invalid username or password' }); // Unauthorized
        }

        // JWT
        await Auth.deleteMany({ userId: user._id });

        const accessToken = jwt.sign({ username: user.username, id: user._id }, config.jwt.ACCESS_TOKEN, {
            expiresIn: '5m',
        });
        const refreshToken = jwt.sign({ username: user.username, id: user._id }, config.jwt.REFRESH_TOKEN, {
            expiresIn: '1d',
        });

        // Save refresh token to database
        const authDoc = new Auth({
            token: refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expiration date 1 day
        });
        await authDoc.save();

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.json({ accessToken });
    } catch (err) {
        if (err instanceof Error) {
            Logging.error(`Error during login: ${err.message}`);
        } else {
            Logging.error(`Unexpected error during login`);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default loginHandler;
