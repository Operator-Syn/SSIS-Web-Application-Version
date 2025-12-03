from flask import Blueprint, request, jsonify
from Models.programTableModel.program_search_model import ProgramSearchModel

program_search_bp = Blueprint("program_search", __name__, url_prefix="/api/programs/search")

@program_search_bp.route("", methods=["GET"])
def search_programs():
    # Extract and sanitize query parameters
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))
    order_by = request.args.get("order_by", "program_code")
    direction = request.args.get("direction", "ASC").upper()

    # Validate sort direction to prevent injection
    if direction not in ("ASC", "DESC"):
        direction = "ASC"

    try:
        total_count, rows = ProgramSearchModel.search_programs(
            query=q,
            limit=limit,
            offset=offset,
            order_by=order_by,
            direction=direction
        )

        return jsonify({
            "totalCount": total_count,
            "rows": rows
        }), 200

    except Exception as e:
        print("Error in program search controller:", e)
        return jsonify({"error": "Database error"}), 500
