# Controllers/students/StudentAddController.py
from flask import Blueprint, request, jsonify
from Models.studentTableModel.student_add_model import StudentAddModel

student_add_bp = Blueprint("student_add", __name__, url_prefix="/api/students/add")

@student_add_bp.route("", methods=["POST"])
def add_student():
    """
    Endpoint for adding a new student record.
    Expected JSON payload:
        {
            "id_number": "202500001",
            "first_name": "John",
            "middle_name": "R",
            "last_name": "Doe",
            "gender": "Male",
            "year_level": 1,
            "program_code": "BSCS"
        }
    """
    try:
        data = request.get_json(force=True)
        id_number = data.get("id_number", "").strip()
        first_name = data.get("first_name", "").strip()
        middle_name = data.get("middle_name", "").strip()
        last_name = data.get("last_name", "").strip()
        gender = data.get("gender", "").strip()
        year_level = data.get("year_level")
        program_code = data.get("program_code", "").strip()

        # Input validation
        if not id_number or not first_name or not last_name or not gender or not year_level or not program_code:
            return jsonify({
                "success": False,
                "message": "All required fields must be provided."
            }), 400

        result = StudentAddModel.add_student(
            id_number=id_number,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            gender=gender,
            year_level=year_level,
            program_code=program_code
        )

        status_code = 201 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in add_student controller:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
