import express from "express"
import corsMiddleware from "./middleware/cors.js"
import projectRoutes from "./routes/projectRoutes.js"

/**
 * SERVER SETUP
 * This is the entry point of our backend application
 * It configures Express and starts the server
 */

const app = express()
const PORT = process.env.PORT || 5001

/**
 * MIDDLEWARE
 * Middleware runs BEFORE your route handlers
 * Think of it as a series of filters that requests pass through
 */

// 1. CORS - Allow requests from React frontend
app.use(corsMiddleware)

// 2. JSON Parser - Convert request body from JSON string to JavaScript object
// Without this, req.body would be undefined
app.use(express.json())

// 3. Request Logger - Log every request (helpful for debugging)
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`)
	next() // IMPORTANT: Must call next() to pass control to next middleware
})

/**
 * ROUTES
 * All routes starting with /projects are handled by projectRoutes
 */
app.use("/projects", projectRoutes)

/**
 * ROOT ROUTE
 * Just a simple health check endpoint
 */
app.get("/", (req, res) => {
	res.json({
		message: "Project Tracking API",
		version: "1.0.0",
		endpoints: {
			"POST /projects": "Create project",
			"GET /projects":
				"List projects (supports: ?status=active&search=term&sortBy=createdAt)",
			"GET /projects/:id": "Get single project",
			"PATCH /projects/:id/status": "Update project status",
			"DELETE /projects/:id": "Delete project",
		},
	})
})

/**
 * 404 HANDLER
 * Catches any requests to undefined routes
 */
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" })
})

/**
 * ERROR HANDLER
 * Catches any errors that occur in route handlers
 * Must have 4 parameters (err, req, res, next) to work as error handler
 */
app.use((err, req, res, next) => {
	console.error("Error:", err)
	res.status(500).json({ error: "Internal server error" })
})

/**
 * START SERVER
 */
app.listen(PORT, () => {
	console.log(`
╔════════════════════════════════════════╗
║  Project Tracking API                  ║
║  Running on http://localhost:${PORT}     ║
╚════════════════════════════════════════╝

Ready to accept requests!
  `)
})
