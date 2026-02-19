import * as projectService from '../services/projectService.js';

/**
 * CONTROLLERS LAYER
 * Controllers handle HTTP requests and responses
 * They call service functions and format responses
 * 
 * WHAT CONTROLLERS DO:
 * 1. Extract data from request (req.body, req.params, req.query)
 * 2. Call service functions
 * 3. Handle errors and send appropriate HTTP status codes
 * 4. Format and send responses
 * 
 * WHAT CONTROLLERS DON'T DO:
 * - Business logic (that's in services)
 * - Database queries (that's in database layer)
 * - Complex validation (that's in services)
 */

/**
 * POST /projects
 * Create a new project
 */
export async function createProject(req, res) {
  try {
    const projectData = req.body;
    const newProject = projectService.createNewProject(projectData);
    
    // 201 = Created (successful resource creation)
    res.status(201).json(newProject);
  } catch (error) {
    // 400 = Bad Request (validation errors)
    res.status(400).json({ error: error.message });
  }
}

/**
 * GET /projects
 * List all projects with optional filters
 * Query params: status, search, sortBy
 */
export async function getAllProjects(req, res) {
  try {
    // Extract query parameters
    const filters = {
      status: req.query.status,
      search: req.query.search,
      sortBy: req.query.sortBy
    };
    
    const projects = projectService.listProjects(filters);
    
    // 200 = OK (successful request)
    res.status(200).json(projects);
  } catch (error) {
    // 500 = Internal Server Error (unexpected errors)
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /projects/:id
 * Get a single project by ID
 */
export async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = projectService.getProject(parseInt(id));
    
    res.status(200).json(project);
  } catch (error) {
    // 404 = Not Found (project doesn't exist)
    if (error.message === 'Project not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * PATCH /projects/:id/status
 * Update only the status of a project
 */
export async function updateProjectStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const updatedProject = projectService.changeProjectStatus(parseInt(id), status);
    
    res.status(200).json(updatedProject);
  } catch (error) {
    // Handle different error types with appropriate status codes
    if (error.message === 'Project not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('Cannot transition')) {
      res.status(400).json({ error: error.message });
    } else if (error.message === 'Invalid status value') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

/**
 * DELETE /projects/:id
 * Soft delete a project
 */
export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const result = projectService.deleteProject(parseInt(id));
    
    // 200 = OK (successful deletion)
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Project not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
