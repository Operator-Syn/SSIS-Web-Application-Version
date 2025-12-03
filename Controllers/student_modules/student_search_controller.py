from flask import Blueprint, request, jsonify
from Models.studentTableModel.student_search_model import StudentSearchModel

student_search_bp = Blueprint("student_search", __name__, url_prefix="/api/students/search")

@student_search_bp.route("", methods=["GET"])
def search_students():
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))
    order_by = request.args.get("order_by", "id_number")
    direction = request.args.get("direction", "ASC").upper()

    if direction not in ("ASC", "DESC"):
        direction = "ASC"

    try:
        total_count, rows = StudentSearchModel.search_students(
            query=q,
            limit=limit,
            offset=offset,
            order_by=order_by,
            direction=direction
        )
        return jsonify({"totalCount": total_count, "rows": rows})
    except Exception as e:
        print("Error in student search controller:", e)
        return jsonify({"error": "Database error"}), 500
