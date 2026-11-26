import { z } from "zod";
import { fetchBackend } from "../../../../../../lib/http/server";

export async function GET() {
  const response = await fetchBackend("/api/me/invitations");
  return Response.json(await response.json(), { status: response.status });
}

export async function POST(request: Request, {params}: {params: Promise<{projectId: string}> }) {

  const { projectId } = await params;
  const parsedProjectId = z.string().uuid().safeParse(projectId);

  if (!parsedProjectId.success) {
    return Response.json({ message: "Invalid workspace ID." }, { status: 400 });
  }

  const response = await fetchBackend(
    `/api/projects/${projectId}/members`,
    {
    method: "POST",
    },
  );

  return Response.json(await response.json(), { status: response.status });
}
