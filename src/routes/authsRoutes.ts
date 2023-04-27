import express from 'express';
import { createAccount } from '../controllers/authsController';

const router = express.Router();

router.post("/account/create", createAccount);

export default router;