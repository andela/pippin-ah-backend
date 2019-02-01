import express from 'express';
import { Notification } from '../controllers';
import { verifyToken } from '../middlewares';

const { getAllNotifications, markAsRead } = Notification;

const router = express.Router();

router.route('/').get(verifyToken, getAllNotifications);

router.route('/:notificationId/mark-as-read').patch(verifyToken, markAsRead);

export default router;
