import type { RequestHandler} from "express";
import prisma from "@repo/db/index";
import { membershipSchema } from "../validator/membership.validator";

export const MembershipValidator: RequestHandler = (req,res,next) => {
    const result= membershipSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({
            message: "Validation failed",
            errors:result.error.issues
        })
        return;
    };
    req.body=result.data;
    next();
};

export const membershipCreate: RequestHandler = async (req, res) =>{
    const userId=res.locals.userId;
    try {
        const {workspaceId, role, status,joinedAt} = req.body;

        const memberShip= await prisma.membership.create({
            data:{
                userId,
                workspaceId,
                role,
                status,
                joinedAt
            }
        })
        
        return res.status(201).json({memberShip})
    } catch (error) {
        return res.status(500).json({message: " Internal Server Error"})
    }

}

