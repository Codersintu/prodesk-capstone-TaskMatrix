import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createWorkspace, getWorkspaceByuserId, validateWorkspace } from "../controller/workspace.controller";

const router = Router();

router.post("/workspace", requireAuth, validateWorkspace, createWorkspace);
router.get("/getworkspace", requireAuth, getWorkspaceByuserId);

export default router;