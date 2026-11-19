import type { RequestHandler } from "express";
import { taskcommentSchema } from "../validator/taskcomment.validator";
import z from "zod";
import prisma from "@repo/db/index";

export const ValidatorTaskComment: RequestHandler = async (req, res, next) => {
  const result = taskcommentSchema.safeParse(req.body);

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

export const ValidatortaskId: RequestHandler = async (req, res, next) => {
  const taskIdResult = z.string().uuid().safeParse(req.params.taskId);

  if (!taskIdResult.success) {
    res.status(400).json({
      message: "Invalid workspace ID",
      errors: taskIdResult.error.issues,
    });
    return;
  }

  res.locals.taskId = taskIdResult.data;
  next();
};

export const createtaskComment: RequestHandler = async (req, res) => {
  const senderId = res.locals.userId;
  const taskId: string = res.locals.taskId;

  if (typeof senderId !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { content } = req.body;
    const Task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        project: {
          select: { workspaceId: true },
        },
      },
    });

    if (!Task) return res.status(404).json({ message: "task not found" });

    const userMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          userId: senderId,
          workspaceId: Task.project.workspaceId,
        },
      },
      select: { status: true, role: true, workspaceId: true },
    });

    if (!userMembership || userMembership.status !== "ACTIVE") {
      return res
        .status(403)
        .json({ message: "You cannot comment on this task" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const comment = await tx.taskComment.create({
        data: {
          taskId,
          userId: senderId,
          content,
        },
      });

      const activity = await tx.activityLog.create({
        data: {
          workspaceId: Task.project.workspaceId,
          actorId: senderId,
          action: "COMMENT_CREATED",
          entityType: "COMMENT",
          entityId: comment.id,
          metadata: { taskId },
        },
      });

      return { comment, activity };
    });

    return res.status(201).json({ result });
  } catch (error: unknown) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskcomment: RequestHandler = async (req, res) => {
  const userId = res.locals.userId;
  const taskId = res.locals.taskId;
  try {
    const taskComment = await prisma.taskComment.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    if (taskComment.length === 0)
      return res.status(404).json({ message: "No Comment Yet" });

    return res.status(201).json({ taskComment });
  } catch (error: unknown) {
    return res.status(500).json({ message: "Internal server errror" });
  }
};

export const updateTaskComment: RequestHandler = async (req, res) => {};

export const deleteTaskComment: RequestHandler = async (req, res) => {};
