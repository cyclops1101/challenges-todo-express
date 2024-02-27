import { Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  listUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.route("/").get(listUser);
userRoutes.route("/").post(createUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/logout").post(logoutUser);
userRoutes.route("/").put(updateUser);
userRoutes.route("/").delete(deleteUser);

export default userRoutes;
