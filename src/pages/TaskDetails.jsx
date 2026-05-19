import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon, CheckSquareIcon, PaperclipIcon, PlusIcon, FileTextIcon, ImageIcon } from "lucide-react";
import { assets } from "../assets/assets";
import { updateTask } from "../features/workspaceSlice";

const TaskDetails = () => {

    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");

    const user = { id: 'user_1' };
    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const { currentWorkspace } = useSelector((state) => state.workspace);

    const fetchComments = () => {
        if (!projectId || !taskId || !currentWorkspace) return;
        const proj = currentWorkspace.projects?.find((p) => p.id === projectId);
        const tsk = proj?.tasks?.find((t) => t.id === taskId);
        if (tsk) {
            setComments(tsk.comments || []);
        }
    };

    const fetchTaskDetails = async () => {
        setLoading(true);
        if (!projectId || !taskId) return;

        const proj = currentWorkspace.projects.find((p) => p.id === projectId);
        if (!proj) return;

        const tsk = proj.tasks.find((t) => t.id === taskId);
        if (!tsk) return;

        setTask(tsk);
        setProject(proj);
        setComments(tsk.comments || []);
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            toast.loading("Adding comment...");
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newCommentObj = {
                id: `comment_${Math.random().toString(36).substr(2, 9)}`,
                user: { id: "user_1", name: "Alex Smith", image: assets.profile_img_a },
                content: newComment,
                createdAt: new Date().toISOString()
            };
            
            const updatedTask = {
                ...task,
                comments: [...(task.comments || []), newCommentObj]
            };

            dispatch(updateTask(updatedTask));
            setTask(updatedTask);
            setComments(updatedTask.comments);
            setNewComment("");
            toast.dismissAll();
            toast.success("Comment added.");
        } catch (error) {
            toast.dismissAll();
            toast.error(error.message);
            console.error(error);
        }
    };

    const handleAddSubtask = (title) => {
        if (!title.trim()) return;
        const newSubtask = { id: Date.now().toString(), title, completed: false };
        const updatedTask = {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask]
        };
        dispatch(updateTask(updatedTask));
        setTask(updatedTask);
    };

    const toggleSubtask = (subtaskId) => {
        const updatedTask = {
            ...task,
            subtasks: task.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
        dispatch(updateTask(updatedTask));
        setTask(updatedTask);
    };
    
    const handleQuickAction = (field, value) => {
        const updatedTask = { ...task, [field]: value };
        dispatch(updateTask(updatedTask));
        setTask(updatedTask);
        toast.success(`Task ${field} updated successfully`);
    };

    useEffect(() => { fetchTaskDetails(); }, [taskId]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments();
            const interval = setInterval(() => { fetchComments(); }, 10000);
            return () => clearInterval(interval);
        }
    }, [taskId, task]);

    if (loading) {
        return (
            <div className="flex flex-col-reverse lg:flex-row gap-6 p-4 max-w-6xl mx-auto animate-pulse w-full">
                <div className="w-full lg:w-2/3 h-[600px] bg-zinc-200 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-800"></div>
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="h-[250px] bg-zinc-200 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-800"></div>
                    <div className="h-[180px] bg-zinc-200 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-800"></div>
                </div>
            </div>
        );
    }
    if (!task) return <div className="text-red-500 px-4 py-6">Task not found.</div>;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900 dark:text-zinc-100 max-w-6xl mx-auto">
            {/* Left: Comments / Chatbox */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                <div className="p-5 rounded-md border border-gray-300 dark:border-zinc-800 flex flex-col lg:h-[80vh]">
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                        <MessageCircle className="size-5" /> Task Discussion ({comments.length})
                    </h2>

                    <div className="flex-1 md:overflow-y-scroll no-scrollbar">
                        {comments.length > 0 ? (
                            <div className="flex flex-col gap-4 mb-6 mr-2">
                                {comments.map((comment) => (
                                    <div key={comment.id} className={`sm:max-w-4/5 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border border-gray-300 dark:border-zinc-700 p-3 rounded-md ${comment.user.id === user?.id ? "ml-auto" : "mr-auto"}`} >
                                        <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-zinc-400">
                                            <img src={comment.user.image} alt="avatar" className="size-5 rounded-full" />
                                            <span className="font-medium text-gray-900 dark:text-white">{comment.user.name}</span>
                                            <span className="text-xs text-gray-400 dark:text-zinc-600">
                                                • {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-zinc-200">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-zinc-500 mb-4 text-sm">No comments yet. Be the first!</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md p-2 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
                            rows={3}
                        />
                        <button onClick={handleAddComment} className="bg-gradient-to-l from-blue-500 to-blue-600 transition-colors text-white text-sm px-5 py-2 rounded" >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Task + Project Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* Task Info */}
                <div className="p-5 rounded-md bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800">
                    <div className="mb-3">
                        <h1 className="text-lg font-medium text-gray-900 dark:text-zinc-100">{task.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <select value={task.status} onChange={(e) => handleQuickAction('status', e.target.value)} className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 text-xs font-medium outline-none cursor-pointer hover:border-blue-400 transition-colors">
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                            <select value={task.priority} onChange={(e) => handleQuickAction('priority', e.target.value)} className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 text-xs font-medium outline-none cursor-pointer hover:border-blue-400 transition-colors">
                                <option value="LOW">Low Priority</option>
                                <option value="MEDIUM">Medium Priority</option>
                                <option value="HIGH">High Priority</option>
                            </select>
                            <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-xs font-medium uppercase">
                                {task.type}
                            </span>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">{task.description}</p>
                    )}

                    <hr className="border-zinc-200 dark:border-zinc-700 my-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-zinc-300 mb-2">
                        <div>
                            <span className="block text-xs text-zinc-500 mb-1">Assignee</span>
                            <div className="flex items-center gap-2 font-medium">
                                {task.assignee?.image ? (
                                    <img src={task.assignee.image} className="size-6 rounded-full" alt="avatar" />
                                ) : (
                                    <div className="size-6 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                                )}
                                {task.assignee?.name || "Unassigned"}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs text-zinc-500 mb-1">Due Date</span>
                            <div className="flex items-center gap-2 font-medium">
                                <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-400" />
                                {format(new Date(task.due_date), "dd MMM yyyy")}
                            </div>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
                            <CheckSquareIcon className="size-4 text-blue-500" /> Subtasks
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                            {(task.subtasks || []).map(st => (
                                <div key={st.id} className="flex items-start gap-2.5 group">
                                    <input type="checkbox" checked={st.completed} onChange={() => toggleSubtask(st.id)} className="size-4 mt-0.5 accent-blue-600 rounded cursor-pointer" />
                                    <span className={`text-sm transition-colors ${st.completed ? 'line-through text-gray-400 dark:text-zinc-500' : 'text-gray-700 dark:text-zinc-200 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{st.title}</span>
                                </div>
                            ))}
                            {(!task.subtasks || task.subtasks.length === 0) && (
                                <p className="text-xs text-gray-500 dark:text-zinc-500 italic px-1">No subtasks added yet.</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input type="text" id="subtaskInput" placeholder="Add new subtask..." className="flex-1 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors" onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddSubtask(e.target.value);
                                    e.target.value = '';
                                }
                            }} />
                            <button onClick={() => {
                                const input = document.getElementById('subtaskInput');
                                handleAddSubtask(input.value);
                                input.value = '';
                            }} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-4 py-1.5 rounded text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium">Add</button>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                                <PaperclipIcon className="size-4 text-blue-500" /> Attachments
                            </h3>
                            <button className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                                <PlusIcon className="size-3" /> Add File
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded-md p-2.5 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group">
                                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2.5 rounded-md group-hover:scale-105 transition-transform">
                                    <FileTextIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-zinc-200 truncate">requirements_v2.pdf</p>
                                    <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5">2.4 MB • 2 days ago</p>
                                </div>
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded-md p-2.5 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2.5 rounded-md group-hover:scale-105 transition-transform">
                                    <ImageIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-zinc-200 truncate">mockup_design.png</p>
                                    <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5">850 KB • 1 week ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="p-5 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-800">
                        <p className="text-sm font-semibold mb-4 text-gray-900 dark:text-white uppercase tracking-wider">Project Reference</p>
                        <h2 className="text-gray-900 dark:text-zinc-100 flex items-center gap-2 font-medium">
                            <PenIcon className="size-4 text-blue-500" /> {project.name}
                        </h2>
                        <div className="flex flex-col gap-2 mt-4 text-sm">
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="text-zinc-500">Start Date</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-200">{format(new Date(project.start_date), "dd MMM yyyy")}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="text-zinc-500">Status</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-200">{project.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="text-zinc-500">Priority</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-200">{project.priority}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-zinc-500">Progress</span>
                                <div className="flex items-center gap-2 w-32">
                                    <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <span className="font-medium text-xs text-zinc-900 dark:text-zinc-200">{project.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
