import express, { Request, Response } from "express";
import paymentsRouter from "./routes/payments.js";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "payments-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/payments", paymentsRouter);

export default app;
