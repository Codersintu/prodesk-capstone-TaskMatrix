import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getWorkspaceMember,
    type WorkspaceMemberSummary,
} from "../../../../lib/http/client";
import InvitememberModel from "../Invitation/InvitememberModel";


export default function MemberPage({ workspaceId }: { workspaceId: string }) {
    const [openInvitePage,setopenInvitePage] = useState(false);
    const {data, isLoading, isError}=useQuery({
       queryKey: ["workspaceMember", workspaceId],
       queryFn: getWorkspaceMember,
    })
    const workspace = data?.find(
        (item: WorkspaceMemberSummary) => item.id === workspaceId,
    );
    const memberships = workspace?.memberships ?? [];
    const canInviteMembers = workspace?.currentUserRole === "OWNER";


    return (
        <>
        <section className="h-full overflow-y-auto p-4 text-white sm:p-5" aria-labelledby="members-heading">
            <nav aria-label="Breadcrumb" className="mb-2 text-[10px] text-[#8a8a8a]">
                Workspace <span className="mx-1">/</span> <span className="text-[#b8b8b8]">Members</span>
            </nav>
            <header className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h1 id="members-heading" className="text-base font-semibold">Team Members</h1>
                    <p className="mt-1 text-[11px] text-[#a3a3a3]">Manage your workspace members.</p>
                </div>

                {canInviteMembers && <button
                    type="button"
                    onClick={()=> setopenInvitePage(true)}
                    className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#7057ef] px-3 py-2 text-[10px] font-medium hover:bg-[#806af4]"
                >
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                        <path d="M6 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-4 7v-1a4 4 0 0 1 8 0v1H2Zm10-8h4m-2-2v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Invite Member
                </button>}
            </header>
            <div className="overflow-x-auto rounded-md border border-[#222] bg-[#0b0b0b]">
                <table className="w-full min-w-2xl border-collapse text-left text-[10px]">
                    <thead>
                        <tr className="text-[9px] uppercase tracking-wide text-[#8a8a8a]">
                            <th scope="col" className="px-3 py-3 font-medium text-sm">Member</th>
                            <th scope="col" className="px-3 py-3 font-medium text-sm">Email</th>
                            <th scope="col" className="px-3 py-3 font-medium text-sm">Role</th>
                            <th scope="col" className="px-3 py-3 font-medium text-sm">Status</th>
                            <th scope="col" className="px-3 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td className="px-3 py-4 flex items-center text-sm text-gray-400" colSpan={5}>Loading members...</td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td className="px-3 py-4 text-rose-300" colSpan={5}>Unable to load members.</td>
                            </tr>
                        ) : memberships.length === 0 ? (
                            <tr>
                                <td className="px-3 py-4 text-gray-400" colSpan={5}>No active members found.</td>
                            </tr>
                        ) : memberships.map((membership) => {
                            const member = membership.user;
                            const displayName =
                                member.name ?? member.email ?? "Unnamed member";

                            return (
                            <tr key={member.id} className="border-t border-[#222]">
                                <td className="whitespace-nowrap px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-medium`}>
                                            {displayName.slice(0, 2).toUpperCase()}
                                        </span>
                                        <span className="font-medium text-[#e5e5e5] text-sm">{displayName}</span>
                                        {membership.role === "OWNER" && <span className="text-[9px] text-[#8a8a8a]">(owner)</span>}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap text-sm px-3 py-2 text-[#c4c4c4]">{member.email ?? "—"}</td>
                                <td className="px-3 py-2">
                                    {membership.role === "OWNER" ? (
                                        <span className="rounded-full bg-violet-950/70 px-2 py-1 text-[9px] text-violet-300">Owner</span>
                                    ) : (
                                        <select
                                            defaultValue={membership.role}
                                            className="rounded border border-[#292929] bg-[#0b0b0b] px-2 py-1 text-[10px] text-white outline-none focus:border-[#7057ef]"
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="MEMBER">Member</option>
                                        </select>
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <span className={`rounded-full px-2 py-1 text-[9px] ${
                                        membership.status === "INVITED"
                                            ? "bg-amber-950/70 text-amber-400"
                                            : "bg-emerald-950/70 text-emerald-400"
                                    }`}>
                                        {membership.status}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-right">
                                    {membership.role !== "OWNER" && (
                                        <button type="button" aria-label={`Remove ${displayName}`} className="text-[#777] hover:text-red-400">
                                            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="ml-auto h-3.5 w-3.5">
                                                <path d="M3 4.5h10M6 4.5V3h4v1.5m-5.5 0 .5 9h6l.5-9m-4 2v4m2-4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
        {canInviteMembers && openInvitePage &&
        <InvitememberModel
            workspaceId={workspaceId}
            onClose={() => setopenInvitePage(false)}
        />
        }
        </>
    );
}