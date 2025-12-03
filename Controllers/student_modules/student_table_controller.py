from flask import Blueprint, request, jsonify
from Models.studentTableModel.student_table_model import StudentModel

student_bp = Blueprint("students", __name__)

@student_bp.route("/api/students", methods=["GET"])
def students_route():
    params = request.args.to_dict()
    limit = int(params.pop("limit", 20))
    offset = int(params.pop("offset", 0))
    order_by = params.pop("order_by", "id_number")
    direction = params.pop("direction", "ASC").upper()
    filters = params

    try:
        rows = StudentModel.get_students(order_by, direction, limit, offset, filters)
        total_count = StudentModel.get_count(filters)
        return jsonify({"rows": rows, "totalCount": total_count})
    except Exception as e:
        print("Error fetching students:", e)
        return jsonify({"error": "Database error"}), 500
