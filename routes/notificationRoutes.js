import express from 'express';
import { Notification } from '../controllers';
import { verifyToken } from '../middlewares';

const { getAllNotifications, markAsRead } = Notification;

const router = express.Router();

router.route('/')
  .all(verifyToken)
  .get(getAllNotifications)
  .patch(markAsRead);

export default router;
