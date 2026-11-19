import type { Request, RequestHandler, Response } from "express";
import { projectSchema, type projectInput } from "../validator/project.validator";
import prisma from "@repo/db/index";
import z from "zod";

export const ProjectValidator: RequestHandler = (req,res,next) => {
    const result= projectSchema.safeParse(req.body);
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

export const createProject: RequestHandler = async (req, res) => {
     try {
        const createdById=res.locals.userId;
        const {workspaceId, name, description, status, deadline} = req.body;

        const isExistProject = await prisma.project.findFirst({
            where:{createdById, name}
        })

        if (isExistProject) {
          res.status(409).json({ message: "You already have a project with that name" });
          return;
        }

        const project = await prisma.project.create({
            data: {
                createdById,
                workspaceId,
                name,
                description,
                status,
                deadline,
                members: {
                    create: { userId: createdById },
                },
            }
        })

        return res.status(201).json({ project })
        
     } catch (error: unknown) {
         console.error("Failed to create project:", error);
          return res.status(500).json({ message: "Internal server error" });
        
     }
}

export const getAllProjectByWorkspace: RequestHandler = async (req, res, next) => {

        const workspaceIdResult= z.string().uuid().safeParse(req.params.id );

        if (!workspaceIdResult.success) {
            res.status(400).json({ message: "Invalid project ID" });
            return;
          }

    try {

        const userId = res.locals.userId;
        const workspaceId=workspaceIdResult.data;

        const IsExistWorkSpace= await prisma.workspace.findFirst({where: {id: workspaceId, createdById: userId}, select: {id:true}})

        if (!IsExistWorkSpace) {
           res.status(404).json({ message: "Workspace not found" });
           return;
         }



        const Projects= await prisma.project.findMany({where: { workspaceId}});

        if(!Projects){
            res.status(404).json({message: "This workspace doesn't have any project"});
            return;
        }

        return res.status(201).json({Projects});   
    } catch (error) {
        return res.status(500).json({message: "Internal error"})
    }
}