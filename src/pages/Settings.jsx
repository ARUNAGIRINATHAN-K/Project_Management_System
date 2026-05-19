import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Settings, Users, Save, Shield, AlertTriangle } from "lucide-react";
import { updateWorkspace } from "../features/workspaceSlice";
import toast from "react-hot-toast";

const SettingsPage = () => {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentWorkspace) {
            setFormData({
                name: currentWorkspace.name || "",
                description: currentWorkspace.description || "",
            });
        }
    }, [currentWorkspace]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentWorkspace) return;

        setIsSubmitting(true);
        try {
            await dispatch(updateWorkspace({
                id: currentWorkspace.id,
                name: formData.name,
                description: formData.description,
            })).unwrap();
            toast.success("Workspace updated successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to update workspace");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
                <AlertTriangle className="size-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No Workspace Loaded</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Please select or seed a workspace to configure settings.</p>
            </div>
        );
    }

    const cardClasses = "rounded-xl border p-6 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm";
    const labelClasses = "text-sm font-medium text-zinc-700 dark:text-zinc-300";
    const inputClasses = "w-full px-3 py-2 rounded-lg border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Settings className="size-6 text-zinc-700 dark:text-zinc-300" /> Workspace Settings
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                    Manage your current workspace configuration and view members
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* General Settings Form */}
                <div className={`${cardClasses} md:col-span-2 space-y-4`}>
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-2">General Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className={labelClasses}>Workspace Name</label>
                            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClasses} required placeholder="Workspace Name" />
                        </div>

                        <div className="space-y-1">
                            <label className={labelClasses}>Description</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClasses} h-28 resize-none`} placeholder="Describe this workspace..." />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white px-5 py-2 rounded-lg text-sm transition" >
                                <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Workspace"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Workspace Members Quick Info */}
                <div className={`${cardClasses} space-y-4`}>
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2 mb-2">
                        <Users className="size-5 text-zinc-500 dark:text-zinc-400" /> Members
                    </h2>
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-72 overflow-y-auto pr-1">
                        {(currentWorkspace.members || []).map((member, idx) => (
                            <div key={idx} className="py-3 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 truncate">
                                    <img src={member?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"} alt="Avatar" className="size-7 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="truncate">
                                        <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">{member?.user?.name || "Unknown Member"}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{member?.user?.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 shrink-0 ${member.role === "ADMIN" ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"}`} >
                                    {member.role === "ADMIN" && <Shield className="size-3" />}
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
