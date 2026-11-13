import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createTask, getTasksByProject, taskValidator } from "../controller/task.controller";

const router = Router();

router.post("/task", requireAuth, taskValidator, createTask);
router.get("/getTask", requireAuth, getTasksByProject);

export default router;