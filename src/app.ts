import express, {Request, Response, ErrorRequestHandler, Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import authsRoutes from './routes/authsRoutes';
import transactioRoutes from './routes/transactionRoutes';

dotenv.config()

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(cookiesParser());

app.use('/api/v1/auths', authsRoutes);
app.use('/api/v1/accounts', transactioRoutes);



/**Error handler */

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.status || 400)
  res.json({
    success: false,
    status: error.status || 400,
    message: error.message || 'Sorry! something went wrong'
  })
  next();
}

app.use(errorHandler)

export default app;



