import type { RequestHandler } from "express";
import { taskSchema } from "../validator/task.validator";
import prisma from "@repo/db/index";
import z from "zod";

export const taskValidator: RequestHandler = (req,res,next) => {
    const result= taskSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({
            message: "Validation failed",
            errors:result.error.issues
        })
        return;
    };
    req.body=result.data;
    next();
}

export const createTask: RequestHandler = async (req, res) => {
    try {
        const createdById=res.locals.userId;
        const {projectId, assigneeId, title, description, priority, status, startDate, dueDate}= req.body;

        const task= await prisma.task.create({
            data:{
                projectId, 
                createdById,
                assigneeId, 
                title, 
                description, 
                priority, 
                status, 
                startDate, 
                dueDate

            },
        });

        return res.status(201).json({task})
    } catch (error: unknown) {
        return res.status(500).json({message: "Internal error"})
        
    };
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

    const project = await prisma.project.findFirst({
      where: { id: projectId, createdById: userId },
      select: { id: true },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ tasks });
  } catch (error: unknown) {
    console.error("Failed to get project tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};