import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Trash, XIcon, Zap, LayoutList, LayoutGrid } from "lucide-react";

const typeIcons = {
    BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
    IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
    OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
    LOW: { background: "bg-red-100 dark:bg-red-950", prioritycolor: "text-red-600 dark:text-red-400" },
    MEDIUM: { background: "bg-blue-100 dark:bg-blue-950", prioritycolor: "text-blue-600 dark:text-blue-400" },
    HIGH: { background: "bg-emerald-100 dark:bg-emerald-950", prioritycolor: "text-emerald-600 dark:text-emerald-400" },
};

const ProjectTasks = ({ tasks }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [viewMode, setViewMode] = useState("LIST");

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () => Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, tasks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            toast.loading("Updating status...");
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            let updatedTask = structuredClone(tasks.find((t) => t.id === taskId));
            updatedTask.status = newStatus;
            dispatch(updateTask(updatedTask));

            toast.dismissAll();
        } catch (error) {
            toast.dismissAll();
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete the selected tasks?");
            if (!confirm) return;
            toast.loading("Deleting tasks...");
            await new Promise((resolve) => setTimeout(resolve, 500));
            dispatch(deleteTask(selectedTasks));
            toast.dismissAll();
            toast.success("Tasks deleted successfully");
        } catch (error) {
            toast.dismissAll();
            toast.error(error.message);
        }
    };

    const onDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            const task = tasks.find((t) => t.id === taskId);
            if (task && task.status !== newStatus) {
                await handleStatusChange(taskId, newStatus);
            }
        }
    };

    const KanbanCard = ({ task }) => {
        const { icon: Icon, color } = typeIcons[task.type] || {};
        const { background, prioritycolor } = priorityTexts[task.priority] || {};

        return (
            <div draggable onDragStart={(e) => onDragStart(e, task.id)} onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-2">{task.title}</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                    {Icon && <span className={`flex items-center gap-1 text-[10px] uppercase font-medium ${color}`}><Icon className="size-3"/> {task.type}</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${background} ${prioritycolor}`}>{task.priority}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                        {task.assignee?.image ? <img src={task.assignee?.image} className="size-4 rounded-full" /> : <div className="size-4 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>}
                        {task.assignee?.name || "Unassigned"}
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="size-3"/> {format(new Date(task.due_date), "MMM d")}
                    </div>
                </div>
            </div>
        );
    };

    const kanbanColumns = [
        { id: "TODO", title: "To Do" },
        { id: "IN_PROGRESS", title: "In Progress" },
        { id: "DONE", title: "Done" },
    ];

    return (
        <div>
            {/* Filters & View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    {["status", "type", "priority", "assignee"].map((name) => {
                        const options = {
                            status: [
                                { label: "All Statuses", value: "" },
                                { label: "To Do", value: "TODO" },
                                { label: "In Progress", value: "IN_PROGRESS" },
                                { label: "Done", value: "DONE" },
                            ],
                            type: [
                                { label: "All Types", value: "" },
                                { label: "Task", value: "TASK" },
                                { label: "Bug", value: "BUG" },
                                { label: "Feature", value: "FEATURE" },
                                { label: "Improvement", value: "IMPROVEMENT" },
                                { label: "Other", value: "OTHER" },
                            ],
                            priority: [
                                { label: "All Priorities", value: "" },
                                { label: "Low", value: "LOW" },
                                { label: "Medium", value: "MEDIUM" },
                                { label: "High", value: "HIGH" },
                            ],
                            assignee: [
                                { label: "All Assignees", value: "" },
                                ...assigneeList.map((n) => ({ label: n, value: n })),
                            ],
                        };
                        return (
                            <select key={name} name={name} onChange={handleFilterChange} className="border bg-transparent border-zinc-300 dark:border-zinc-800 outline-none px-3 py-1.5 rounded text-sm text-zinc-900 dark:text-zinc-200" >
                                {options[name].map((opt, idx) => (
                                    <option key={idx} value={opt.value} className="bg-white dark:bg-zinc-900">{opt.label}</option>
                                ))}
                            </select>
                        );
                    })}
                    
                    {(filters.status || filters.type || filters.priority || filters.assignee) && (
                        <button type="button" onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })} className="px-3 py-1.5 flex items-center gap-2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors" >
                            <XIcon className="size-3" /> Reset
                        </button>
                    )}
                </div>

                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-md shrink-0">
                    <button onClick={() => setViewMode("LIST")} className={`p-1.5 rounded text-sm flex items-center justify-center transition-colors ${viewMode === "LIST" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`} title="List View">
                        <LayoutList className="size-4" />
                    </button>
                    <button onClick={() => setViewMode("KANBAN")} className={`p-1.5 rounded text-sm flex items-center justify-center transition-colors ${viewMode === "KANBAN" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`} title="Board View">
                        <LayoutGrid className="size-4" />
                    </button>
                </div>
            </div>

            {selectedTasks.length > 0 && viewMode === "LIST" && (
                <div className="mb-4">
                    <button type="button" onClick={handleDelete} className="px-3 py-1 flex items-center gap-2 rounded bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 text-sm transition-colors" >
                        <Trash className="size-3" /> Delete Selected ({selectedTasks.length})
                    </button>
                </div>
            )}

            {/* Kanban View */}
            {viewMode === "KANBAN" ? (
                <div className="flex overflow-x-auto gap-6 pb-6 min-h-[500px]">
                    {kanbanColumns.map((col) => (
                        <div key={col.id} className="flex flex-col bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 min-w-[320px] max-w-[320px] flex-shrink-0" onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.id)}>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{col.title}</h3>
                                <span className="text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-xs font-medium">{filteredTasks.filter(t => t.status === col.id).length}</span>
                            </div>
                            <div className="flex flex-col gap-3 min-h-[100px]">
                                {filteredTasks.filter(t => t.status === col.id).map(task => (
                                    <KanbanCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="overflow-auto rounded-lg lg:border border-zinc-300 dark:border-zinc-800">
                    <div className="w-full">
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full text-sm text-left not-dark:bg-white text-zinc-900 dark:text-zinc-300">
                                <thead className="text-xs uppercase dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                                    <tr>
                                        <th className="pl-4 pr-1 py-3">
                                            <input onChange={() => selectedTasks.length > 0 ? setSelectedTasks([]) : setSelectedTasks(tasks.map((t) => t.id))} checked={selectedTasks.length > 0 && selectedTasks.length === tasks.length} type="checkbox" className="size-3 accent-zinc-600 dark:accent-zinc-500" />
                                        </th>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Priority</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Assignee</th>
                                        <th className="px-4 py-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task) => {
                                            const { icon: Icon, color } = typeIcons[task.type] || {};
                                            const { background, prioritycolor } = priorityTexts[task.priority] || {};

                                            return (
                                                <tr key={task.id} onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer" >
                                                    <td onClick={e => e.stopPropagation()} className="pl-4 pr-1 py-3">
                                                        <input type="checkbox" className="size-3 accent-zinc-600 dark:accent-zinc-500" onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id)) : setSelectedTasks((prev) => [...prev, task.id])} checked={selectedTasks.includes(task.id)} />
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">{task.title}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {Icon && <Icon className={`size-4 ${color}`} />}
                                                            <span className={`text-xs font-medium ${color}`}>{task.type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-xs px-2 py-1 rounded font-medium ${background} ${prioritycolor}`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td onClick={e => e.stopPropagation()} className="px-4 py-3">
                                                        <select name="status" onChange={(e) => handleStatusChange(task.id, e.target.value)} value={task.status} className="bg-transparent border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 outline-none px-2 pr-4 py-1 rounded text-xs font-medium text-zinc-900 dark:text-zinc-200 cursor-pointer" >
                                                            <option value="TODO" className="bg-white dark:bg-zinc-900">To Do</option>
                                                            <option value="IN_PROGRESS" className="bg-white dark:bg-zinc-900">In Progress</option>
                                                            <option value="DONE" className="bg-white dark:bg-zinc-900">Done</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {task.assignee?.image ? <img src={task.assignee.image} className="size-6 rounded-full" alt="avatar" /> : <div className="size-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>}
                                                            {task.assignee?.name || "Unassigned"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                                            <CalendarIcon className="size-4" />
                                                            {format(new Date(task.due_date), "MMM d")}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                                                No tasks found for the selected filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile/Card View */}
                        <div className="lg:hidden flex flex-col gap-4">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => {
                                    const { icon: Icon, color } = typeIcons[task.type] || {};
                                    const { background, prioritycolor } = priorityTexts[task.priority] || {};

                                    return (
                                        <div key={task.id} className="dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col gap-3 shadow-sm">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-zinc-900 dark:text-zinc-200 text-sm font-semibold pr-4">{task.title}</h3>
                                                <input type="checkbox" className="size-4 accent-zinc-600 dark:accent-zinc-500 mt-1" onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id)) : setSelectedTasks((prev) => [...prev, task.id])} checked={selectedTasks.includes(task.id)} />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-xs flex items-center gap-1 font-medium">
                                                    {Icon && <Icon className={`size-3 ${color}`} />}
                                                    <span className={`${color} uppercase`}>{task.type}</span>
                                                </div>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${background} ${prioritycolor}`}>
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <div>
                                                <select name="status" onChange={(e) => handleStatusChange(task.id, e.target.value)} value={task.status} className="w-full mt-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none px-2 py-1.5 rounded text-sm text-zinc-900 dark:text-zinc-200" >
                                                    <option value="TODO">To Do</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="DONE">Done</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/50 mt-1">
                                                <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                                                    {task.assignee?.image ? <img src={task.assignee?.image} className="size-5 rounded-full" alt="avatar" /> : <div className="size-5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>}
                                                    {task.assignee?.name || "Unassigned"}
                                                </div>

                                                <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                                    <CalendarIcon className="size-3.5" />
                                                    {format(new Date(task.due_date), "MMM d")}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-zinc-500 dark:text-zinc-400 py-6">
                                    No tasks found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTasks;
