import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const requireAuth: RequestHandler = (req, res, next) => {

    const [schema,token] = req.headers.authorization?.split(" ") ?? [];
    if(schema !== "Bearer" || !token){
        return res.status(401).json({error:"Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.INTERNAL_API_SECRET!, {
            algorithms: ["HS256"],
            issuer: "taskmatrix-web",
            audience: "taskmatrix-api",
        });

        if(!decoded || typeof decoded === "string" || !decoded.sub){
            return res.status(401).json({error:"Unauthorized"});
        }
        res.locals.userId = decoded.sub;
        next();
    } catch (error) {
        return res.status(401).json({error:"Unauthorized"});
    }
}