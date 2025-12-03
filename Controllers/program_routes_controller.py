from flask import Flask
from .program_modules.program_add_controller import program_add_bp
from .program_modules.program_delete_controller import program_delete_bp
from .program_modules.program_search_controller import program_search_bp
from .program_modules.program_update_controller import program_update_bp
from .program_modules.program_table_controller import program_bp

def register_program_routes(app: Flask):
    """
    Register all college-related blueprints to the app.
    """
    app.register_blueprint(program_add_bp)
    app.register_blueprint(program_delete_bp)
    app.register_blueprint(program_search_bp)
    app.register_blueprint(program_update_bp)
    app.register_blueprint(program_bp)
