import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { protectRoute, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protectRoute, admin, getAllUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route('/profile')
  .get(protectRoute, getUserProfile)
  .put(protectRoute, updateUserProfile);
router
  .route('/:id')
  .delete(protectRoute, admin, deleteUser)
  .get(protectRoute, admin, getUserById)
  .put(protectRoute, admin, updateUser);

export default router;
