import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IImage {
    ts: Date;
    image: string;
    device: Types.ObjectId;
}

export interface IImageDocument extends IImage, Document {}

const ImageSchema: Schema = new Schema<IImageDocument>(
    {
        ts: { type: Date, required: true },
        image: { type: String, required: true },
        device: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
    },
    {
        versionKey: false,
    },
);

export default mongoose.model<IImageDocument>('Image', ImageSchema);
