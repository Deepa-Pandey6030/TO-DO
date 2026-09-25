import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
} from "../controllers/tasksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All task routes are protected — authMiddleware verifies JWT
router.use(authMiddleware);

// Stats must come before /:id to avoid "stats" being treated as an id param
router.get("/stats", getTaskStats);

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", deleteTask);

export default router;
