import Auth from './auth';
import Device from './device';
import Image from './image';
import Sensor from './sensor';
import User from './user';

const mongoModles = {
    auth: Auth,
    device: Device,
    image: Image,
    sensor: Sensor,
    user: User,
};

export default mongoModles;
