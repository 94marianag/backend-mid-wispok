import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreatePaymentDto } from "../dtos/createPayment.dto.js";
import Payment from "../mongo/models/Payment.js";
import { hashBody } from "../utils/hash.js";

export async function createPayment(req: Request, res: Response) {
  try {
    const { amount, reference, method } = req.body;
    const idemKey = req.header("Idempotency-Key");
    const requestHash = hashBody({ amount, reference, method });

    const dto = plainToInstance(CreatePaymentDto, req.body);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.map((e) => e.constraints) });
    }

    if (idemKey) {
      const existing = await Payment.findOne({ idempotencyKey: idemKey });

      if (existing) {
        if (existing.requestHash === requestHash) {
          return res.status(200).json(existing);
        }
        return res.status(409).json({
          message: "Idempotency-Key conflict: payload mismatch",
        });
      }

      const payment = await Payment.create({
        amount,
        reference,
        method,
        status: "confirmed",
        idempotencyKey: idemKey,
        requestHash,
      });
      return res.status(201).json(payment);
    }

    const payment = await Payment.findOne({ reference, method, amount });
    if (payment) {
      return res.status(200).json(payment);
    }

    const created = await Payment.create({
      amount,
      reference,
      method,
      status: "confirmed",
      requestHash,
    });

    return res.status(201).json(created);
  } catch (error) {
    if (error instanceof Error && (error as any).code === 11000) {
      return res.status(200).json(await Payment.findOne(req.body));
    }
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
