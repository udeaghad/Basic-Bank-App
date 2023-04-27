import express from 'express';
import { createAccount, login } from '../controllers/authsController';

const router = express.Router();

router.post("/account/create", createAccount);
router.post("/account/login", login)

export default router;