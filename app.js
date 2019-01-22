import 'babel-polyfill';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import initPassport from './config';
import {
  authRoutes,
  userRoutes,
  profileRoutes
} from './routes';
import { errorHandler, notFoundRoute } from './middlewares';

dotenv.config();

// Create global app object
const app = express();

initPassport();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
