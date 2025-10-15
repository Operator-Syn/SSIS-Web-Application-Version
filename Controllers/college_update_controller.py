from flask import Blueprint, request, jsonify
from Models.collegeTableModel.college_update_model import CollegeUpdateModel

college_update_bp = Blueprint("college_update_bp", __name__)

@college_update_bp.route("/api/colleges/update", methods=["PUT"])
def update_college():
    """
    Updates an existing college record.
    Expected JSON body:
    {
        "college_code": "CIT",
        "new_college_name": "College of Information Technology"
    }
    """
    try:
        data = request.get_json()

        # Input validation
        if not data:
            return jsonify({"success": False, "message": "Missing JSON body."}), 400

        college_code = data.get("college_code")
        new_college_name = data.get("new_college_name")

        result = CollegeUpdateModel.update_college(college_code, new_college_name)

        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in update_college controller:", e)
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred while updating college."
        }), 500
