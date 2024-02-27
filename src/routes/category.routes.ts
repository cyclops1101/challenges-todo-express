import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  getCategory,
} from "../controllers/category.controller";
import { authenticationMiddleware } from "../middleware";

const router = Router();
router.use(authenticationMiddleware);

router.route("/").get(listCategories);
router.route("/").post(createCategory);
router.route("/:id").get(getCategory);
router.route("/:id").put(updateCategory);
router.route("/:id").delete(deleteCategory);

export default router;
