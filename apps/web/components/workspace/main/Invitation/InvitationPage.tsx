import { useQuery } from "@tanstack/react-query";
import InvitationCard from "./InvitationCard";
import {
  getInvitation,
  type InvitationSummary,
} from "../../../../lib/http/client";

export default function InvitationPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invitations"],
    queryFn: getInvitation,
  });
  
  const pendingInvitations =
    data?.filter((invitation) => invitation.status === "INVITED") ?? [];
  const pastInvitations =
    data?.filter((invitation) => invitation.status !== "INVITED") ?? [];

  return (
    <section
      className="h-full overflow-y-auto p-5 text-white"
      aria-labelledby="projects-heading"
    >
      <nav aria-label="Breadcrumb" className="mb-2 text-[10px] text-[#8a8a8a]">
        Workspace <span className="mx-1">/</span>{" "}
        <span className="text-[#b8b8b8]">Invitation</span>
      </nav>

      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 id="projects-heading" className="text-3xl font-semibold">
            Invitation
          </h1>
          <p className="mt-1 text-sm text-[#a3a3a3]">
            Manage and track your Invitation
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <span
            aria-hidden="true"
            className="mt-10 h-10 w-10 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
          <span>Loading invitations...</span>
        </div>
      ) : isError ? (
        <p className="mt-3 text-sm text-rose-300">
          Could not load your invitations. Please try again.
        </p>
      ) : (
        <div className="space-y-8">
          <section aria-labelledby="pending-invitations-heading">
            <h2 id="pending-invitations-heading" className="font-semibold">
              Pending <span className="text-gray-400">{pendingInvitations.length}</span>
            </h2>
            {pendingInvitations.length > 0 ? (
              <div className="mt-3 flex flex-col gap-3">
                {pendingInvitations.map((invitation: InvitationSummary) => (
                  <InvitationCard key={invitation.id} invitation={invitation} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                You have no pending invitations.
              </p>
            )}
          </section>

          <section aria-labelledby="past-invitations-heading">
            <h2 id="past-invitations-heading" className="font-semibold">
              Past invitations
            </h2>
            {pastInvitations.length > 0 ? (
              <div className="mt-3 flex flex-col gap-3">
                {pastInvitations.map((invitation: InvitationSummary) => (
                  <InvitationCard key={invitation.id} invitation={invitation} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                No past invitations yet.
              </p>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
