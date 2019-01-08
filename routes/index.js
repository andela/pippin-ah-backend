import express from 'express';
const router = express.Router();
import  Users  from '../controller/user';

router.get("/user/:userId",Users.getUser);

router.put("/user/:userId",Users.updateUser);

router.post("/users/login",Users.login);

router.post("/users",Users.register);


export default router;
