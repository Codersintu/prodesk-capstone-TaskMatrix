import type { RequestHandler } from "express";
import z from "zod";
import prisma from "@repo/db/index";
import { projectMemberSchema } from "../validator/projectMember.validator";

export const validateProjectMember: RequestHandler = (req, res, next) => {
  const projectIdResult = z.string().uuid().safeParse(req.params.projectId);
  const bodyResult = projectMemberSchema.safeParse(req.body);

  if (!projectIdResult.success || !bodyResult.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: [
        ...(projectIdResult.success ? [] : projectIdResult.error.issues),
        ...(bodyResult.success ? [] : bodyResult.error.issues),
      ],
    });
    return;
  }

  res.locals.projectId = projectIdResult.data;
  req.body = bodyResult.data;
  next();
};

export const validateDeleteProjectMember: RequestHandler = (req, res, next) => {
  const projectIdResult = z.string().uuid().safeParse(req.params.projectId);
  const membertoRemoveResult = z.string().uuid().safeParse(req.params.userId);

  if (!projectIdResult.success || !membertoRemoveResult.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: [
        ...(projectIdResult.success ? [] : projectIdResult.error.issues),
        ...(membertoRemoveResult.success
          ? []
          : membertoRemoveResult.error.issues),
      ],
    });
    return;
  }

  res.locals.projectId = projectIdResult.data;
  res.locals.MembertoRemove = membertoRemoveResult.data;
  next();
};

export const addProjectMember: RequestHandler = async (req, res) => {
  const requesterId = res.locals.userId;
  const projectId: string = res.locals.projectId;
  const { userId: newMemberId } = req.body;

  if (typeof requesterId !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        workspaceId: true,
        createdById: true,
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const requesterMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId: requesterId,
        },
      },
      select: { status: true, role: true },
    });

    const isActiveWorkspaceAdmin =
      requesterMembership?.status === "ACTIVE" &&
      (requesterMembership.role === "OWNER" ||
        requesterMembership.role === "ADMIN");
    const canManageProject =
      project.createdById === requesterId || isActiveWorkspaceAdmin;

    if (!canManageProject) {
      res.status(403).json({
        message: "You cannot add members to this project",
      });
      return;
    }

    const targetMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId: newMemberId,
        },
      },
      select: { status: true },
    });

    if (targetMembership?.status !== "ACTIVE") {
      res.status(400).json({
        message: "The user must be an active member of the workspace",
      });
      return;
    }
    const result = await prisma.$transaction(async (tx) => {
      const projectMember = await tx.projectMember.create({
        data: {
          projectId,
          userId: newMemberId,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      const activity = await tx.activityLog.create({
        data: {
          workspaceId: project.workspaceId,
          actorId: requesterId,
          action: "PROJECT_MEMBER_ADDED",
          entityType: "PROJECT",
          entityId: projectId,
          metadata: { projectId },
        },
      });

      return { projectMember, activity };
    });

    return res.status(201).json({ result });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      res.status(409).json({ message: "User is already a project member" });
      return;
    }

    console.error("Failed to add project member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProjectMember: RequestHandler = async (req, res) => {
  try {
    const requesterId = res.locals.userId;
    const projectId: string = res.locals.projectId;
    const memberToremove: string = res.locals.MembertoRemove;

    if (typeof requesterId !== "string")
      return res.status(401).json({ message: "Unauthorized" });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        workspaceId: true,
        createdById: true,
      },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const requesterMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId: requesterId,
        },
      },
      select: { status: true, role: true },
    });

    const isActiveWorkspaceAdmin =
      requesterMembership?.status === "ACTIVE" &&
      (requesterMembership.role === "OWNER" ||
        requesterMembership.role === "ADMIN");

    const canManageProject =
      project.createdById === requesterId || isActiveWorkspaceAdmin;

    if (!canManageProject) {
      res.status(403).json({
        message: "You cannot remove members to this project",
      });
      return;
    }

    const isExistProjectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          userId: memberToremove,
          projectId,
        },
      },
    });

    if (!isExistProjectMember)
      return res.status(400).json({ message: "project member not found" });

    const result = await prisma.$transaction(async (tx) => {
      const deleted = await tx.projectMember.deleteMany({
        where: {
          userId: memberToremove,
          projectId,
        },
      });

      if (deleted.count === 0) {
        return null;
      }

      await tx.taskAssignee.deleteMany({
        where: {
          userId: memberToremove,
          task: {
            is: { projectId },
          },
        },
      });

      const activity = await tx.activityLog.create({
        data: {
          workspaceId: project.workspaceId,
          actorId: requesterId,
          action: "PROJECT_MEMBER_REMOVED",
          entityType: "PROJECT",
          entityId: projectId,
          metadata: { removedUserId: memberToremove },
        },
      });

      return activity;
    });

    if (!result)
      return res.status(404).json({ message: "Project member not found" });

    return res.status(200).json({ message: "project member deleted" });
  } catch (error: unknown) {
    console.error("remove to add project member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectMember: RequestHandler = async (req, res) => {
  const ParsedprojectId = z.string().uuid().safeParse(req.params.projectId);

  if (!ParsedprojectId.success) {
    res.status(400).json({ message: "validation failed" });
  }

  try {
    const userId = res.locals.userId;
    const projectId = ParsedprojectId.data;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      res.status(404).json({ message: "project not found" });
      return;
    }

    const projectMembers = await prisma.projectMember.findMany({
      where: {
        projectId,
      },
    });

    if (!projectMembers) {
      res.status(404).json({ message: "no project member found" });
      return;
    }

    return res.status(200).json({ projectMembers });
  } catch (error: unknown) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};
