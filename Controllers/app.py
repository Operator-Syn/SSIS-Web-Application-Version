from flask import Flask, send_from_directory, send_file, session, redirect, request, jsonify
from werkzeug.utils import safe_join
import os
from config import Config

# Existing controllers
from Controllers.college_routes_controller import register_college_routes
from Controllers.program_routes_controller import register_program_routes
from Controllers.student_routes_controller import register_student_routes

# Authentication controller
from Controllers.auth_user_controller import auth_bp

# ---------- Flask app setup ----------
app = Flask(__name__, static_folder=Config.REACT_DIST)
app.secret_key = Config.SECRET_KEY  # required for session management

# ---------- Register API routes ----------
register_college_routes(app)
register_program_routes(app)
register_student_routes(app)

app.register_blueprint(auth_bp)

# ---------- Protect all API routes ----------
@app.before_request
def protect_api_routes():
    # Skip login route
    if request.path.startswith("/api/login"):
        return

    # Protect all other API routes
    if request.path.startswith("/api/") and "username" not in session:
        return jsonify({"success": False, "message": "Authentication required"}), 401


# ---------- React SPA serving ----------
INDEX_HTML = os.path.join(app.static_folder, "index.html")

# SPA routes that require login
PROTECTED_ROUTES = [
    "/student/information",
    "/student/enroll",
    "/student/update",
    "/management",
    "/"
]

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    normalized_path = "/" + path.rstrip("/")

    # Redirect unauthenticated users to /login for protected SPA routes
    if normalized_path in PROTECTED_ROUTES and "username" not in session:
        return redirect("/login")

    # Serve static files if they exist (JS, CSS, images)
    file_path = safe_join(app.static_folder, path)
    if path != "" and file_path and os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)

    # Fallback to React SPA for other routes (including 404)
    return send_file(INDEX_HTML)

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)