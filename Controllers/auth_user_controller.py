from flask import Blueprint, request, jsonify, session, send_file, current_app
from werkzeug.utils import safe_join
from Models.userModel.user_model import UserModel
from functools import wraps
import os


auth_bp = Blueprint("auth", __name__)

# ----------------- Decorator -----------------
def login_required(f):
    """
    Protect routes: user must be logged in (i.e., 'username' in session)
    Handles both API and SPA routes.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        if "username" not in session:
            if request.path.startswith("/api/"):
                # API request -> return JSON
                return jsonify({"success": False, "message": "Authentication required"}), 401
            else:
                # SPA route -> serve login page
                login_path = safe_join(current_app.static_folder, "login.html")
                return send_file(login_path)
        return f(*args, **kwargs)
    return decorated

# ----------------- Routes -----------------
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    user = UserModel.get_user_by_username(username)
    if not user:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

    if UserModel.check_password(password, user[1]):
        session["username"] = username
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

@auth_bp.route("/api/logout", methods=["POST"])
@login_required
def logout():
    session.pop("username", None)
    return jsonify({"success": True, "message": "Logged out"})
