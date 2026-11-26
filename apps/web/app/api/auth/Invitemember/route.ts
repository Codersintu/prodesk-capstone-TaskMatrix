import { z } from "zod";
import { fetchBackend } from "../../../../lib/http/server";

export async function GET() {
  const response = await fetchBackend("/api/me/invitations");
  return Response.json(await response.json(), { status: response.status });
}

export async function POST(request: Request) {
  const payload = z
    .object({
      workspaceId: z.string().uuid(),
      email: z.string().email(),
    })
    .safeParse(await request.json());

  if (!payload.success) {
    return Response.json(
      { message: "Invalid workspace ID or email." },
      { status: 400 },
    );
  }

  const response = await fetchBackend(
    `/api/workspaces/${encodeURIComponent(payload.data.workspaceId)}/members`,
    {
    method: "POST",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.data.email }),
    },
  );

  return Response.json(await response.json(), { status: response.status });
}
