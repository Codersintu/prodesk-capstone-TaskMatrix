import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createProject, getAllProjectByWorkspace, ProjectValidator } from "../controller/project.controller";

const router = Router();

router.post("/project", requireAuth, ProjectValidator, createProject);
router.get("/getProject",requireAuth, getAllProjectByWorkspace);

export default router;