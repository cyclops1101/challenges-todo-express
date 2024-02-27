import { Router } from "express";
import { authenticationMiddleware } from "../middleware";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksByCategory,
  getTodaysTask,
  toggleTask,
  updateTask,
} from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.use(authenticationMiddleware);

taskRoutes.route("/").get(getTasks);
taskRoutes.route("/").post(createTask);
taskRoutes.route("/category/:category").get(getTasksByCategory);
taskRoutes.route("/today").get(getTodaysTask);
taskRoutes.route("/:id/toggle").put(toggleTask);
taskRoutes.route("/:id").put(updateTask);
taskRoutes.route("/:id").delete(deleteTask);

export default taskRoutes;
