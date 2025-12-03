from flask import Flask
from .college_modules.college_add_controller import college_add_bp
from .college_modules.college_delete_controller import college_delete_bp
from .college_modules.college_search_controller import college_search_bp
from .college_modules.college_update_controller import college_update_bp
from .college_modules.college_table_controller import college_bp

def register_college_routes(app: Flask):
    """
    Register all college-related blueprints to the app.
    """
    app.register_blueprint(college_add_bp)
    app.register_blueprint(college_delete_bp)
    app.register_blueprint(college_search_bp)
    app.register_blueprint(college_update_bp)
    app.register_blueprint(college_bp)