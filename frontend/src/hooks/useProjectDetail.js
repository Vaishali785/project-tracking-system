import { useState } from "react"
import * as api from "../api/projects"

/**
 * Custom Hook: useProjectDetail
 * Manages project detail modal state and fetching
 *
 * Features:
 * - Fetch single project by ID
 * - Handle loading state
 * - Open/close modal
 */

export default function useProjectDetail() {
	const [selectedProject, setSelectedProject] = useState(null)
	const [loadingDetail, setLoadingDetail] = useState(false)

	/**
	 * Fetch and open project detail modal
	 */
	const openProjectDetail = async (projectId) => {
		try {
			setLoadingDetail(true)
			const project = await api.fetchProjectById(projectId)
			setSelectedProject(project)
		} catch (err) {
			console.error("Failed to load project:", err)
		} finally {
			setLoadingDetail(false)
		}
	}

	/**
	 * Close project detail modal
	 */
	const closeProjectDetail = () => {
		setSelectedProject(null)
		setLoadingDetail(false)
	}

	return {
		selectedProject,
		loadingDetail,
		openProjectDetail,
		closeProjectDetail,
	}
}
