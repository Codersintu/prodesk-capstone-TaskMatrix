"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  ProjectModelFormInput,
  projectModelInput,
  projectModelSchema,
} from "../../../../lib/CreateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Arrright from "../../Icon/Arrright";
import Crossline from "../../Icon/Crossline";
import FolderIcon from "../../Icon/FolderIcon";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMember } from "../../../../lib/http/client";

type CreateprojectModelProps = {
  workspaceId: string;
  onClose?: () => void;
};
export default function CreateprojectModel({
  workspaceId,
  onClose,
}: CreateprojectModelProps) {
    
  const methods = useForm<ProjectModelFormInput, unknown, projectModelInput>({
    resolver: zodResolver(projectModelSchema),
    defaultValues:{
      projectMemberIds: []
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;


  const {data} = useQuery({
    queryKey: ["workspaceMember", workspaceId],
    queryFn: getWorkspaceMember,
  });
  const currentWorkspace= data?.find((workspace)=> workspace.id === workspaceId);


  const onsubmitProject: SubmitHandler<projectModelInput> = async (values) => {
    try {
      const response = await fetch("/api/auth/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspaceId,
          name: values.name,
          status: "ACTIVE",
          projectMemberIds: values.projectMemberIds ?? [],
          description: values.description,
          deadline: values.deadline
            ? new Date(`${values.deadline}T00:00:00.000Z`).toISOString()
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = result?.message ?? "Unable to create your project.";
        toast.error(message);
        return;
      }

      toast.success("project created successfully");
      onClose?.();
    } catch (error) {
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
              <Crossline />
            </button>
          )}

          <div className="flex items-start gap-4 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <FolderIcon />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Start collaborating
              </p>
              <h2
                className="mt-1 text-2xl font-semibold tracking-tight"
                id="create-workspace-title"
              >
                Create a project
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
                Bring your projects and people together in one place.
              </p>
            </div>
          </div>
        </div>

        <form
          className="relative space-y-5 px-6 py-6 sm:px-8"
          onSubmit={handleSubmit(onsubmitProject)}
        >
          <div>
            <label
              className="mb-2 block text-sm font-medium text-white/85"
              htmlFor="workspace-name"
            >
              Project name <span className="text-violet-300">*</span>
            </label>
            <input
              autoFocus
              autoComplete="organization"
              id="project-name"
              placeholder="e.g. Product team"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "project-name-error" : "project-name-hint"
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
           
           {currentWorkspace?.memberships.filter((membership)=> membership.status === "ACTIVE").map((membership)=>(

            <label
              key={membership.user.id}
              className="mb-2 block text-sm font-medium text-white/85"
              htmlFor="workspace-name"
            >
              <input type="checkbox" 
              value={membership.user.id}
              {...register("projectMemberIds")}
              />
              <span>{membership.user.name ?? membership.user.email}</span>
            </label>
          
          ))}

          <div>
            <label
              htmlFor="project-deadline"
              className="mb-2 block text-sm font-medium text-white/85"
            >
              Deadline{" "}
              <span className="font-normal text-white/40">Optional</span>
            </label>
            <div className="relative">
              <input
                id="project-deadline"
                type="date"
                aria-invalid={Boolean(errors.deadline)}
                aria-describedby={
                  errors.deadline
                    ? "project-deadline-error"
                    : "project-deadline-hint"
                }
                className="w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10 scheme-dark [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70"
                {...register("deadline")}
              />
              <p
                className="mt-2 text-xs text-white/40"
                id="project-deadline-hint"
              >
                Choose a date from the calendar, or leave this blank.
              </p>
              {errors.deadline && (
                <p
                  className="mt-2 text-xs text-rose-300"
                  id="project-deadline-error"
                >
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-white/85"
              htmlFor="project-description"
            >
              Description{" "}
              <span className="font-normal text-white/40">Optional</span>
            </label>
            <textarea
              id="project-description"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
                  Create project
                  <Arrright />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
