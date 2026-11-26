import { useState } from "react";
import CreateprojectModel from "./CreateprojectModal";
import { useQuery } from "@tanstack/react-query";
import {
    getAllProject,
    getWorkspaceMember,
    type ProjectSummary,
    type WorkspaceMemberSummary,
} from "../../../../lib/http/client";
import ProjectCard from "./projectCard";



export default function ProjectPage({
    workspaceId,
}: {
    workspaceId: string;
}) {
    const [openProjectModel,setopenProjectModel]=useState(false);

    const {data, isLoading,isError} = useQuery({
        queryKey: ["projectdata", workspaceId],
        queryFn: () => getAllProject(workspaceId)
    })
    const { data: workspaceData } = useQuery({
        queryKey: ["workspaceMember", workspaceId],
        queryFn: getWorkspaceMember,
    });
    const canCreateProject = data?.currentUserRole === "OWNER";
    const activeWorkspaceMembers =
        workspaceData
            ?.find((workspace: WorkspaceMemberSummary) => workspace.id === workspaceId)
            ?.memberships.filter((membership) => membership.status === "ACTIVE")
            .map((membership) => membership.user) ?? [];

    return (
        <>
        <section className="h-full overflow-y-auto p-5 text-white" aria-labelledby="projects-heading">
            <nav aria-label="Breadcrumb" className="mb-2 text-[10px] text-[#8a8a8a]">
                Workspace <span className="mx-1">/</span> <span className="text-[#b8b8b8]">Projects</span>
            </nav>
            <header className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h1 id="projects-heading" className="text-2xl font-semibold">Projects</h1>
                    <p className="mt-1 text-sm text-[#a3a3a3]">Manage and track your team&apos;s projects.</p>
                </div>
                {canCreateProject && <button
                    type="button"
                    className="flex shrink-0 items-center gap-2 rounded-md bg-[#7057ef] px-3 py-2 text-[10px] font-medium text-white hover:bg-[#806af4]"
                    onClick={()=>setopenProjectModel(true)}
                >
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Create Project
                </button>}
            </header>
            {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <span
            aria-hidden="true"
            className="mt-10 h-10 w-10 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
          <span>Loading Project...</span>
        </div> 
            
        ) : isError ? (
        <p className="mt-3 text-sm text-rose-300">
          Could not load your project. Please try again.
        </p>
       ) : (
           (data?.projects.length ?? 0) > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-3">
                {data?.projects.map((project: ProjectSummary) => (
                    <ProjectCard
                        key={project.id}
                        {...project}
                        members={project.members ?? []}
                        workspaceMembers={activeWorkspaceMembers}
                    />
                ))}
            </div>
            ) : (
                <p className="mt-3 text-sm text-gray-400">
                You have no project.
              </p>
            ))}
        </section>
        {openProjectModel &&
        <CreateprojectModel
            workspaceId={workspaceId}
            onClose={() => setopenProjectModel(false)}
        />
        }
        </>
    );
}