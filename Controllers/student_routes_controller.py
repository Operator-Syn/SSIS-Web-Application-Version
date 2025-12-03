from flask import Flask
from .student_modules.student_add_controller import student_add_bp
from .student_modules.student_delete_controller import student_delete_bp
from .student_modules.student_search_controller import student_search_bp
from .student_modules.student_update_controller import student_update_bp
from .student_modules.student_table_controller import student_bp

def register_student_routes(app: Flask):
    """
    Register all college-related blueprints to the app.
    """
    app.register_blueprint(student_add_bp)
    app.register_blueprint(student_delete_bp)
    app.register_blueprint(student_search_bp)
    app.register_blueprint(student_update_bp)
    app.register_blueprint(student_bp)
