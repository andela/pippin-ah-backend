import express from 'express';

const router = express.Router();

router.get((req, res) => res.status(400)
  .send({ message: 'Welcome To the Den of Authors' }));

export default router;
