import { fetchBackend } from "../../../../lib/http/server";

export async function GET() {
  const response = await fetchBackend("/api/getworkspace");
  return Response.json(await response.json(), { status: response.status });
}

export async function POST(request: Request) {
  const response = await fetchBackend("/api/workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  return Response.json(await response.json(), { status: response.status });
}