import type { RequestHandler } from "express";
import { taskSchema } from "../validator/task.validator";
import prisma from "@repo/db/index";
import z from "zod";

export const taskValidator: RequestHandler = (req, res, next) => {
  const result = taskSchema.safeParse(req.body);
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

export const createTask: RequestHandler = async (req, res) => {
  try {  
    const createdById = res.locals.userId;
    if (typeof createdById !== "string") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      projectId,
      assigneeIds,
      title,
      description,
      priority,
      status,
      startDate,
      dueDate,
    } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, workspaceId: true, createdById: true },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const [workspaceMembership, projectMembership] = await Promise.all([
      prisma.membership.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: project.workspaceId,
            userId: createdById,
          },
        },
        select: { status: true, role: true },
      }),
      prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: createdById,
          },
        },
        select: { id: true },
      }),
    ]);

    const isWorkspaceAdmin =
      workspaceMembership?.status === "ACTIVE" &&
      (workspaceMembership.role === "OWNER" ||
        workspaceMembership.role === "ADMIN");
    const canCreateTask =
      workspaceMembership?.status === "ACTIVE" &&
      (project.createdById === createdById ||
        projectMembership !== null ||
        isWorkspaceAdmin);

    if (!canCreateTask) {
      res.status(403).json({
        message: "You cannot create tasks in this project",
      });
      return;
    }

    if (assigneeIds.length > 0) {
      const projectAssignees = await prisma.projectMember.findMany({
        where: {
          projectId,
          userId: { in: assigneeIds },
          user: {
            memberships: {
              some: {
                // At least one related record matches
                workspaceId: project.workspaceId,
                status: "ACTIVE",
              },
            },
          },
        },
        select: { userId: true },
      });

      if (projectAssignees.length !== assigneeIds.length) {
        res.status(400).json({
          message: "Every assignee must be an active project member",
        });
        return;
      }
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        createdById,
        title,
        description,
        priority,
        status,
        startDate,
        dueDate,
        assignees: {
          create: assigneeIds.map((userId: string) => ({ userId })),
        },
      },
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });

    return res.status(201).json({ task });
  } catch (error: unknown) {
    console.error("Failed to create task:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const getTasksByProject: RequestHandler = async (req, res) => {
  const projectIdResult = z.string().uuid().safeParse(req.params.projectId);

  if (!projectIdResult.success) {
    res.status(400).json({ message: "Invalid project ID" });
    return;
  }

  try {
    const userId = res.locals.userId;
    const projectId = projectIdResult.data;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, workspaceId: true, createdById: true },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const [workspaceMembership, projectMembership] = await Promise.all([
      prisma.membership.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: project.workspaceId,
            userId,
          },
        },
        select: { status: true, role: true },
      }),
      prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
        select: { id: true },
      }),
    ]);

    const isWorkspaceAdmin =
      workspaceMembership?.status === "ACTIVE" &&
      (workspaceMembership.role === "OWNER" ||
        workspaceMembership.role === "ADMIN");
    const canViewProject =
      workspaceMembership?.status === "ACTIVE" &&
      (project.createdById === userId ||
        projectMembership !== null ||
        isWorkspaceAdmin);

    if (!canViewProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });

    return res.status(200).json({ tasks });
  } catch (error: unknown) {
    console.error("Failed to get project tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};