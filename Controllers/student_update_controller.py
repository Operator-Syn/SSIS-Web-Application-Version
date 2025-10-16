from flask import Blueprint, request, jsonify
from Models.studentTableModel.student_update_model import StudentUpdateModel

student_update_bp = Blueprint("student_update_bp", __name__)

@student_update_bp.route("/api/students/update", methods=["PUT"])
def update_student():
    """
    Updates an existing student record.
    Expected JSON body:
    {
        "id_number": "202300001",
        "new_first_name": "Juan",
        "new_middle_name": "Dela",
        "new_last_name": "Cruz",
        "new_gender": "Male",
        "new_year_level": 3,
        "new_program_code": "BSCS"
    }
    """
    try:
        data = request.get_json()

        # Input validation
        if not data:
            return jsonify({
                "success": False,
                "message": "Missing JSON body."
            }), 400

        id_number = data.get("id_number")
        new_first_name = data.get("new_first_name")
        new_middle_name = data.get("new_middle_name")
        new_last_name = data.get("new_last_name")
        new_gender = data.get("new_gender")
        new_year_level = data.get("new_year_level")
        new_program_code = data.get("new_program_code")

        result = StudentUpdateModel.update_student(
            id_number=id_number,
            new_first_name=new_first_name,
            new_middle_name=new_middle_name,
            new_last_name=new_last_name,
            new_gender=new_gender,
            new_year_level=new_year_level,
            new_program_code=new_program_code
        )

        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in update_student controller:", e)
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred while updating student."
        }), 500
