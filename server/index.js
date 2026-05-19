import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- DATA MAPPING HELPERS ---
function mapProjectToFrontend(project) {
    if (!project) return null;
    const mapped = {
        ...project,
        start_date: project.startDate,
        end_date: project.endDate,
        team_lead: project.teamLeadId,
    };
    delete mapped.startDate;
    delete mapped.endDate;
    delete mapped.teamLeadId;

    if (project.tasks) {
        mapped.tasks = project.tasks.map(mapTaskToFrontend);
    }
    return mapped;
}

function mapTaskToFrontend(task) {
    if (!task) return null;
    const mapped = {
        ...task,
        due_date: task.dueDate,
        estimated_hours: task.estimatedHours,
    };
    delete mapped.dueDate;
    delete mapped.estimatedHours;
    return mapped;
}

function mapWorkspaceToFrontend(workspace) {
    if (!workspace) return null;
    return {
        ...workspace,
        projects: workspace.projects ? workspace.projects.map(mapProjectToFrontend) : []
    };
}

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
    res.send('Project Management API is running! Visit /api/health for status.');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Project Management API is running' });
});

// --- SEED ---
app.post('/api/seed', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: 'admin@project.com',
                name: 'Admin User',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
            }
        });

        const workspace = await prisma.workspace.create({
            data: {
                name: 'My Startup Workspace',
                ownerId: user.id,
                members: {
                    create: { userId: user.id, role: 'ADMIN' }
                }
            },
            include: { 
                members: { include: { user: true } }, 
                projects: { include: { tasks: { include: { assignee: true } } } } 
            }
        });

        res.json({ message: 'Seeded successfully!', user, workspace: mapWorkspaceToFrontend(workspace) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- USERS ---
app.post('/api/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: req.body
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- WORKSPACES ---
app.post('/api/workspaces', async (req, res) => {
    try {
        const workspace = await prisma.workspace.create({
            data: {
                name: req.body.name,
                ownerId: req.body.ownerId,
                members: {
                    create: { userId: req.body.ownerId, role: 'ADMIN' }
                }
            },
            include: { 
                members: { include: { user: true } }, 
                projects: { include: { tasks: { include: { assignee: true } } } } 
            }
        });
        res.json(mapWorkspaceToFrontend(workspace));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/workspaces', async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            include: { 
                members: { include: { user: true } }, 
                projects: { include: { tasks: { include: { assignee: true } } } } 
            }
        });
        res.json(workspaces.map(mapWorkspaceToFrontend));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/workspaces/:id', async (req, res) => {
    try {
        const workspace = await prisma.workspace.findUnique({
            where: { id: req.params.id },
            include: { 
                members: { include: { user: true } }, 
                projects: { include: { tasks: { include: { assignee: true } } } } 
            }
        });
        res.json(mapWorkspaceToFrontend(workspace));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/workspaces/:id', async (req, res) => {
    try {
        const workspace = await prisma.workspace.update({
            where: { id: req.params.id },
            data: {
                name: req.body.name,
                description: req.body.description
            },
            include: { 
                members: { include: { user: true } }, 
                projects: { include: { tasks: { include: { assignee: true } } } } 
            }
        });
        res.json(mapWorkspaceToFrontend(workspace));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PROJECTS ---
app.post('/api/projects', async (req, res) => {
    try {
        const { start_date, end_date, team_lead, ...rest } = req.body;
        const project = await prisma.project.create({
            data: {
                ...rest,
                startDate: start_date ? new Date(start_date) : null,
                endDate: end_date ? new Date(end_date) : null,
                teamLeadId: team_lead || null
            },
            include: { tasks: true }
        });
        res.json(mapProjectToFrontend(project));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/projects/:id', async (req, res) => {
    try {
        const { start_date, end_date, team_lead, ...rest } = req.body;

        const data = { ...rest };
        if (start_date !== undefined) data.startDate = start_date ? new Date(start_date) : null;
        if (end_date !== undefined) data.endDate = end_date ? new Date(end_date) : null;
        if (team_lead !== undefined) data.teamLeadId = team_lead || null;

        // Prisma update requires ID, so let's exclude tasks if present
        delete data.tasks;
        delete data.id;

        const project = await prisma.project.update({
            where: { id: req.params.id },
            data,
            include: { tasks: true }
        });
        res.json(mapProjectToFrontend(project));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- TASKS ---
app.post('/api/tasks', async (req, res) => {
    try {
        const { due_date, estimated_hours, ...rest } = req.body;
        const task = await prisma.task.create({
            data: {
                ...rest,
                dueDate: due_date ? new Date(due_date) : null,
                estimatedHours: estimated_hours ? parseFloat(estimated_hours) : null
            },
            include: { assignee: true }
        });
        res.json(mapTaskToFrontend(task));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const { due_date, estimated_hours, ...rest } = req.body;
        
        const data = { ...rest };
        if (due_date !== undefined) data.dueDate = due_date ? new Date(due_date) : null;
        if (estimated_hours !== undefined) data.estimatedHours = estimated_hours ? parseFloat(estimated_hours) : null;

        const task = await prisma.task.update({
            where: { id: req.params.id },
            data,
            include: { assignee: true }
        });
        res.json(mapTaskToFrontend(task));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await prisma.task.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
