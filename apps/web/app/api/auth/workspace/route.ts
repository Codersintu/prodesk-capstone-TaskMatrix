import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import prisma from "@repo/db/index";
import { authOptions } from "../../../../lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

  const token = jwt.sign({}, process.env.INTERNAL_API_SECRET!, {
    algorithm: "HS256",
    subject: user.id,
    issuer: "taskmatrix-web",
    audience: "taskmatrix-api",
    expiresIn: "60s",
  });

  const body = await request.json();

  const response = await fetch(`${process.env.BACKEND_URL}/api/workspace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return Response.json(await response.json(), { status: response.status });
}