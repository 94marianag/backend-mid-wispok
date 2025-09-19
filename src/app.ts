import express, { Request, Response } from "express";

const app = express();

app.use(express.json());


app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "payments-api", timestamp: new Date().toISOString() });
});

export default app;
