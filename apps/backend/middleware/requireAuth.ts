import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const requireAuth: RequestHandler = (req, res, next) => {
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret) {
    console.error("INTERNAL_API_SECRET is not configured in the backend process");
    res.status(500).json({ error: "Authentication is not configured" });
    return;
  }

  const authorizationParts =
    req.get("authorization")?.trim().split(/\s+/) ?? [];
  const [scheme, token] = authorizationParts;

  if (
    authorizationParts.length !== 2 ||
    scheme?.toLowerCase() !== "bearer" ||
    !token
  ) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: "taskmatrix-web",
      audience: "taskmatrix-api",
    });

    if (typeof decoded === "string" || typeof decoded.sub !== "string") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.locals.userId = decoded.sub;
    next();
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Bearer token verification failed: ${reason}`);
    res.status(401).json({ error: "Unauthorized" });
  }
}