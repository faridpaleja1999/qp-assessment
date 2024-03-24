import express from "express";
import userRoute from "./user";
import productRoute from "./product";
import categoryRoute from "./category";
import orderRoute from "./order";
import { checkAuth } from "../middleware/authorization";

const router = express.Router();

router.use("/user", userRoute);
router.use("/product", checkAuth, productRoute);
router.use("/category", checkAuth, categoryRoute);
router.use("/order", checkAuth, orderRoute);

export default router;
