import express from "express";
import { protectRoute, admin } from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import checkObjectId from "../middlewares/checkObjectId.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protectRoute, admin, createProduct);
router
  .route("/:id/reviews")
  .post(protectRoute, checkObjectId, createProductReview);
router.get("/top", getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protectRoute, admin, checkObjectId, updateProduct)
  .delete(protectRoute, admin, checkObjectId, deleteProduct);

export default router;
