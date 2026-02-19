/**
 * API SERVICE LAYER
 * All backend communication happens here
 * Components call these functions instead of using fetch() directly
 *
 * WHY CENTRALIZE API CALLS?
 * - One place to change the API URL
 * - Consistent error handling
 * - Easy to add auth headers later
 * - Easier to test
 */

const API_BASE_URL = "http://localhost:5001"

/**
 * Helper function to handle API responses
 * Throws error if response is not ok
 */
async function handleResponse(response) {
	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ error: "Request failed" }))
		throw new Error(error.error || "Something went wrong")
	}
	return response.json()
}

/**
 * Fetch all projects with optional filters
 * @param {Object} filters - { status, search, sortBy }
 * @returns {Promise<Array>} Array of projects
 */
export async function fetchProjects(filters = {}) {
	// Build query string from filters
	const params = new URLSearchParams()

	if (filters.status) params.append("status", filters.status)
	if (filters.search) params.append("search", filters.search)
	if (filters.sortBy) params.append("sortBy", filters.sortBy)

	const queryString = params.toString()
	const url = `${API_BASE_URL}/projects${queryString ? "?" + queryString : ""}`

	const response = await fetch(url)
	return handleResponse(response)
}

/**
 * Fetch a single project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Project object
 */
export async function fetchProjectById(id) {
	const response = await fetch(`${API_BASE_URL}/projects/${id}`)
	return handleResponse(response)
}

/**
 * Create a new project
 * @param {Object} projectData - { name, clientName, status, startDate, endDate }
 * @returns {Promise<Object>} Created project
 */
export async function createProject(projectData) {
	const response = await fetch(`${API_BASE_URL}/projects`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(projectData),
	})
	return handleResponse(response)
}

/**
 * Update project status
 * @param {number} id - Project ID
 * @param {string} status - New status (active, on_hold, completed)
 * @returns {Promise<Object>} Updated project
 */
export async function updateProjectStatus(id, status) {
	const response = await fetch(`${API_BASE_URL}/projects/${id}/status`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ status }),
	})
	return handleResponse(response)
}

/**
 * Delete a project (soft delete)
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Success message
 */
export async function deleteProject(id) {
	const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
		method: "DELETE",
	})
	return handleResponse(response)
}
