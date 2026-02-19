import Database from "better-sqlite3"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize SQLite database
// This creates a file called 'projects.db' in the database folder
const db = new Database(join(__dirname, "projects.db"))

/**
 * Initialize database schema
 * Creates the projects table if it doesn't exist
 *
 * WHY THESE FIELDS:
 * - id: Auto-incrementing primary key (SQLite handles this automatically)
 * - name, clientName: Required text fields (NOT NULL constraint)
 * - status: Limited to specific values with CHECK constraint
 * - startDate, endDate: Store as TEXT in ISO format (SQLite date handling)
 * - isDeleted: For soft delete (0 = active, 1 = deleted)
 * - createdAt, updatedAt: Automatic timestamps
 */
export function initializeDatabase() {
	const createTableSQL = `
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      clientName TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('active', 'on_hold', 'completed')),
      startDate TEXT NOT NULL,
      endDate TEXT,
      isDeleted INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `

	db.exec(createTableSQL)
	console.log("✓ Database initialized")
}

/**
 * DATABASE QUERY FUNCTIONS
 * These are the ONLY place where SQL queries exist
 * Controllers/Services call these functions, never write SQL directly
 */

// CREATE: Insert a new project
export function createProject(projectData) {
	const { name, clientName, status, startDate, endDate } = projectData

	const stmt = db.prepare(`
    INSERT INTO projects (name, clientName, status, startDate, endDate)
    VALUES (?, ?, ?, ?, ?)
  `)

	const result = stmt.run(name, clientName, status, startDate, endDate)

	// Return the newly created project
	return getProjectById(result.lastInsertRowid)
}

// READ: Get all projects (excluding soft-deleted ones)
// Supports filtering, searching, and sorting
export function getAllProjects(filters = {}) {
	const { status, search, sortBy = "createdAt" } = filters

	// Start with base query that excludes deleted projects
	let query = "SELECT * FROM projects WHERE isDeleted = 0"
	const params = []

	// Add status filter if provided
	if (status) {
		query += " AND status = ?"
		params.push(status)
	}

	// Add search filter if provided (searches both name and clientName)
	if (search) {
		// Escape special SQL LIKE characters: % and _
		const escapedSearch = search.replace(/%/g, "\\%").replace(/_/g, "\\_")
		query += " AND (name LIKE ? ESCAPE '\\' OR clientName LIKE ? ESCAPE '\\')"
		const searchPattern = `%${escapedSearch}%`
		params.push(searchPattern, searchPattern)
	}

	// Add sorting (DESC = newest first)
	const validSortFields = ["createdAt", "startDate"]
	const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt"
	query += ` ORDER BY ${sortField} DESC`

	const stmt = db.prepare(query)
	return stmt.all(...params)
}

// READ: Get single project by ID
export function getProjectById(id) {
	const stmt = db.prepare(
		"SELECT * FROM projects WHERE id = ? AND isDeleted = 0",
	)
	return stmt.get(id)
}

// UPDATE: Change project status and update timestamp
export function updateProjectStatus(id, newStatus) {
	const stmt = db.prepare(`
    UPDATE projects 
    SET status = ?, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ? AND isDeleted = 0
  `)

	const result = stmt.run(newStatus, id)

	if (result.changes === 0) {
		return null // Project not found
	}

	return getProjectById(id)
}

// DELETE: Soft delete (set isDeleted flag instead of removing from database)
export function softDeleteProject(id) {
	const stmt = db.prepare(`
    UPDATE projects 
    SET isDeleted = 1, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ? AND isDeleted = 0
  `)

	const result = stmt.run(id)
	return result.changes > 0 // Returns true if project was found and deleted
}

// Initialize database on import
initializeDatabase()

export default db
