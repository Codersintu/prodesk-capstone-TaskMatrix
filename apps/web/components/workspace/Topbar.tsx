"use client";

import { useState } from "react";
import NotifyIcon from "./Icon/NotifyIcon";
import PersonIcon from "./Icon/PersonIcon";
import SeacrhIcon from "./Icon/SearchIcon";
import ArrowDown from "./Icon/ArrowDown";
import ArrowUp from "./Icon/ArrowUp";
import WorkspaceList from "./main/workspace/WorkspaceList";
import CreateworkspaceModel from "./main/workspace/CreateworkspaceModel";

type TopbarProps = {
  workspace: WorkspaceSummary;
  workspaces: WorkspaceSummary[];
};

export type WorkspaceSummary = {
  id: string;
  name: string;
};

export default function Topbar({ workspace, workspaces }: TopbarProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWorkspaceListOpen, setIsWorkspaceListOpen] = useState(false);

  return (
    <>
      <div className="relative z-20 border-b border-gray-400">
        <div className="flex items-center justify-between px-10 py-2">
          <div className="flex items-center justify-center gap-10">
            <h1 className="text-2xl font-semibold">TaskMatrix</h1>

            <div className="relative flex flex-col items-center justify-center rounded-md border border-[#242424] px-8">
              <p className="text-[9px] font-medium uppercase tracking-wide text-[#8a8a8a]">
                Workspace
              </p>
              <button
                type="button"
                className="flex items-center justify-center gap-3 text-sm font-medium hover:text-gray-400"
                aria-haspopup="true"
                aria-expanded={isWorkspaceListOpen}
                aria-controls="workspace-dropdown"
                onClick={() => setIsWorkspaceListOpen((isOpen) => !isOpen)}
              >
                <span>{workspace.name}</span>
                {isWorkspaceListOpen ? <ArrowDown /> : <ArrowUp/>}
              </button>
            </div>
            {isWorkspaceListOpen && (
              <WorkspaceList
                activeWorkspaceId={workspace.id}
                workspaces={workspaces}
                onCreateWorkspace={() => {
                  setIsWorkspaceListOpen(false);
                  setIsCreateOpen(true);
                }}
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-8">
            <SeacrhIcon />
            <NotifyIcon />
            <PersonIcon />
          </div>
        </div>
      </div>
      {isCreateOpen && (
        <CreateworkspaceModel onClose={() => setIsCreateOpen(false)} />
      )}
    </>
  );
}
