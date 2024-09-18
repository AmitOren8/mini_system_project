import { Router } from 'express';
import { validateToken, refreshToken } from '../handlers/authHandler';

const authRouter = Router();

authRouter.get('/validate', validateToken);
authRouter.post('/refresh', refreshToken);

export default authRouter;
