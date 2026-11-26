import Link from "next/link";
import { WorkspaceSummary } from "../../Topbar";

type WorkspaceListProps = {
  activeWorkspaceId: string;
  workspaces: WorkspaceSummary[];
  onCreateWorkspace: () => void;
};

export default function WorkspaceList({
  activeWorkspaceId,
  workspaces,
  onCreateWorkspace,
}: WorkspaceListProps) {
  return (
    <div
      className="absolute left-44 top-full z-50 min-w-56 rounded-xl border border-gray-700 bg-[#080808] p-2 text-white shadow-xl"
      id="workspace-dropdown"
    >
      <nav aria-label="Workspaces" className="flex flex-col">
        {workspaces.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/workspace/${workspace.id}`}
            aria-current={
              workspace.id === activeWorkspaceId ? "page" : undefined
            }
            className="rounded-lg px-3 py-2 text-sm hover:bg-white/10 aria-[current=page]:bg-white/10"
          >
            {workspace.name}
          </Link>
        ))}
        <button
          className="mt-2 border-t border-gray-700 px-3 py-2 text-left text-sm text-violet-300 hover:bg-white/10"
          onClick={onCreateWorkspace}
          type="button"
        >
          Create workspace +
        </button>
      </nav>
    </div>
  );
}