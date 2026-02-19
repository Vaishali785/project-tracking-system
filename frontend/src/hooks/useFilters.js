import { useEffect, useState } from "react"

/**
 * Custom Hook: useFilters
 * Manages filter state with URL persistence
 *
 * Features:
 * - Reads initial state from URL query params
 * - Updates URL when filters change
 * - Handles browser back/forward navigation
 * - Returns filters and update function
 */

/**
 * Parse URL query parameters into filter object
 */
function getFiltersFromURL() {
	const params = new URLSearchParams(window.location.search)
	return {
		status: params.get("status") || "",
		search: params.get("search") || "",
		sortBy: params.get("sortBy") || "createdAt",
	}
}

/**
 * Update browser URL with current filter values
 */
function updateURLWithFilters(filters) {
	const params = new URLSearchParams()

	if (filters.status) {
		params.set("status", filters.status)
	}

	if (filters.search) {
		params.set("search", filters.search)
	}

	if (filters.sortBy && filters.sortBy !== "createdAt") {
		params.set("sortBy", filters.sortBy)
	}

	const newURL = params.toString()
		? `${window.location.pathname}?${params.toString()}`
		: window.location.pathname

	window.history.pushState({}, "", newURL)
}

export default function useFilters() {
	const [filters, setFilters] = useState(getFiltersFromURL())

	/**
	 * Update filters and sync to URL
	 */
	const updateFilters = (newFilters) => {
		setFilters(newFilters)
		updateURLWithFilters(newFilters)
	}

	/**
	 * Handle browser back/forward buttons
	 */
	useEffect(() => {
		const handlePopState = () => {
			const urlFilters = getFiltersFromURL()
			setFilters(urlFilters)
		}

		window.addEventListener("popstate", handlePopState)

		return () => {
			window.removeEventListener("popstate", handlePopState)
		}
	}, [])

	return {
		filters,
		updateFilters,
	}
}
