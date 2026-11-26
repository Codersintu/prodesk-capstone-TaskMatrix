import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Workspace from "../../../components/workspace/Workspace";
import { authOptions } from "../../../lib/auth";
import { fetchBackend } from "../../../lib/http/server";

type WorkspaceSummary = {
  id: string;
  name: string;
};

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  };

  const { workspaceId } =await params;

  const response = await fetchBackend("/api/getworkspace");
  if (!response.ok) {
    throw new Error("Unable to load your workspaces.");
  }

  const { allWorkspace } = (await response.json()) as {
    allWorkspace: WorkspaceSummary[];
  };
  const workspace = allWorkspace.find((item) => item.id === workspaceId);

  if (!workspace) {
    notFound();
  }
  

  return <Workspace workspace={workspace} workspaces={allWorkspace} />;
}
