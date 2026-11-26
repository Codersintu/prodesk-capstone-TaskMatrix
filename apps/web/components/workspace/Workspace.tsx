"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import KanbanBoard from "./main/Task/KanbanBoard";
import MemberPage from "./main/member/MemberPage";
import Overview from "./main/Overview";
import ProjectPage from "./main/project/ProjectPage";
import type { WorkspaceView } from "./Sidebar";
import InvitationPage from "./main/Invitation/InvitationPage";

type WorkspaceSummary = {
    id: string;
    name: string;
};

export default function Workspace({
    workspace,
    workspaces,
}: {
    workspace: WorkspaceSummary;
    workspaces: WorkspaceSummary[];
}) {
    const [activeView, setActiveView] = useState<WorkspaceView>("overview");
    const pageByView = {
        overview: Overview,
        tasks: KanbanBoard,
        Invite:InvitationPage   
    };
    const ActivePage =
        activeView === "members" || activeView === "projects"
            ? null
            : pageByView[activeView];

    return (
        <div className="flex min-h-dvh flex-col">
            <Topbar workspace={workspace} workspaces={workspaces} />
            <div className="flex min-h-0 flex-1 mt-3">
                <Sidebar activeView={activeView} onViewChange={setActiveView} />
                <main className="min-w-0 flex-1" aria-label="Workspace content">
                    {activeView === "members" ? (
                        <MemberPage workspaceId={workspace.id} />
                    ) : activeView === "projects" ? (
                        <ProjectPage workspaceId={workspace.id} />
                    ) : (
                        ActivePage && <ActivePage />
                    )}
                </main>
            </div>
        </div>
    )
};

