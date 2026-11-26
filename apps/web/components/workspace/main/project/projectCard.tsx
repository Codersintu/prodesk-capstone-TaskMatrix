"use client";

import { useState } from "react";
import {
  addProjectMember,
  type ProjectMemberSummary,
  type ProjectSummary,
  type UserSummary,
} from "../../../../lib/http/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMemberSchemaInput } from "../../../../lib/CreateSchema";

type ProjectCardProps = ProjectSummary & {
  workspaceMembers: UserSummary[];
};

export default function ProjectCard({
  id,
  name,
  description,
  status,
  createdBy,
  members: initialMembers = [],
  workspaceMembers,
}: ProjectCardProps) {
  const [members, setMembers] = useState<ProjectMemberSummary[]>(initialMembers);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const displayName = createdBy.name ?? createdBy.email ?? "Unnamed user";

  const availableMembers = workspaceMembers.filter(
    (workspaceMember) =>
      !members.some((projectMember) => projectMember.user.id === workspaceMember.id),
  );

  if (isDeleted) {
    return null;
  }

  function addSelectedMembers() {
    const selectedMembers = availableMembers
      .filter((member) => selectedMemberIds.includes(member.id))
      .map((user) => ({ user }));

    setMembers((current) => [...current, ...selectedMembers]);
    setSelectedMemberIds([]);
    setAddMembersOpen(false);
  }

  function removeMember(userId: string) {
    setMembers((current) =>
      current.filter((member) => member.user.id !== userId),
    );
  }
  
  const queryClient = useQueryClient();
  const addingMember= useMutation({
    mutationFn: () => addProjectMember(id, selectedMemberIds),
  })

  return (
    <>
      <article className="rounded-xl border border-[#222] bg-[#0b0b0b] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-semibold text-white">{name}</h3>
            <span
              className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] ${
                status === "ACTIVE"
                  ? "bg-gray-800 text-green-400"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label={`Project actions for ${name}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 hover:bg-white/10 hover:text-white"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-[#333] bg-[#151515] p-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setDeleteConfirmOpen(true);
                  }}
                  className="px-2 py-1 text-left text-sm text-red-300 hover:bg-red-950/50"
                >
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 min-h-8 text-sm leading-relaxed text-[#a3a3a3]">
          {description || "No description"}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#222] pt-3">
          <div className="flex min-w-0 items-center gap-2 text-xs text-[#a3a3a3]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-950 text-amber-300">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate">
              Lead · <span className="text-[#dedede]">{displayName}</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center">
            {members.slice(0, 4).map(({ user }) => {
              const memberName = user.name ?? user.email ?? "Unnamed member";
              return (
                <span
                  key={user.id}
                  title={memberName}
                  className="-ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b0b0b] bg-violet-950 text-[9px] text-violet-200 first:ml-0"
                >
                  {memberName.slice(0, 2).toUpperCase()}
                </span>
              );
            })}
            <button
              type="button"
              aria-label={`Add members to ${name}`}
              onClick={() => setAddMembersOpen(true)}
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-gray-500 text-base text-gray-300 hover:border-violet-400 hover:text-white"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={teamOpen}
          onClick={() => setTeamOpen((open) => !open)}
          className="mt-3 text-xs text-violet-300 hover:text-violet-200"
        >
          {teamOpen ? "Hide team" : `Manage team (${members.length})`}
        </button>

        {teamOpen && (
          <div className="mt-3 space-y-2 border-t border-[#222] pt-3">
            {members.length === 0 ? (
              <p className="text-xs text-gray-400">No project members yet.</p>
            ) : (
              members.map(({ user }) => {
                const memberName = user.name ?? user.email ?? "Unnamed member";
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{memberName}</p>
                      {user.email && (
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(user.id)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs text-red-300 hover:bg-red-950/50 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </article>

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 text-white shadow-2xl"
          >
            <h2 id="delete-project-title" className="text-lg font-semibold">
              Delete {name}?
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              This project will be removed from this preview. This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsDeleted(true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
              >
                Delete project
              </button>
            </div>
          </section>
        </div>
      )}

      {addMembersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-project-members-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151515] p-6 text-white shadow-2xl"
          >
            <h2 id="add-project-members-title" className="text-lg font-semibold">
              Add members to {name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Select active members of this workspace.
            </p>

            <div className="mt-5 max-h-64 space-y-2 overflow-y-auto">
              {availableMembers.length === 0 ? (
                <p className="rounded-lg border border-[#292929] p-3 text-sm text-gray-400">
                  All active workspace members are already on this project.
                </p>
              ) : (
                availableMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#292929] p-3 hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(member.id)}
                      onChange={(event) =>
                        setSelectedMemberIds((selected) =>
                          event.target.checked
                            ? [...selected, member.id]
                            : selected.filter((id) => id !== member.id),
                        )
                      }
                      className="h-4 w-4 accent-violet-500"
                    />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-950 text-xs text-violet-200">
                      {(member.name ?? member.email ?? "?")
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm">
                        {member.name ?? "Unnamed member"}
                      </span>
                      <span className="block truncate text-xs text-gray-400">
                        {member.email}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setAddMembersOpen(false);
                  setSelectedMemberIds([]);
                }}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={addingMember.isPending}
                onClick={()=> addingMember.mutate()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add selected
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
