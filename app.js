
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerDocument from './learnground-api-documentation';
import initPassport from './config';
import { errorHandler, notFoundRoute } from './middlewares';
import {
  authRoutes,
  userRoutes,
  articleRoutes,
  profileRoutes,
  notificationRoutes
} from './routes';

dotenv.config();

const app = express();

initPassport();

app.enable('trust proxy');
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
