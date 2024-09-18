import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISensor {
    ts: Date;
    temperature: number;
    co2: number;
    c2h4: number;
    humidity: number;
    device: Types.ObjectId;
}

export interface ISensorDocument extends ISensor, Document {}

const SensorSchema: Schema = new Schema<ISensorDocument>(
    {
        ts: { type: Date, required: true },
        temperature: { type: Number, required: true },
        co2: { type: Number, required: true },
        c2h4: { type: Number, required: true },
        humidity: { type: Number, required: true },
        device: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
    },
    {
        versionKey: false,
    },
);

export default mongoose.model<ISensorDocument>('Sensors', SensorSchema);
