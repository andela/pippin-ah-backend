const router = require("express").Router();
import  controller  from '../../controller';



const {getUser,updateUser,login, register} = controller;


router.get("/user",getUser);

router.put("/user",updateUser);

router.post("/users/login",login);

router.post("/users",register);

module.exports = router;
