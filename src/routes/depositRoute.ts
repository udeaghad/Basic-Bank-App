import express from 'express';
import { createDeposit } from '../controllers/transactionController';


const router = express.Router();

router.post("/deposit/create", createDeposit)

export default router;