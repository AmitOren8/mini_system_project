import express from 'express';
import loginHandler from '../handlers/loginHandler';

const loginRouter = express.Router();

loginRouter.route('/').post(loginHandler);

export default loginRouter;
