from flask import Flask, send_from_directory, send_file, session, redirect, request, jsonify
from werkzeug.utils import safe_join
import os
from config import Config

# Existing controllers
from Controllers.student_table_controller import student_bp 
from Controllers.student_search_controller import student_search_bp
from Controllers.college_table_controller import college_bp
from Controllers.college_search_controller import college_search_bp
from Controllers.program_table_controller import program_bp
from Controllers.program_search_controller import program_search_bp
from Controllers.college_add_controller import college_add_bp
from Controllers.college_update_controller import college_update_bp
from Controllers.college_delete_controller import college_delete_bp
from Controllers.program_add_controller import program_add_bp
from Controllers.program_update_controller import program_update_bp
from Controllers.program_delete_controller import program_delete_bp
from Controllers.student_add_controller import student_add_bp
from Controllers.student_update_controller import student_update_bp
from Controllers.student_delete_controller import student_delete_bp

# Authentication controller
from Controllers.auth_user_controller import auth_bp

# ---------- Flask app setup ----------
app = Flask(__name__, static_folder=Config.REACT_DIST)
app.secret_key = Config.SECRET_KEY  # required for session management

# ---------- Register API routes ----------
app.register_blueprint(college_bp)
app.register_blueprint(college_search_bp)
app.register_blueprint(college_add_bp)
app.register_blueprint(college_update_bp)
app.register_blueprint(college_delete_bp)

app.register_blueprint(program_bp)
app.register_blueprint(program_search_bp)
app.register_blueprint(program_add_bp)
app.register_blueprint(program_update_bp)
app.register_blueprint(program_delete_bp)

app.register_blueprint(student_bp)
app.register_blueprint(student_search_bp)
app.register_blueprint(student_add_bp)
app.register_blueprint(student_update_bp)
app.register_blueprint(student_delete_bp)

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