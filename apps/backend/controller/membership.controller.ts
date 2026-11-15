import type { RequestHandler } from "express";
import z from "zod";
import prisma from "@repo/db/index";
import { membershipSchema } from "../validator/membership.validator";

export const validateWorkspaceId: RequestHandler = (req, res, next) => {
  const workspaceIdResult = z.string().uuid().safeParse(req.params.workspaceId);

  if (!workspaceIdResult.success) {
    res.status(400).json({
      message: "Invalid workspace ID",
      errors: workspaceIdResult.error.issues,
    });
    return;
  }

  res.locals.workspaceId = workspaceIdResult.data;
  next();
};

export const MembershipValidator: RequestHandler = (req, res, next) => {
  const result = membershipSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

export const membershipCreate: RequestHandler = async (req, res) => {
  const requesterId = res.locals.userId;
  const workspaceId: string = res.locals.workspaceId;

  if (typeof requesterId !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { createdById: true },
    });

    if (!workspace) {
      res.status(404).json({ message: "Workspace not found" });
      return;
    }

    let canInvite = workspace.createdById === requesterId;

    if (!canInvite) {
      const requesterMembership = await prisma.membership.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: requesterId,
          },
        },
        select: { role: true, status: true },
      });

      canInvite =
        requesterMembership?.status === "ACTIVE" &&
        (requesterMembership.role === "OWNER" ||
          requesterMembership.role === "ADMIN");
    }

    if (!canInvite) {
      res.status(403).json({
        message: "You are not allowed to invite members to this workspace",
      });
      return;
    }

    const invitee = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: { id: true, name: true, email: true, image: true },
    });

    if (!invitee) {
      res.status(404).json({
        message: "No TaskMatrix account was found for that email",
      });
      return;
    }

    if (invitee.id === requesterId) {
      res.status(400).json({ message: "You cannot invite yourself" });
      return;
    }

    const existingMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: invitee.id,
        },
      },
      select: { id: true },
    });

    if (existingMembership) {
      res.status(409).json({
        message: "This user is already a member or has a pending invitation",
      });
      return;
    }

    const membership = await prisma.membership.create({
      data: {
        workspaceId,
        userId: invitee.id,
        role: "MEMBER",
        status: "INVITED",
        joinedAt: null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return res.status(201).json({ membership });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        message: "This user is already a member or has a pending invitation",
      });
      return;
    }

    console.error("Failed to invite workspace member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptMembershipInvitation: RequestHandler = async (req, res) => {
  const userId = res.locals.userId;
  const workspaceId: string = res.locals.workspaceId;

  if (typeof userId !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  };

  try {
    const result = await prisma.membership.updateMany({
      where: {
        workspaceId,
        userId,
        status: "INVITED",
      },
      data: {
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    if (result.count === 0) {
      const membership = await prisma.membership.findUnique({
        where: {
          workspaceId_userId: { workspaceId, userId },
        },
        select: { status: true },
      });

      if (!membership) {
        res.status(404).json({ message: "Invitation not found" });
        return;
      }

      if (membership.status === "ACTIVE") {
        res.status(409).json({ message: "You already joined this workspace" });
        return;
      }

      res.status(403).json({
        message: "This invitation cannot be accepted",
      });
      return;
    }

    const membership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      include: {
        workspace: { select: { id: true, name: true } },
      },
    });

    return res.status(200).json({ membership });
  } catch (error: unknown) {
    console.error("Failed to accept workspace invitation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyInvitations: RequestHandler = async (_req, res) => {
  const userId = res.locals.userId;

  if (typeof userId !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const invitations = await prisma.membership.findMany({
      where: {
        userId,
        status: "INVITED",
      },
      include: {
        workspace: {
          select: { id: true, name: true, description: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ invitations });
  } catch (error: unknown) {
    console.error("Failed to get workspace invitations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};