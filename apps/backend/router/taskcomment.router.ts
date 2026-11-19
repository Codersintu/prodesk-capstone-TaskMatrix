import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createtaskComment, deleteTaskComment, getTaskcomment, updateTaskComment, ValidatorTaskComment, ValidatortaskId } from "../controller/taskcomment.controller";

const router = Router();

router.get("/tasks/:taskId/comments", requireAuth, ValidatortaskId, getTaskcomment);
router.post("/tasks/:taskId/comments", requireAuth, ValidatortaskId, ValidatorTaskComment, createtaskComment);
router.put("/comments/:commentId", requireAuth, updateTaskComment);
router.delete("/comments/:commentId",requireAuth, deleteTaskComment);

export default router;