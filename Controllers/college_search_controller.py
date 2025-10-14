from flask import Blueprint, request, jsonify
from Models.collegeTableModel.college_search_model import CollegeSearchModel

college_search_bp = Blueprint("college_search", __name__, url_prefix="/api/colleges/search")

@college_search_bp.route("", methods=["GET"])
def search_colleges():
    # Get query parameters
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))
    order_by = request.args.get("order_by", "college_code")
    direction = request.args.get("direction", "ASC").upper()

    # Validate sort direction
    if direction not in ("ASC", "DESC"):
        direction = "ASC"

    try:
        total_count, rows = CollegeSearchModel.search_colleges(
            query=q,
            limit=limit,
            offset=offset,
            order_by=order_by,
            direction=direction
        )
        return jsonify({"totalCount": total_count, "rows": rows})
    except Exception as e:
        print("Error in college search controller:", e)
        return jsonify({"error": "Database error"}), 500
