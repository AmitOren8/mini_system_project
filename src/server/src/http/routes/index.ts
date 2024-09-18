import loginRouter from './loginRouter';
import authRouter from './authRouter';
import deciveRouter from './deviceRouter';

const routers = {
    login: loginRouter,
    auth: authRouter,
    device: deciveRouter,
};

export default routers;
