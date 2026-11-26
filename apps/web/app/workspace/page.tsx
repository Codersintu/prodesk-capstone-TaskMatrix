import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { fetchBackend } from "../../lib/http/server";
import CreateworkspaceModel from "../../components/workspace/main/workspace/CreateworkspaceModel";

type WorkspaceSummary = {
  id: string;
  name: string;
};

export default async function WorkspaceHomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const response = await fetchBackend("/api/getworkspace",{
    method:"GET"
  });

  if (!response.ok) {
    throw new Error("Unable to load your workspaces.");
  }

  const { allWorkspace } = (await response.json()) as {
    allWorkspace: WorkspaceSummary[];
  };
  const workspace = allWorkspace[0];

  if (!workspace) {
    return <CreateworkspaceModel />;
  }

  redirect(`/workspace/${workspace.id}`);
}
