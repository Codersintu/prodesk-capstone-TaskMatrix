import type { Request, RequestHandler, Response } from "express";
import {
  projectSchema,
  type projectInput,
} from "../validator/project.validator";
import prisma from "@repo/db/index";
import z from "zod";

export const ProjectValidator: RequestHandler = (req, res, next) => {
  const result = projectSchema.safeParse(req.body);
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

export const createProject: RequestHandler = async (req, res) => {
  try {
    const createdById = res.locals.userId;
    const { workspaceId, name, description, status, deadline,projectMemberIds } = req.body;


    const checkEligible = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: createdById,
        },
      },

      select: { role: true, status: true },
    });

    if (
      checkEligible?.status !== "ACTIVE" ||
      (checkEligible?.role !== "OWNER" && checkEligible?.role !== "ADMIN")
    ) {
      res.status(403).json({ message: "You cannot create a project" });
      return;
    }

    const isExistProject = await prisma.project.findFirst({
      where: { createdById, name },
    });

    if (isExistProject) {
      res
        .status(409)
        .json({ message: "You already have a project with that name" });
      return;
    }

    if(projectMemberIds.length > 0){
      const activeMember= await prisma.membership.findMany({
        where:{
            workspaceId,
            userId: {in : projectMemberIds},
            status: "ACTIVE"
        },
        select: {userId: true},
      })



      if(activeMember.length !== projectMemberIds.length){
        res.status(400).json({
          message: "Every project member must be an active workspace member",
        })
        return;
      }
    }

    const memberIdsToCreate = [
        ...new Set([createdById, ...projectMemberIds]),
     ];

    const project = await prisma.project.create({
      data: {
        createdById,
        workspaceId,
        name,
        description,
        status,
        deadline,
        members: {
          create: memberIdsToCreate.map((userId: string)=>({userId})),
        },
      },
    });

    return res.status(201).json({ project });
  } catch (error: unknown) {
    console.error("Failed to create project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProjectByWorkspace: RequestHandler = async (req, res) => {
  const workspaceIdResult = z.string().uuid().safeParse(req.params.workspaceId);

  if (!workspaceIdResult.success) {
    res.status(400).json({ message: "Invalid workspace ID" });
    return;
  }

  try {
    const userId = res.locals.userId;
    const workspaceId = workspaceIdResult.data;

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        memberships: {
          some: {
            userId,
            status: "ACTIVE",
          },
        },
      },
      select: {
        memberships: {
          where: {
            userId,
            status: "ACTIVE",
          },
          select: { role: true },
          take: 1,
        },
      },
    });

    if (!workspace) {
      res.status(404).json({ message: "Workspace not found" });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        deadline: true,

        createdBy: {
          select: { id: true, name: true, email: true, image: true },
        },
        members:{
          select:{
            user:{
              select:{ id: true, email: true, name: true},
            }
          }
        }

      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      projects,
      currentUserRole: workspace.memberships[0]?.role ?? null,
    });
  } catch (error) {
    console.error("Failed to get workspace projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
