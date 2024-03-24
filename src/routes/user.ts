import express from "express";
import { loginValidation, registerValidation } from "../validation/user";
import { register, login } from "../controllers/user";
import { validateBody } from "../middleware/validationError";

const router = express.Router();

router.post("/register", validateBody(registerValidation), register);
router.post("/login", validateBody(loginValidation), login);

export default router;
