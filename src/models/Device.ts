import { Schema, model, Document, Types } from 'mongoose';

export interface IDevice extends Document {
    user: Types.ObjectId;
    company_brand: string;
    company_device: string;
    company_model: string;
    device_id: string;
    app_version: string;
    lastActive: Date;
}

const DeviceSchema = new Schema<IDevice>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company_brand: { type: String, required: true },
    company_device: { type: String, required: true },
    company_model: { type: String, required: true },
    device_id: { type: String, required: true },
    app_version: { type: String, required: true },
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

DeviceSchema.index({ user: 1, device_id: 1 }, { unique: true });

export default model<IDevice>('Device', DeviceSchema);
