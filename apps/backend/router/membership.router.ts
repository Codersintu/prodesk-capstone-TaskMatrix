import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { membershipCreate, MembershipValidator } from "../controller/membership.controller";

const router = Router();

router.post("/membership", requireAuth, MembershipValidator, membershipCreate);

export default router;