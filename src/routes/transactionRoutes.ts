import express from 'express';
import { sendMoney, receiveDeposit, searchTrxnsHistory } from '../controllers/transactionController';
import { verifyToken } from '../utils/verifyToken';



const router = express.Router();
router.post("/deposit/receiveMoney", receiveDeposit)
router.post("/withdraw/sendMoney", verifyToken, sendMoney)
router.post("/history", verifyToken, searchTrxnsHistory)

export default router;