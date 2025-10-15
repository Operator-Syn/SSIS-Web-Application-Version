from flask import Flask, send_from_directory, send_file
from werkzeug.utils import safe_join 
import os
from config import Config
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

app = Flask(__name__, static_folder=Config.REACT_DIST)

# Register API routes

    #College API routes
app.register_blueprint(college_bp)
app.register_blueprint(college_search_bp)
app.register_blueprint(college_add_bp)
app.register_blueprint(college_update_bp)
app.register_blueprint(college_delete_bp)

    #Program API routes
app.register_blueprint(program_bp)
app.register_blueprint(program_search_bp)
app.register_blueprint(program_add_bp)
app.register_blueprint(program_update_bp)
app.register_blueprint(program_delete_bp)

    #Student API routes
app.register_blueprint(student_bp)
app.register_blueprint(student_search_bp)
app.register_blueprint(student_add_bp)


# Cache the React index.html path
INDEX_HTML = os.path.join(app.static_folder, "index.html")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    # Serve static files if they exist
    if path != "":
        file_path = safe_join(app.static_folder, path)
        if file_path and os.path.isfile(file_path):
            return send_from_directory(app.static_folder, path)

    # Fallback for React Router routes
    return send_file(INDEX_HTML)

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
