from flask import Blueprint, request, jsonify
from Models.collegeTableModel.college_delete_model import CollegeDeleteModel

college_delete_bp = Blueprint("college_delete", __name__)

@college_delete_bp.route("/api/colleges/delete", methods=["DELETE"])
def delete_college_route():
    """
    API endpoint to delete a college by its code.

    Expected JSON body:
    {
        "college_code": "CCS"
    }
    """
    data = request.get_json(silent=True)
    if not data or "college_code" not in data:
        return jsonify({
            "success": False,
            "message": "college_code is required in the request body."
        }), 400

    college_code = data["college_code"].strip()

    result = CollegeDeleteModel.delete_college(college_code)

    return jsonify(result), (200 if result["success"] else 400)
