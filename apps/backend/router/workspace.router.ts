import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createWorkspace,
  getWorkspaceByuserId,
  getWorkspaceByworkspaceId,
  validateWorkspace,
} from "../controller/workspace.controller";

const router = Router();

router.post("/workspace", requireAuth, validateWorkspace, createWorkspace);
router.get("/getworkspace", requireAuth, getWorkspaceByuserId);
router.get(
  "/getworkspace/:workspaceId",
  requireAuth,
  getWorkspaceByworkspaceId,
);

export default router;