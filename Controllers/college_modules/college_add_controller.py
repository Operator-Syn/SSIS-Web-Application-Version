from flask import Blueprint, request, jsonify
from Models.collegeTableModel.college_add_model import CollegeAddModel

college_add_bp = Blueprint("college_add", __name__, url_prefix="/api/colleges/add")

@college_add_bp.route("", methods=["POST"])
def add_college():
    """
    Endpoint for adding a new college record.
    Expected JSON payload:
        {
            "college_code": "CITCS",
            "college_name": "College of Information Technology and Computer Science"
        }
    """
    try:
        data = request.get_json(force=True)
        college_code = data.get("college_code", "").strip()
        college_name = data.get("college_name", "").strip()

        # Input validation
        if not college_code or not college_name:
            return jsonify({
                "success": False,
                "message": "Both college_code and college_name are required."
            }), 400

        result = CollegeAddModel.add_college(college_code, college_name)

        status_code = 201 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in add_college controller:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500
