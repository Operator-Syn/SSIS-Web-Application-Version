from flask import Blueprint, request, jsonify
from Models.programTableModel.program_delete_model import ProgramDeleteModel

program_delete_bp = Blueprint("program_delete", __name__, url_prefix="/api/programs/delete")

@program_delete_bp.route("", methods=["DELETE"])
def delete_program():
    """
    Endpoint for deleting a program record.
    Expected JSON payload:
        {
            "program_code": "BSCS"
        }
    """
    try:
        data = request.get_json(force=True)
        program_code = data.get("program_code", "").strip()

        if not program_code:
            return jsonify({
                "success": False,
                "message": "program_code is required."
            }), 400

        result = ProgramDeleteModel.delete_program(program_code)
        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in delete_program controller:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
