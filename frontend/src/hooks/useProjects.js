import { useEffect, useState } from "react"
import * as api from "../api/projects"

/**
 * Custom Hook: useProjects
 * Manages project data fetching and CRUD operations
 *
 * Features:
 * - Fetches projects based on filters
 * - Handles loading and error states
 * - Provides CRUD operation functions
 * - Auto-refetches when filters change
 */

export default function useProjects(filters) {
	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	/**
	 * Fetch projects from API with current filters
	 */
	const loadProjects = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await api.fetchProjects(filters)
			setProjects(data)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Create new project
	 */
	const createProject = async (projectData) => {
		await api.createProject(projectData)
		await loadProjects()
	}

	/**
	 * Update project status
	 */
	const updateProjectStatus = async (id, newStatus) => {
		await api.updateProjectStatus(id, newStatus)
		await loadProjects()
	}

	/**
	 * Delete project
	 */
	const deleteProject = async (id) => {
		await api.deleteProject(id)
		await loadProjects()
	}

	/**
	 * Fetch projects when filters change
	 */
	useEffect(() => {
		loadProjects()
	}, [filters])

	return {
		projects,
		loading,
		error,
		createProject,
		updateProjectStatus,
		deleteProject,
		refetch: loadProjects,
	}
}
