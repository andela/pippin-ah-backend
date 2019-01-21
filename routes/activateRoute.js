import express from 'express';
import activateAccount from '../controllers/activateAccount';

const { activateUser } = activateAccount;

const router = express.Router();

router.route('/:userId')
  .get(activateUser);

export default router;
