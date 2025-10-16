# Controllers/programs/ProgramAddController.py
from flask import Blueprint, request, jsonify
from Models.programTableModel.program_add_model import ProgramAddModel

program_add_bp = Blueprint("program_add", __name__, url_prefix="/api/programs/add")

@program_add_bp.route("", methods=["POST"])
def add_program():
    """
    Endpoint for adding a new program record.
    Expected JSON payload:
        {
            "program_code": "BSCS",
            "program_name": "Bachelor of Science in Computer Science",
            "college_code": "CITCS"
        }
    """
    try:
        data = request.get_json(force=True)
        program_code = data.get("program_code", "").strip()
        program_name = data.get("program_name", "").strip()
        college_code = data.get("college_code", "").strip()

        # Input validation
        if not program_code or not program_name or not college_code:
            return jsonify({
                "success": False,
                "message": "program_code, program_name, and college_code are all required."
            }), 400

        result = ProgramAddModel.add_program(program_code, program_name, college_code)

        status_code = 201 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in add_program controller:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
