import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";
import { InvitationSummary } from "../../../../lib/http/client";
import CheckIcon from "../../Icon/CheckIcon";


type InvitationCardProps = {
  invitation: InvitationSummary;
};

export default function InvitationCard({ invitation }: InvitationCardProps) {
  const queryClient = useQueryClient();
  const acceptInvitation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/auth/Invitemember/${encodeURIComponent(invitation.workspace.id)}/accept`,
        { method: "POST" },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to accept invitation.");
      }

      return result;
    },
    onSuccess: async () => {
      toast.success("Invitation accepted.");
      await queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });


  const senderName =
     invitation.invitedBy?.name ??
    invitation.invitedBy?.email ??
    "Workspace admin";

  const sentDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(invitation.createdAt));

  return (
    <article key={invitation.id} className="rounded-md border border-[#222] bg-[#0b0b0b] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-950">
            <span className="flex h-full items-center justify-center text-xl font-semibold">
              {senderName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-10">
              <h2 className="text-lg font-semibold">{senderName}</h2>
              <span className="rounded-2xl bg-gray-700 px-1 text-[10px]">
                {invitation.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Invited you to {invitation.workspace.name} workspace
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Sent {sentDate} · {invitation.role}
            </p>
          </div>
        </div>
        
        {invitation.status === "INVITED" ? (
          <div className="flex items-center justify-center gap-4">
            <button
              className="border border-[#222] rounded-sm px-2 py-1 cursor-pointer"
              type="button"
            >
              Decline
            </button>
            <button
              className="flex items-center gap-2 cursor-pointer rounded-sm bg-blue-500 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={acceptInvitation.isPending}
              onClick={() => acceptInvitation.mutate()}
            >
              <CheckIcon />
              <span>{acceptInvitation.isPending ? "Accepting..." : "Accept"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-emerald-400">
              Accepted
            </span>
            <Link
              className="rounded-md border border-[#222] px-3 py-2 text-sm hover:bg-white/5"
              href={`/workspace/${invitation.workspace.id}`}
            >
              Open workspace →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
