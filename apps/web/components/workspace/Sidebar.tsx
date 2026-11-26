"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import ProjectIcon from "./Icon/ProjectIcon";
import TaskIcon from "./Icon/TaskIcon";
import Overview from "./Icon/OverviewIcon";
import MemberIcon from "./Icon/MemberIcon";
import InvitationIcon from "./Icon/InvitationIcon";

export type WorkspaceView = "overview" | "tasks" | "projects" | "members" | "Invite";

type SidebarProps = {
  activeView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
};

type NavItemProps = {
  label: string;
  view: WorkspaceView;
  activeView: WorkspaceView;
  expanded: boolean;
  onViewChange: (view: WorkspaceView) => void;
  icon: ReactNode;
};

function NavItem({
  label,
  view,
  activeView,
  expanded,
  onViewChange,
  icon,
}: NavItemProps) {
  const active = activeView === view;

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onViewChange(view)}
      className={`flex h-10 w-full items-center rounded-lg transition-colors ${
        active
          ? "bg-[#272727] text-white"
          : "text-[#b8b8b8] hover:bg-[#181818] hover:text-white"
      }`}
    >
      <span className="flex h-10 w-12 shrink-0 items-center justify-center">
        {icon}
      </span>
      <motion.span
        initial={false}
        animate={{
          opacity: expanded ? 1 : 0,
          width: expanded ? "auto" : 0,
          x: expanded ? 0 : -8,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="overflow-hidden whitespace-nowrap pr-3 text-left"
      >
        {label}
      </motion.span>
    </button>
  );
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.aside
      animate={{ width: expanded ? 248 : 64 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="flex shrink-0 flex-col overflow-hidden rounded-r-xl border-r border-[#1d1d1d] bg-[#090909] py-3 text-[#e5e5e5]"
    >

      <nav
        aria-label="Workspace navigation"
        className="mt-4 flex flex-1 flex-col gap-1 px-2"
      >
        <NavItem
          label="Overview"
          view="overview"
          activeView={activeView}
          expanded={expanded}
          onViewChange={onViewChange}
          icon={<Overview/>}
        />

        <NavItem
          label="My tasks"
          view="tasks"
          activeView={activeView}
          expanded={expanded}
          onViewChange={onViewChange}
          icon={<TaskIcon/>}
        />
        <NavItem
          label="Members"
          view="members"
          activeView={activeView}
          expanded={expanded}
          onViewChange={onViewChange}
          icon={<MemberIcon/> }
        />

        <NavItem
         label="Invitation"
          view="Invite"
          activeView={activeView}
          expanded={expanded}
          onViewChange={onViewChange}
          icon={<InvitationIcon/>}
        />

          <NavItem
          label="Projects"
          view="projects"
          activeView={activeView}
          expanded={expanded}
          onViewChange={onViewChange}
          icon={<ProjectIcon/>}
        />
      </nav>

      <button
        type="button"
        className="flex h-10 w-full items-center rounded-lg text-[#b8b8b8] hover:bg-[#181818] hover:text-white"
      >
        <span className="flex h-10 w-12 shrink-0 items-center justify-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-5 w-5"
          >
            <path
              d="M8 2.8h4l.5 2a5.5 5.5 0 0 1 1.2.7l2-.6 2 3.4-1.5 1.4v1.4l1.5 1.4-2 3.4-2-.6a5.5 5.5 0 0 1-1.2.7l-.5 2H8l-.5-2a5.5 5.5 0 0 1-1.2-.7l-2 .6-2-3.4 1.5-1.4v-1.4L2.3 8.9l2-3.4 2 .6a5.5 5.5 0 0 1 1.2-.7l.5-2Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle
              cx="10"
              cy="10.4"
              r="2.2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="overflow-hidden whitespace-nowrap pr-3"
        >
          Settings
        </motion.span>
      </button>
    </motion.aside>
  );
}
