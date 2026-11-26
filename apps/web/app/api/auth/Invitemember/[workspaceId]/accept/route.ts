import { z } from "zod";
import { fetchBackend } from "../../../../../../lib/http/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await params;
  const parsedWorkspaceId = z.string().uuid().safeParse(workspaceId);

  if (!parsedWorkspaceId.success) {
    return Response.json({ message: "Invalid workspace ID." }, { status: 400 });
  }

  const response = await fetchBackend(
    `/api/workspaces/${encodeURIComponent(parsedWorkspaceId.data)}/invitations/accept`,
    { method: "POST" },
  );

  return Response.json(await response.json(), { status: response.status });
}