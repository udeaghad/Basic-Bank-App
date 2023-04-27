import express from 'express';
import { createWithdraw } from '../controllers/transactionController';


const router = express.Router();

router.post("/withdraw/create", createWithdraw)

export default router;