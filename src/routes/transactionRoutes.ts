import express from 'express';
import { sendMoney, receiveDeposit, searchTrxnsHistory, getTransaction } from '../controllers/transactionController';
import { verifyToken } from '../utils/verifyToken';



const router = express.Router();
router.post('/deposit/receiveMoney', receiveDeposit)
router.post('/withdraw/sendMoney', verifyToken, sendMoney)
router.post('/history', verifyToken, searchTrxnsHistory)
router.get('/:id/transaction/:trxns_id', verifyToken, getTransaction)

export default router;