import express from "express";
import {
  addOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
} from "../controllers/order";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validationError";
import {
  orderBodyValidation,
  orderIdValidation,
  orderQueryValidation,
} from "../validation/order";
import { checkUserAccess } from "../middleware/authorization";
import { UserType } from "../constant/constant";
const router = express.Router();

router.get(
  "/",
  validateQuery(orderQueryValidation),
  checkUserAccess([UserType.ADMIN]),
  getAllOrders
);
router.get(
  "/myOrders",
  validateQuery(orderQueryValidation),
  checkUserAccess([UserType.USER]),
  getMyOrders
);
router.get(
  "/:orderId",
  checkUserAccess([UserType.USER, UserType.ADMIN]),
  validateParams(orderIdValidation),
  getOrderById
);
router.post(
  "/",
  checkUserAccess([UserType.USER]),
  validateBody(orderBodyValidation),
  addOrder
);

export default router;
