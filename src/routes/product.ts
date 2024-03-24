import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  upadteProduct,
  upadteProductQty,
} from "../controllers/product";
import {
  productBodyValidation,
  productIdValidation,
  productQtyValidation,
  productQueryValidation,
} from "../validation/product";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validationError";
import { checkUserAccess } from "../middleware/authorization";
import { UserType } from "../constant/constant";
const router = express.Router();

router.get(
  "/",
  checkUserAccess([UserType.USER, UserType.USER]),
  validateQuery(productQueryValidation),
  getAllProduct
);
router.get(
  "/:id",
  checkUserAccess([UserType.USER, UserType.USER]),
  validateParams(productIdValidation),
  getProductById
);
router.post(
  "/add",
  checkUserAccess([UserType.ADMIN]),
  validateBody(productBodyValidation),
  addProduct
);
router.patch(
  "/update/qty/:id",
  checkUserAccess([UserType.ADMIN]),
  validateParams(productIdValidation),
  validateBody(productQtyValidation),
  upadteProductQty
);
router.put(
  "/update/:id",
  checkUserAccess([UserType.ADMIN]),
  validateParams(productIdValidation),
  upadteProduct
);
router.delete(
  "/delete/:id",
  checkUserAccess([UserType.ADMIN]),
  validateParams(productIdValidation),
  deleteProduct
);

export default router;
