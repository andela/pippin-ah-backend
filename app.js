import 'babel-polyfill';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import initPassport from './config';
import {
  authRoutes, userRoutes, profileRoutes, activateRoute
} from './routes';
import { errorHandler, notFoundRoute } from './middlewares';


sgMail.setApiKey(process.env.EMAIL_API_KEY);

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
app.use('/api/v1/activate', activateRoute);
app.use('/api/v1', userRoutes);
app.use('/api/v1', profileRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
