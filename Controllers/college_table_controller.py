from flask import Blueprint, request, jsonify
from Models.collegeTableModel.college_table_model import CollegeModel

college_bp = Blueprint("colleges", __name__)

@college_bp.route("/api/colleges", methods=["GET"])
def colleges_route():
    # Parse query parameters
    params = request.args.to_dict()
    limit = int(params.pop("limit", 20))
    offset = int(params.pop("offset", 0))
    order_by = params.pop("order_by", "college_code")
    direction = params.pop("direction", "ASC").upper()
    filters = params  # Remaining parameters are treated as filters

    try:
        rows = CollegeModel.get_colleges(order_by, direction, limit, offset, filters)
        total_count = CollegeModel.get_count(filters)
        return jsonify({"rows": rows, "totalCount": total_count})
    except Exception as e:
        print("Error fetching colleges:", e)
        return jsonify({"error": "Database error"}), 500
