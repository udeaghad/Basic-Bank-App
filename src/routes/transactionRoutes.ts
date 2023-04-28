import express from 'express';
import { sendMoney, receiveDeposit, searchTrxnsHistory } from '../controllers/transactionController';



const router = express.Router();
router.post("/deposit/receiveMoney", receiveDeposit)
router.post("/withdraw/sendMoney", sendMoney)
router.post("/history", searchTrxnsHistory)

export default router;