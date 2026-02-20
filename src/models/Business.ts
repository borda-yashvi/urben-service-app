import { Schema, model, Document, Types } from 'mongoose';

export interface IBusiness extends Document {
    owner: Types.ObjectId;
    name: string;
    details?: string;
    status: 'active' | 'inactive';
}

const BusinessSchema = new Schema<IBusiness>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default model<IBusiness>('Business', BusinessSchema);
