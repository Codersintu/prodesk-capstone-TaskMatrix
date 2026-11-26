import "server-only";

import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import prisma from "@repo/db/index";
import { authOptions } from "../auth";

export async function fetchBackend(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.INTERNAL_API_SECRET;
  const backendUrl = process.env.BACKEND_URL;
  if (!secret || secret.length < 32 || !backendUrl) {
    console.error("Backend authentication is not configured");
    return Response.json(
      { error: "Backend authentication is not configured" },
      { status: 500 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

  const token = jwt.sign({}, secret, {
    algorithm: "HS256",
    subject: user.id,
    issuer: "taskmatrix-web",
    audience: "taskmatrix-api",
    expiresIn: "60min",
  });

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(new URL(path, backendUrl), {
    ...init,
    headers,
    cache: "no-store",
  });
}