from flask import Blueprint, request, jsonify
from Models.collegeTableModel.college_table_model import CollegeModel

college_bp = Blueprint("colleges", __name__)

@college_bp.route("/api/colleges", methods=["GET"])
def colleges_route():
    params = request.args.to_dict()

    # No limit, no offset
    order_by = params.pop("order_by", "college_code")
    direction = params.pop("direction", "ASC").upper()

    filters = params  # Everything else = filters

    try:
        rows = CollegeModel.get_colleges(order_by, direction, filters)
        total_count = CollegeModel.get_count(filters)
        return jsonify({"rows": rows, "totalCount": total_count})
    except Exception as e:
        print("Error fetching colleges:", e)
        return jsonify({"error": "Database error"}), 500
