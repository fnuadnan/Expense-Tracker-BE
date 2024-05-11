import express from "express";
import authController from "../controllers/authCrontoller";
const router = express.Router();

router.post("/", authController);

export default router;
