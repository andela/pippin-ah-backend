import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes, userRoutes } from './routes';
import { errorHandler, notFoundRoute, verifyToken } from './middlewares';

dotenv.config();

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/user', verifyToken, userRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
