import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initPassport from './config';
import { authRoutes, userRoutes } from './routes';
import { errorHandler, notFoundRoute } from './middlewares';

dotenv.config();
initPassport();
// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1/users', authRoutes);
app.use('/api/v1', userRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
