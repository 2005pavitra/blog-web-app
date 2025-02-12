import express from "express";
import {login, register, logout} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";
import { User } from "../models/user.models.js";

const router = express.Router();

router.post("/register", register); 
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);


export default router;