import type { RequestHandler } from "express";
import { z } from "zod";
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

export const getWorkspaceByuserId: RequestHandler = async (req, res) => {
  try {
    const createdById = res.locals.userId;
    const workspaces = await prisma.workspace.findMany({
      where: {
        memberships: {
          some: {
            userId: createdById,
            status: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        name: true,
        memberships: {
          where: { status: "ACTIVE" },
          select: {
            status: true,
            role: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
    const allWorkspace = workspaces.map(({ memberships, ...workspace }) => ({
      ...workspace,
      memberships,
      currentUserRole:
        memberships.find((membership) => membership.user.id === createdById)
          ?.role ?? null,
    }));

    return res.status(200).json({ allWorkspace });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};

export const getWorkspaceByworkspaceId: RequestHandler = async (req, res) => {
  try {
    const workspaceIdResult = z
      .string()
      .uuid()
      .safeParse(req.params.workspaceId);
    if (!workspaceIdResult.success) {
      res.status(400).json({ message: "Invalid workspace ID" });
      return;
    }

    const userId = res.locals.userId;
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceIdResult.data,
        memberships: {
          some: {
            userId,
            status: "ACTIVE",
          },
        },
      },
    });

    if (!workspace) {
      res.status(404).json({ message: "Workspace not found" });
      return;
    }

    return res.status(200).json({ workspace });
  } catch (error) {
    console.error("Failed to get workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
