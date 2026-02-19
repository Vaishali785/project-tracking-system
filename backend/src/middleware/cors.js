import cors from "cors"

/**
 * CORS MIDDLEWARE
 *
 * WHAT IS CORS?
 * Cross-Origin Resource Sharing - a security feature in browsers
 * By default, browsers block requests from one domain to another
 * (e.g., frontend on localhost:3000 trying to access backend on localhost:5000)
 *
 * WHY DO WE NEED IT?
 * Our React frontend (port 3000) needs to call our backend (port 5000)
 * Without CORS, the browser will block these requests
 *
 * WHAT DOES THIS DO?
 * - Allows requests from localhost:3000 (our React app)
 * - Allows common HTTP methods (GET, POST, PATCH, DELETE)
 * - Allows JSON content type headers
 */

const allowedOrigins = [
	"http://localhost:3000",
	"https://project-tracker-vaishali.netlify.app",
]

const corsOptions = {
	origin: allowedOrigins, // Allow requests from React dev server
	methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed HTTP methods
	allowedHeaders: ["Content-Type"], // Allowed headers in requests
	credentials: true, // Allow cookies if needed later
}

export default cors(corsOptions)
