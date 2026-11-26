import TaskCard from "@repo/ui/taskCard";

const taskColumns = [
    {
        name: "TODO" as const,
        tasks: [
            {
                title: "Set up contact form",
                description: "Form with validation and a clear success state.",
                priority: "Low" as const,
                status: "Todo" as const,
                dueDate: "Nov 28",
                assigneeInitials: "SK",
            },
            {
                title: "Run accessibility checks",
                description: "Check colour contrast, focus order and screen reader labels.",
                priority: "Medium" as const,
                status: "Todo" as const,
                dueDate: "Dec 2",
            },
        ],
    },
    {
        name: "IN PROGRESS" as const,
        tasks: [
            {
                title: "Build responsive navigation",
                description: "Desktop menu and mobile drawer with accessible keyboard support.",
                priority: "High" as const,
                status: "In Progress" as const,
                dueDate: "Nov 22",
                assigneeInitials: "PN",
                commentCount: 1,
            },
            {
                title: "Write pricing page copy",
                description: "Draft plan descriptions, feature lists and FAQs.",
                priority: "Medium" as const,
                status: "In Progress" as const,
                dueDate: "Nov 24",
                assigneeInitials: "AI",
            },
        ],
    },
    {
        name: "DONE" as const,
        tasks: [
            {
                title: "Audit existing site content",
                description: "Review every page and list what to keep, rewrite or remove.",
                priority: "Medium" as const,
                status: "Done" as const,
                dueDate: "Nov 10",
                assigneeInitials: "PN",
            },
            {
                title: "Create new sitemap",
                description: "Define the page structure and navigation for the new website.",
                priority: "Medium" as const,
                status: "Done" as const,
                dueDate: "Nov 12",
                assigneeInitials: "AI",
            },
            {
                title: "Design homepage layout",
                description: "Wireframes and high-fidelity mockups for the new homepage.",
                priority: "High" as const,
                status: "Done" as const,
                dueDate: "Nov 16",
                assigneeInitials: "AS",
                commentCount: 2,
            },
        ],
    },
];

export default function KanbanBoard() {
    return (
        <section className="h-full overflow-y-auto p-4 text-white sm:p-5" aria-label="Project tasks">
            <nav aria-label="Breadcrumb" className="mb-2 text-[10px] text-[#8a8a8a]">
                Projects <span className="mx-1">/</span> <span className="text-[#b8b8b8]">Website redesign</span>
            </nav>
            <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-semibold">Website redesign</h1>
                        <span className="rounded-full bg-emerald-950/70 px-2 py-0.5 text-[9px] text-emerald-400">Active</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#a3a3a3]">
                        Redesign the marketing website with a cleaner look and faster pages.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5" aria-label="4 project members">
                        {["SK", "AS", "PN", "AI"].map((initials, index) => (
                            <span
                                key={initials}
                                className={`flex h-6 w-6 items-center justify-center rounded-full border border-[#080808] text-[8px] font-medium ${
                                    index % 2 === 0 ? "bg-cyan-950 text-cyan-300" : "bg-amber-950 text-amber-300"
                                }`}
                                aria-label={initials}
                            >
                                {initials}
                            </span>
                        ))}
                    </div>
                    <span className="hidden text-[9px] text-[#a3a3a3] sm:inline">4 members</span>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-md bg-[#7057ef] px-3 py-2 text-[10px] font-medium hover:bg-[#806af4]"
                    >
                        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Add Task
                    </button>
                </div>
            </header>

            <div className="grid min-w-[42rem] grid-cols-3 gap-3">
                {taskColumns.map((column) => (
                    <section key={column.name} className="min-w-0 rounded-md border border-[#222] bg-[#090909] p-2.5" aria-label={column.name}>
                        <header className="mb-2 flex items-center justify-between">
                            <h2 className="text-[10px] font-semibold tracking-wide">{column.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#242424] px-1 text-[8px] text-[#c4c4c4]">
                                    {column.tasks.length}
                                </span>
                                <button type="button" aria-label={`Add task to ${column.name}`} className="text-sm leading-none text-[#a3a3a3] hover:text-white">
                                    +
                                </button>
                            </div>
                        </header>
                        <div className="flex flex-col gap-2">
                            {column.tasks.map((task) => (
                                <TaskCard key={task.title} {...task} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </section>
    );
}