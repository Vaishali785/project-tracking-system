import express from 'express';
import * as projectController from '../controllers/projectController.js';

/**
 * ROUTES LAYER
 * Routes define the API endpoints (URLs) and connect them to controllers
 * 
 * This is just the "map" - it says:
 * "When someone makes a POST to /projects, call projectController.createProject"
 * 
 * NO LOGIC HERE - just routing definitions
 */

const router = express.Router();

/**
 * PROJECT ROUTES
 * All routes are prefixed with /projects (defined in server.js)
 */

// POST /projects - Create new project
router.post('/', projectController.createProject);

// GET /projects - List all projects (with optional filters)
router.get('/', projectController.getAllProjects);

// GET /projects/:id - Get single project
router.get('/:id', projectController.getProjectById);

// PATCH /projects/:id/status - Update project status
router.patch('/:id/status', projectController.updateProjectStatus);

// DELETE /projects/:id - Delete project (soft delete)
router.delete('/:id', projectController.deleteProject);

export default router;
