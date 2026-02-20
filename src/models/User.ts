import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    userType: 'business' | 'customer' | 'admin';
    profilePic?: string;
    resetToken?: string | null;
    resetExpires?: Date | null;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['business', 'customer', 'admin'], required: true },
    profilePic: { type: String },
    resetToken: { type: String },
    resetExpires: { type: Date }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export default model<IUser>('User', UserSchema);
