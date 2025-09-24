import { Request, NextFunction, Router, Response } from "express";
import { createPayment } from "../controllers/paymentsController.js";
import "dotenv/config";

const router = Router();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = process.env.API_KEY;

  if (apiKey && req.header("X-API-KEY") !== apiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

router.post("/", authMiddleware, createPayment);

export default router;
