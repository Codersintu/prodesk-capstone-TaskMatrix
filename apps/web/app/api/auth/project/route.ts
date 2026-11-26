import { fetchBackend } from "../../../../lib/http/server";

export async function POST(request: Request) {
  const response = await fetchBackend("/api/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  return Response.json(await response.json(), { status: response.status });
}