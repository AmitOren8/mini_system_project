import mongoose, { Document, Schema } from 'mongoose';

// Device Interface and Schema
export interface IDevice {
    nodeID: string;
    location: string;
    active: boolean;
}

export interface IDeviceDocument extends IDevice, Document {}

const DeviceSchema: Schema = new Schema<IDeviceDocument>(
    {
        nodeID: { type: String, required: true },
        location: { type: String },
        active: { type: Boolean },
    },
    {
        versionKey: false,
    },
);

export default mongoose.model<IDeviceDocument>('Device', DeviceSchema);
