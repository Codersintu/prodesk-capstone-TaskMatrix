
export type InvitationSummary = {
  id: string;
  createdAt: string;
  role: string;
  status: string;
  workspace: WorkspaceSummary;
  invitedBy: InvitedBySummary | null;
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  description?: string | null;
};

export type InvitedBySummary = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
};

export async function getInvitation(): Promise<InvitationSummary[]> {
  const response = await fetch("/api/auth/Invitemember");
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ?? result?.error ?? "Unable to load Invitation.",
    );
  }

  return result.invitations;
}


export type WorkspaceMemberSummary={
  id: string;
  name: string;
  memberships: MembershipSummary[];
  currentUserRole: "OWNER" | "ADMIN" | "MEMBER" | null;
};

export type MembershipSummary = {
  status: string;
  role: string;
  joinedAt: string | null;
  user: UserSummary;
};

export type UserSummary = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export async function getWorkspaceMember(): Promise<WorkspaceMemberSummary[]> {
  const response= await fetch("/api/auth/workspace",{method:"GET"});
  const result= await response.json();

    if (!response.ok) {
    throw new Error(
      result?.message ?? result?.error ?? "Unable to load workspace member.",
    );
  }

    return result.allWorkspace;
}


export type ProjectCreator = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type ProjectMemberSummary = {
  user: UserSummary;
};

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  deadline: string | null;
  createdBy: ProjectCreator;
  members?: ProjectMemberSummary[];
};

export type ProjectListResponse = {
  projects: ProjectSummary[];
  currentUserRole: "OWNER" | "ADMIN" | "MEMBER" | null;
};

export async function getAllProject(
  workspaceId: string,
): Promise<ProjectListResponse> {
  const response = await fetch(
    `/api/auth/project/${encodeURIComponent(workspaceId)}/project`,
    { cache: "no-store" },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ?? result?.error ?? "Unable to load projects.",
    );
  }
 
  return result as ProjectListResponse;
}


export async function addProjectMember(projectId:string,selectedMemberIds: string[]) {
  const response=await fetch(`{/api/projects/${projectId}/members}`,{
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify({userId: selectedMemberIds.map((userId)=>({userId}))}),
  });

  const result= await response.json();

  if(!response.ok){
      throw new Error(
      result?.message ?? result?.error ?? "Unable to load projects.",
    );
  }

  return result
}