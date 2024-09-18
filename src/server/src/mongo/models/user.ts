import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    password: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

const UserSchema: Schema = new Schema<IUserDocument>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        versionKey: false,
    },
);

// Hash the password before saving the user
UserSchema.pre<IUserDocument>('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserDocument>('Users', UserSchema);
