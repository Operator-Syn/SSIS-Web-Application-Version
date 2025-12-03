from flask import Blueprint, request, jsonify
from Models.studentTableModel.student_delete_model import StudentDeleteModel

student_delete_bp = Blueprint("student_delete", __name__, url_prefix="/api/students/delete")

@student_delete_bp.route("", methods=["DELETE"])
def delete_student():
    """
    Endpoint for deleting a student record.
    Expected JSON payload:
        {
            "id_number": "202300001"
        }
    """
    try:
        data = request.get_json(force=True)
        id_number = data.get("id_number", "").strip()

        if not id_number:
            return jsonify({
                "success": False,
                "message": "id_number is required."
            }), 400

        result = StudentDeleteModel.delete_student(id_number)
        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in delete_student controller:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
