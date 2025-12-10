import express from "express"
import { createTransaction, deleteTransaction, getSummaryByUserId, getTransactionsByUserId } from "../controllers/transactionsRoute.js"

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction)
router.delete("/:id", deleteTransaction)
router.get("/summary/:userId", getSummaryByUserId)

export default router