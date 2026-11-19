import type { RequestHandler } from "express";
import { workspaceSchema } from "../validator/workspace.validator";
import prisma from "@repo/db/index";

export const validateWorkspace: RequestHandler = (req, res, next) => {
  const result = workspaceSchema.safeParse(req.body);
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

export const createWorkspace: RequestHandler = async (req, res) => {
  try {
    const createdById = res.locals.userId;
    const { name, description } = req.body;

    const isExistWorkspace = await prisma.workspace.findFirst({
      where: { createdById, name },
    });

    if (isExistWorkspace) {
      res
        .status(409)
        .json({ message: "You already have a workspace with that name" });
      return;
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        createdById,
        memberships: {
          create: {
            userId: createdById,
            role: "OWNER",
            status: "ACTIVE",
            joinedAt: new Date(),
          },
        },
      },
    });

    return res.status(201).json({ workspace });
  } catch (error: unknown) {
    console.error("Failed to create workspace:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getWorkspaceByuserId: RequestHandler = async (req, res, next) => {
  try {
    const createdById = res.locals.userId;
    const allWorkspace = await prisma.workspace.findMany({
      where: { createdById },
    });

    if (!allWorkspace) {
      res.status(404).json({ message: "user doesn't have any workspace" });
      return;
    }

    return res.status(201).json({ allWorkspace });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};
