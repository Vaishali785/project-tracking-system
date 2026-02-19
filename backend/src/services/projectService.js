import * as db from "../database/db.js"

/**
 * SERVICES LAYER
 * This is where business logic and validation lives
 * Controllers call these functions, services call database functions
 *
 * WHY SEPARATE SERVICES FROM CONTROLLERS?
 * - Validation logic in one place
 * - Business rules in one place
 * - Controllers stay thin and readable
 * - Services are testable without HTTP layer
 */

/**
 * Validate status transition rules
 * Returns true if transition is allowed, false otherwise
 */
function isValidStatusTransition(currentStatus, newStatus) {
	const transitions = {
		active: ["on_hold", "completed"],
		on_hold: ["active", "completed"],
		completed: [], // No transitions allowed from completed
	}

	return transitions[currentStatus]?.includes(newStatus) || false
}

/**
 * Validate date logic
 * endDate must be >= startDate if provided
 */
function validateDates(startDate, endDate) {
	if (!endDate) return true // endDate is optional

	const start = new Date(startDate)
	const end = new Date(endDate)

	return end >= start
}

/**
 * Validate project creation data
 * Returns { valid: boolean, errors: string[] }
 */
function validateProjectData(data) {
	const errors = []

	// Required fields
	if (!data.name || data.name.trim() === "") {
		errors.push("Name is required")
	}

	if (!data.clientName || data.clientName.trim() === "") {
		errors.push("Client name is required")
	}

	if (!data.startDate) {
		errors.push("Start date is required")
	}

	// Status validation
	const validStatuses = ["active", "on_hold", "completed"]
	if (data.status && !validStatuses.includes(data.status)) {
		errors.push("Invalid status. Must be: active, on_hold, or completed")
	}

	// Date validation
	if (data.startDate && data.endDate) {
		if (!validateDates(data.startDate, data.endDate)) {
			errors.push("End date must be after start date")
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	}
}

/**
 * SERVICE FUNCTIONS
 * These contain business logic and call database functions
 */

export function createNewProject(projectData) {
	// Set default status if not provided
	const data = {
		...projectData,
		status: projectData.status || "active",
	}

	// Validate
	const validation = validateProjectData(data)
	if (!validation.valid) {
		throw new Error(validation.errors.join(", "))
	}

	// Check for duplicate (name + client combination)
	const existing = db
		.getAllProjects({
			search: data.name,
		})
		.filter(
			(p) =>
				p.name.toLowerCase() === data.name.toLowerCase() &&
				p.clientName.toLowerCase() === data.clientName.toLowerCase(),
		)

	if (existing.length > 0) {
		throw new Error("A project with this name already exists for this client")
	}

	// Create in database
	return db.createProject(data)
}

export function listProjects(filters) {
	// Simply pass through to database
	// Could add additional business logic here if needed
	return db.getAllProjects(filters)
}

export function getProject(id) {
	const project = db.getProjectById(id)

	if (!project) {
		throw new Error("Project not found")
	}

	return project
}

export function changeProjectStatus(id, newStatus) {
	// Get current project
	const project = db.getProjectById(id)

	if (!project) {
		throw new Error("Project not found")
	}

	// Validate status value
	const validStatuses = ["active", "on_hold", "completed"]
	if (!validStatuses.includes(newStatus)) {
		throw new Error("Invalid status value")
	}

	// Validate transition
	if (!isValidStatusTransition(project.status, newStatus)) {
		throw new Error(
			`Cannot transition from '${project.status}' to '${newStatus}'. ` +
				`Valid transitions: ${
					project.status === "completed"
						? "none (project is completed)"
						: isValidStatusTransition(project.status, "active")
							? "active, completed"
							: "on_hold, completed"
				}`,
		)
	}

	// Update in database
	return db.updateProjectStatus(id, newStatus)
}

export function deleteProject(id) {
	const deleted = db.softDeleteProject(id)

	if (!deleted) {
		throw new Error("Project not found")
	}

	return { success: true, message: "Project deleted successfully" }
}
