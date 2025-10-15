# Controllers/programs/ProgramUpdateController.py
from flask import Blueprint, request, jsonify
from Models.programTableModel.program_update_model import ProgramUpdateModel

program_update_bp = Blueprint("program_update_bp", __name__)

@program_update_bp.route("/api/programs/update", methods=["PUT"])
def update_program():
    """
    Updates an existing program record.
    Expected JSON body:
    {
        "program_code": "BSCS",
        "new_program_name": "Bachelor of Science in Computer Science",
        "new_college_code": "CITCS"
    }
    """
    try:
        data = request.get_json()

        # Input validation
        if not data:
            return jsonify({"success": False, "message": "Missing JSON body."}), 400

        program_code = data.get("program_code")
        new_program_name = data.get("new_program_name")
        new_college_code = data.get("new_college_code")

        result = ProgramUpdateModel.update_program(program_code, new_program_name, new_college_code)

        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in update_program controller:", e)
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred while updating program."
        }), 500
