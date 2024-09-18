import { JwtPayload as JwtPayloadType } from 'jsonwebtoken';

export type JwtPayload = JwtPayloadType;

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}
