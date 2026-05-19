import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StatsGrid() {
    const currentWorkspace = useSelector(
        (state) => state?.workspace?.currentWorkspace || null
    );

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        myTasks: 0,
        overdueIssues: 0,
    });

    const statCards = [
        {
            icon: FolderOpen,
            title: "Total Projects",
            value: stats.totalProjects,
            subtitle: `projects in ${currentWorkspace?.name}`,
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            icon: CheckCircle,
            title: "Completed Projects",
            value: stats.completedProjects,
            subtitle: `of ${stats.totalProjects} total`,
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-500",
        },
        {
            icon: Users,
            title: "My Tasks",
            value: stats.myTasks,
            subtitle: "assigned to me",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
        {
            icon: AlertTriangle,
            title: "Overdue",
            value: stats.overdueIssues,
            subtitle: "need attention",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
        },
    ];

    useEffect(() => {
        if (currentWorkspace && currentWorkspace.projects) {
            setStats({
                totalProjects: currentWorkspace.projects.length,
                activeProjects: currentWorkspace.projects.filter(
                    (p) => p.status !== "CANCELLED" && p.status !== "COMPLETED"
                ).length,
                completedProjects: currentWorkspace.projects
                    .filter((p) => p.status === "COMPLETED")
                    .reduce((acc, project) => acc + (project.tasks?.length || 0), 0),
                myTasks: currentWorkspace.projects.reduce(
                    (acc, project) =>
                        acc +
                        (project.tasks || []).filter(
                            (t) => t.assignee?.email === currentWorkspace.owner?.email
                        ).length,
                    0
                ),
                overdueIssues: currentWorkspace.projects.reduce(
                    (acc, project) =>
                        acc + (project.tasks || []).filter((t) => t.due_date && new Date(t.due_date) < new Date()).length,
                    0
                ),
            });
        }
    }, [currentWorkspace]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
            {statCards.map(
                ({ icon: Icon, title, value, subtitle, bgColor, textColor }, i) => (
                    <div key={i} className="group bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/60 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 rounded-2xl overflow-hidden relative" >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-current" />
                        <div className="p-6">
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 transition-colors group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                                        {title}
                                    </p>
                                    <p className="text-4xl font-bold text-zinc-800 dark:text-white tracking-tight">
                                        {value}
                                    </p>
                                    {subtitle && (
                                        <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-2 uppercase tracking-wider">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3.5 rounded-2xl ${bgColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner`}>
                                    <Icon size={24} className={textColor} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
