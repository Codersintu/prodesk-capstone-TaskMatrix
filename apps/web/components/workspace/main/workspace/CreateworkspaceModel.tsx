"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { WorkspaceInput, workspaceSchema } from "../../../../lib/CreateSchema";

type CreateworkspaceModelProps = {
  onClose?: () => void;
};

export default function CreateworkspaceModel({
  onClose,
}: CreateworkspaceModelProps) {


  const router=useRouter();

  const methods = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onWorkspaceSubmit: SubmitHandler<WorkspaceInput> = async (values) => {
    try {
      const response = await fetch("/api/auth/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        workspace?: { id: string };
      };

      if (!response.ok) {
        const message = result?.message ?? "Unable to create your workspace.";
        toast.error(message);
        return;
      }

      if (!result.workspace?.id) {
        throw new Error("The server did not return the created workspace.");
      }

      toast.success("workspace created successfully");
      onClose?.();
      router.push(`/workspace/${result.workspace.id}`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="create-workspace-title"
        aria-modal="true"
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#111116] text-white shadow-2xl shadow-black/50"
        role="dialog"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-[90px]"
        />

        <div className="relative border-b border-white/8 px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
          {onClose && (
            <button
              aria-label="Close create workspace dialog"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              type="button"
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="m5 5 10 10M15 5 5 15"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          )}

          <div className="flex items-start gap-4 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h4l2 2h5A2.5 2.5 0 0 1 20 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 10v6m-3-3h6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Start collaborating
              </p>
              <h2
                className="mt-1 text-2xl font-semibold tracking-tight"
                id="create-workspace-title"
              >
                Create a workspace
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
                Bring your projects and people together in one place.
              </p>
            </div>
          </div>
        </div>

        <form
          className="relative space-y-5 px-6 py-6 sm:px-8"
          onSubmit={handleSubmit(onWorkspaceSubmit)}
        >
          <div>
            <label
              className="mb-2 block text-sm font-medium text-white/85"
              htmlFor="workspace-name"
            >
              Workspace name <span className="text-violet-300">*</span>
            </label>
            <input
              autoFocus
              autoComplete="organization"
              id="workspace-name"
              placeholder="e.g. Product team"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "workspace-name-error" : "workspace-name-hint"
              }
              className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
              {...register("name", {
                required: "Give your workspace a name.",
                minLength: {
                  value: 2,
                  message: "Use at least 2 characters.",
                },
                maxLength: {
                  value: 100,
                  message: "Keep the name under 100 characters.",
                },
              })}
            />
            {errors.name ? (
              <p
                className="mt-2 text-xs text-rose-300"
                id="workspace-name-error"
              >
                {errors.name.message}
              </p>
            ) : (
              <p
                className="mt-2 text-xs text-white/40"
                id="workspace-name-hint"
              >
                Choose a name your team will recognize.
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-white/85"
              htmlFor="workspace-description"
            >
              Description{" "}
              <span className="font-normal text-white/40">Optional</span>
            </label>
            <textarea
              id="workspace-description"
              placeholder="What will your team use this workspace for?"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Keep the description under 500 characters.",
                },
              })}
            />
            {errors.description && (
              <p className="mt-2 text-xs text-rose-300">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
            {onClose && (
              <button
                className="rounded-xl border border-white/12 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                  />
                  Creating...
                </>
              ) : (
                <>
                  Create workspace
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M4 10h12m-5-5 5 5-5 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
