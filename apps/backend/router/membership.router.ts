import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  acceptMembershipInvitation,
  getMyInvitations,
  membershipCreate,
  MembershipValidator,
  validateWorkspaceId,
} from "../controller/membership.controller";

const router = Router();

router.get("/me/invitations", requireAuth, getMyInvitations);

router.post(
  "/workspaces/:workspaceId/members",
  requireAuth,
  validateWorkspaceId,
  MembershipValidator,
  membershipCreate,
);

router.post(
  "/workspaces/:workspaceId/invitations/accept",
  requireAuth,
  validateWorkspaceId,
  acceptMembershipInvitation,
);

export default router;