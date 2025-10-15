from flask import Blueprint, request, jsonify
from Models.programTableModel.program_table_model import ProgramModel

program_bp = Blueprint("programs", __name__)

@program_bp.route("/api/programs", methods=["GET"])
def programs_route():
    # Parse query parameters
    params = request.args.to_dict()
    limit = int(params.pop("limit", 20))
    offset = int(params.pop("offset", 0))
    order_by = params.pop("order_by", "program_code")
    direction = params.pop("direction", "ASC").upper()
    filters = params  # Remaining parameters are treated as filters

    try:
        # Fetch paginated programs with optional filters
        rows = ProgramModel.get_programs(order_by, direction, limit, offset, filters)
        total_count = ProgramModel.get_count(filters)
        return jsonify({"rows": rows, "totalCount": total_count})
    except Exception as e:
        print("Error fetching programs:", e)
        return jsonify({"error": "Database error"}), 500
