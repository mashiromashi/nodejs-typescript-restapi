import { Router } from "express";
import auth from "../middleware/auth";
import controller from "../controller/user.controller";

let router = Router();

//register
router.post("/register", controller.register);

//login
router.post("/login", controller.login);

//get all uses
router.get("/users", auth, controller.getAllUsers);

//get login user
router.get("/users/me", auth, controller.getLoginUser);

//update user
router.put("/users/me", auth, controller.updateUser);

export default router;
