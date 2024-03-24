import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  upadteCategory,
} from "../controllers/category";
import {
  categoryBodyValidation,
  categoryIdValidation,
} from "../validation/category";
import { validateBody, validateParams } from "../middleware/validationError";
import { UserType } from "../constant/constant";
import { checkUserAccess } from "../middleware/authorization";
const router = express.Router();

router.get(
  "/",
  checkUserAccess([UserType.ADMIN, UserType.USER]),
  getAllCategory
);
router.get(
  "/:id",
  checkUserAccess([UserType.ADMIN]),
  validateParams(categoryIdValidation),
  getCategoryById
);
router.post(
  "/add",
  checkUserAccess([UserType.ADMIN]),
  validateBody(categoryBodyValidation),
  addCategory
);
router.put(
  "/update/:id",
  checkUserAccess([UserType.ADMIN]),
  validateParams(categoryIdValidation),
  upadteCategory
);
router.delete(
  "/delete/:id",
  checkUserAccess([UserType.ADMIN]),
  validateParams(categoryIdValidation),
  deleteCategory
);

export default router;
