import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
    user: Types.ObjectId;
    amount: number;
    expiresAt: Date;
    createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default model<IPayment>('Payment', PaymentSchema);
