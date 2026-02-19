import { useState } from "react"

/**
 * Custom Hook: useToast
 * Manages toast notification state
 *
 * Features:
 * - Show success/error toasts
 * - Auto-dismiss configuration
 * - Simple API
 */

export default function useToast() {
	const [toast, setToast] = useState(null)

	/**
	 * Show a toast notification
	 * @param {string} message - Message to display
	 * @param {string} type - 'success' or 'error'
	 */
	const showToast = (message, type = "success") => {
		setToast({ message, type })
	}

	/**
	 * Hide current toast
	 */
	const hideToast = () => {
		setToast(null)
	}

	return {
		toast,
		showToast,
		hideToast,
	}
}
