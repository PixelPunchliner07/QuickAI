import express from "express";
import { auth } from "../middlewares/auth.js";
import { getPublishedCreations, getUserCreations, toggleLikes } from "../controlers/userController.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations);
userRouter.get('/get-published-creations',auth,getPublishedCreations);
userRouter.post('/get-toogle-likes',auth,toggleLikes);

export default userRouter;