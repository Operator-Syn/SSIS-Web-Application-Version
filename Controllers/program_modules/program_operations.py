from flask import Blueprint, request, jsonify

# Importing all relevant program models
from Models.programTableModel.program_add_model import ProgramAddModel
from Models.programTableModel.program_search_model import ProgramSearchModel
from Models.programTableModel.program_table_model import ProgramModel
from Models.programTableModel.program_update_model import ProgramUpdateModel
from Models.programTableModel.program_delete_model import ProgramDeleteModel

# Define a single blueprint for all program operations
program_bp = Blueprint("programs", __name__, url_prefix="/api/programs")

# --- READ (List & Filter) ---
@program_bp.route("", methods=["GET"])
def programs_route():
    params = request.args.to_dict()
    order_by = params.pop("order_by", "program_code")
    direction = params.pop("direction", "ASC").upper()
    filters = params  # Remaining parameters are treated as filters

    try:
        rows = ProgramModel.get_programs(order_by=order_by, direction=direction, filters=filters)
        total_count = ProgramModel.get_count(filters)
        return jsonify({"rows": rows, "totalCount": total_count})
    except Exception as e:
        print("Error fetching programs:", e)
        return jsonify({"error": "Database error"}), 500

# --- SEARCH ---
@program_bp.route("/search", methods=["GET"])
def search_programs():
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))
    order_by = request.args.get("order_by", "program_code")
    direction = request.args.get("direction", "ASC").upper()

    if direction not in ("ASC", "DESC"):
        direction = "ASC" #

    try:
        total_count, rows = ProgramSearchModel.search_programs(
            query=q,
            limit=limit,
            offset=offset,
            order_by=order_by,
            direction=direction
        )
        return jsonify({"totalCount": total_count, "rows": rows}), 200
    except Exception as e:
        print("Error in program search controller:", e)
        return jsonify({"error": "Database error"}), 500

# --- CREATE ---
@program_bp.route("/add", methods=["POST"])
def add_program():
    try:
        data = request.get_json(force=True)
        program_code = data.get("program_code", "").strip()
        program_name = data.get("program_name", "").strip()
        college_code = data.get("college_code", "").strip()

        if not program_code or not program_name or not college_code:
            return jsonify({
                "success": False,
                "message": "program_code, program_name, and college_code are all required."
            }), 400 #

        result = ProgramAddModel.add_program(program_code, program_name, college_code)
        status_code = 201 if result["success"] else 400
        return jsonify(result), status_code
    except Exception as e:
        print("Error in add_program controller:", e)
        return jsonify({"success": False, "message": "Internal server error."}), 500

# --- UPDATE ---
@program_bp.route("/update", methods=["PUT"])
def update_program():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Missing JSON body."}), 400

        program_code = data.get("program_code")
        new_program_name = data.get("new_program_name")
        new_college_code = data.get("new_college_code") #

        result = ProgramUpdateModel.update_program(program_code, new_program_name, new_college_code)
        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code
    except Exception as e:
        print("Error in update_program controller:", e)
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred while updating program."
        }), 500

# --- DELETE ---
@program_bp.route("/delete", methods=["DELETE"])
def delete_program():
    try:
        data = request.get_json(force=True)
        program_code = data.get("program_code", "").strip()

        if not program_code:
            return jsonify({"success": False, "message": "program_code is required."}), 400 #

        result = ProgramDeleteModel.delete_program(program_code)
        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code
    except Exception as e:
        print("Error in delete_program controller:", e)
        return jsonify({"success": False, "message": "Internal server error."}), 500