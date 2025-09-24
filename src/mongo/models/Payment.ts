import mongoose, { Schema, Document } from "mongoose";

export enum PaymentMethod {
  CARD = "card",
  TRANSFER = "transfer",
  CASH = "cash",
}

export interface PaymentDoc extends Document {
  amount: number;
  reference: string;
  method: PaymentMethod;
  status: "confirmed";
  idempotencyKey?: string;
  requestHash: string;
  createdAt: Date;
}

const paymentSchema = new Schema<PaymentDoc>(
  {
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    method: { type: String, enum: PaymentMethod, required: true },
    status: { type: String, default: "confirmed" },
    idempotencyKey: { type: String, unique: true, sparse: true },
    requestHash: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
  },
  { timestamps: false, versionKey: false },
);

paymentSchema.index({ reference: 1, method: 1, amount: 1 }, { unique: true });

export default mongoose.model<PaymentDoc>("Payment", paymentSchema);
