import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAuth {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
}

export interface IAuthDocument extends IAuth, Document {}

const AuthSchema: Schema = new Schema<IAuthDocument>(
    {
        token: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
        expiresAt: { type: Date, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model<IAuthDocument>('RefreshTokens', AuthSchema);
