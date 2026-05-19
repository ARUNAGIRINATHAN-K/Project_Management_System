import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

// --- THUNKS ---

export const fetchWorkspaces = createAsyncThunk(
    "workspace/fetchWorkspaces",
    async () => {
        const response = await fetch(`${API_URL}/workspaces`);
        if (!response.ok) throw new Error("Failed to fetch workspaces");
        return response.json();
    }
);

export const addProjectAsync = createAsyncThunk(
    "workspace/addProject",
    async (projectData) => {
        const response = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectData),
        });
        if (!response.ok) throw new Error("Failed to add project");
        return response.json();
    }
);

export const addTaskAsync = createAsyncThunk(
    "workspace/addTask",
    async (taskData) => {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to add task");
        return response.json();
    }
);

export const updateWorkspaceAsync = createAsyncThunk(
    "workspace/updateWorkspace",
    async ({ id, name, description }) => {
        const response = await fetch(`${API_URL}/workspaces/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description }),
        });
        if (!response.ok) throw new Error("Failed to update workspace");
        return response.json();
    }
);

export const updateProjectAsync = createAsyncThunk(
    "workspace/updateProject",
    async (projectData) => {
        const response = await fetch(`${API_URL}/projects/${projectData.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectData),
        });
        if (!response.ok) throw new Error("Failed to update project");
        return response.json();
    }
);

export const updateTaskAsync = createAsyncThunk(
    "workspace/updateTask",
    async (taskData) => {
        const response = await fetch(`${API_URL}/tasks/${taskData.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to update task");
        return response.json();
    }
);

export const deleteTaskAsync = createAsyncThunk(
    "workspace/deleteTask",
    async (id) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete task");
        return id;
    }
);


// --- SLICE ---

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            localStorage.setItem("currentWorkspaceId", action.payload);
            state.currentWorkspace = state.workspaces.find((w) => w.id === action.payload) || null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Workspaces
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
                
                // Set current workspace if one was saved, or default to first
                const savedId = localStorage.getItem("currentWorkspaceId");
                state.currentWorkspace = action.payload.find((w) => w.id === savedId) || action.payload[0] || null;
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Add Project
            .addCase(addProjectAsync.fulfilled, (state, action) => {
                const project = action.payload;
                // Add project to current workspace
                if (state.currentWorkspace && state.currentWorkspace.id === project.workspaceId) {
                    // Initialize tasks array for new project
                    project.tasks = []; 
                    state.currentWorkspace.projects.push(project);
                }
                const workspace = state.workspaces.find(w => w.id === project.workspaceId);
                if (workspace) {
                    project.tasks = [];
                    workspace.projects.push(project);
                }
            })
            
            // Add Task
            .addCase(addTaskAsync.fulfilled, (state, action) => {
                const task = action.payload;
                if (state.currentWorkspace) {
                    const project = state.currentWorkspace.projects.find(p => p.id === task.projectId);
                    if (project) {
                        if (!project.tasks) project.tasks = [];
                        project.tasks.push(task);
                    }
                }
                for (let w of state.workspaces) {
                    const project = w.projects.find(p => p.id === task.projectId);
                    if (project) {
                        if (!project.tasks) project.tasks = [];
                        project.tasks.push(task);
                    }
                }
            })

            // Update Workspace
            .addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
                const updatedWorkspace = action.payload;
                state.workspaces = state.workspaces.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w);
                if (state.currentWorkspace && state.currentWorkspace.id === updatedWorkspace.id) {
                    state.currentWorkspace = updatedWorkspace;
                }
            })

            // Update Project
            .addCase(updateProjectAsync.fulfilled, (state, action) => {
                const project = action.payload;
                if (state.currentWorkspace && state.currentWorkspace.id === project.workspaceId) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects.map(p => p.id === project.id ? { ...p, ...project } : p);
                }
                const workspace = state.workspaces.find(w => w.id === project.workspaceId);
                if (workspace) {
                    workspace.projects = workspace.projects.map(p => p.id === project.id ? { ...p, ...project } : p);
                }
            })

            // Update Task
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const task = action.payload;
                if (state.currentWorkspace) {
                    const project = state.currentWorkspace.projects.find(p => p.id === task.projectId);
                    if (project) {
                        project.tasks = project.tasks.map(t => t.id === task.id ? task : t);
                    }
                }
                for (let w of state.workspaces) {
                    const project = w.projects.find(p => p.id === task.projectId);
                    if (project) {
                        project.tasks = project.tasks.map(t => t.id === task.id ? task : t);
                    }
                }
            })

            // Delete Task
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                const taskId = action.payload;
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects.forEach(project => {
                        if (project.tasks) {
                            project.tasks = project.tasks.filter(t => t.id !== taskId);
                        }
                    });
                }
                state.workspaces.forEach(w => {
                    w.projects.forEach(project => {
                        if (project.tasks) {
                            project.tasks = project.tasks.filter(t => t.id !== taskId);
                        }
                    });
                });
            });
    },
});

export const { setCurrentWorkspace } = workspaceSlice.actions;
export {
    updateWorkspaceAsync as updateWorkspace,
    updateProjectAsync as updateProject,
    updateTaskAsync as updateTask,
    deleteTaskAsync as deleteTask,
};
export default workspaceSlice.reducer;