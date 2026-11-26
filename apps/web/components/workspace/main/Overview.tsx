import OverviewCard from "@repo/ui/overviewCard";
import ProjectCard from "./project/projectCard";

const overviewStats = [
    { label: "Total projects", value: "05" },
    { label: "Active tasks", value: "15" },
    { label: "In progress", value: "06" },
    { label: "Completed", value: "10" },
];

const recentProjects = [
    { name: "Website redesign", taskCount: 7, completedCount: 3, status: "Active" as const },
    { name: "Mobile application", taskCount: 6, completedCount: 1, status: "Active" as const },
    { name: "Backend API", taskCount: 6, completedCount: 2, status: "Active" as const },
    { name: "Marketing launch", taskCount: 3, completedCount: 1, status: "On hold" as const },
];

const recentActivity = [
    {
        initials: "AS",
        person: "Aarav Sharma",
        action: "moved",
        detail: "Design homepage layout to Done",
        time: "2h ago",
        avatar: "bg-amber-950 text-amber-300",
    },
    {
        initials: "PN",
        person: "Priya Nair",
        action: "commented on",
        detail: "Build responsive navigation",
        time: "4h ago",
        avatar: "bg-amber-950 text-amber-300",
    },
    {
        initials: "RM",
        person: "Rohan Mehta",
        action: "created task",
        detail: "Prepare TestFlight build",
        time: "Yesterday",
        avatar: "bg-cyan-950 text-cyan-300",
    },
    {
        initials: "SK",
        person: "Sintu Kumar",
        action: "invited",
        detail: "kabir@acmestudio.com to the workspace",
        time: "Yesterday",
        avatar: "bg-sky-950 text-sky-300",
    },
    {
        initials: "AI",
        person: "Ananya Iyer",
        action: "completed",
        detail: "Prepare press kit",
        time: "2 days ago",
        avatar: "bg-cyan-950 text-cyan-300",
    },
];

export default function Overview() {
    return (
        <section className="h-full overflow-y-auto p-5 text-white" aria-label="Workspace overview">
            <nav aria-label="Breadcrumb" className="mb-2 text-[10px] text-[#8a8a8a]">
                Workspace <span className="mx-1">/</span> <span className="text-[#b8b8b8]">Overview</span>
            </nav>

            <header className="mb-5">
                <h1 className="text-2xl font-semibold">Good morning, Sintu! 👋</h1>
                <p className="mt-1 text-[11px] text-[#a3a3a3]">Here&apos;s what&apos;s happening with your team.</p>
            </header>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {overviewStats.map((stat) => (
                    <OverviewCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,2fr)_minmax(12rem,1fr)]">
                <section aria-labelledby="recent-projects-heading">
                    <h2 id="recent-projects-heading" className="mb-2 text-xl font-semibold">Recent projects</h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {/* {recentProjects.map((project) => (
                            <ProjectCard key={project.name} {...project} />
                        ))} */}
                    </div>
                </section>

                <section aria-labelledby="recent-activity-heading">
                    <h2 id="recent-activity-heading" className="mb-2 text-sm font-semibold">Recent activity</h2>
                    <ul className="divide-y divide-[#1e1e1e] rounded-md border border-[#222] bg-[#0b0b0b] px-3">
                        {recentActivity.map((activity) => (
                            <li key={`${activity.initials}-${activity.time}`} className="flex gap-2.5 py-2.5">
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-medium ${activity.avatar}`}>
                                    {activity.initials}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[10px] leading-snug text-[#dedede]">
                                        <span className="font-medium text-white">{activity.person}</span>{" "}
                                        {activity.action} <span className="font-medium text-white">{activity.detail}</span>
                                    </p>
                                    <p className="mt-0.5 text-[9px] text-[#777]">{activity.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </section>
    );
}
