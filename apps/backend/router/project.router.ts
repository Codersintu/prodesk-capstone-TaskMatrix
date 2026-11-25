import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createProject,
  getAllProjectByWorkspace,
  ProjectValidator,
} from "../controller/project.controller";
import {
  addProjectMember,
  getProjectMember,
  removeProjectMember,
  validateDeleteProjectMember,
  validateProjectMember,
} from "../controller/projectmember.controller";

const router = Router();

router.post("/project", requireAuth, ProjectValidator, createProject);
router.get("/:workspaceId/getProject", requireAuth, getAllProjectByWorkspace);
router.post(
  "/projects/:projectId/members",
  requireAuth,
  validateProjectMember,
  addProjectMember,
);

router.delete(
  "/projects/:projectId/members/:userId",
  requireAuth,
  validateDeleteProjectMember,
  removeProjectMember,
);
router.get("/projects/:projectId/members", requireAuth, getProjectMember);

export default router;
