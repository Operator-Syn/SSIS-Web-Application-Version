from flask import Blueprint, request, jsonify

# Assuming your model structure remains the same
from Models.collegeTableModel.college_add_model import CollegeAddModel
from Models.collegeTableModel.college_search_model import CollegeSearchModel
from Models.collegeTableModel.college_table_model import CollegeModel
from Models.collegeTableModel.college_update_model import CollegeUpdateModel
from Models.collegeTableModel.college_delete_model import CollegeDeleteModel

# Define a single blueprint for all college operations
college_bp = Blueprint("colleges", __name__, url_prefix="/api/colleges")

# --- READ (List & Filter) ---
@college_bp.route("", methods=["GET"])
def get_colleges():
    params = request.args.to_dict()
    order_by = params.pop("order_by", "college_code")
    direction = params.pop("direction", "ASC").upper()
    filters = params 

    try:
        rows = CollegeModel.get_colleges(order_by, direction, filters)
        total_count = CollegeModel.get_count(filters)
        return jsonify({"rows": rows, "totalCount": total_count})
    except Exception as e:
        print("Error fetching colleges:", e)
        return jsonify({"error": "Database error"}), 500

# --- SEARCH ---
@college_bp.route("/search", methods=["GET"])
def search_colleges():
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))
    order_by = request.args.get("order_by", "college_code")
    direction = request.args.get("direction", "ASC").upper()

    if direction not in ("ASC", "DESC"):
        direction = "ASC"

    try:
        total_count, rows = CollegeSearchModel.search_colleges(
            query=q, limit=limit, offset=offset, order_by=order_by, direction=direction
        )
        return jsonify({"totalCount": total_count, "rows": rows})
    except Exception as e:
        print("Error in college search controller:", e)
        return jsonify({"error": "Database error"}), 500

# --- CREATE ---
@college_bp.route("/add", methods=["POST"])
def add_college():
    try:
        data = request.get_json(force=True)
        college_code = data.get("college_code", "").strip()
        college_name = data.get("college_name", "").strip()

        if not college_code or not college_name:
            return jsonify({
                "success": False, 
                "message": "Both college_code and college_name are required."
            }), 400

        result = CollegeAddModel.add_college(college_code, college_name)
        status_code = 201 if result["success"] else 400
        return jsonify(result), status_code
    except Exception as e:
        print("Error in add_college controller:", e)
        return jsonify({"success": False, "message": "Internal server error."}), 500

# --- UPDATE ---
@college_bp.route("/update", methods=["PUT"])
def update_college():
    try:
        data = request.get_json()
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

# --- DELETE ---
@college_bp.route("/delete", methods=["DELETE"])
def delete_college_route():
    data = request.get_json(silent=True)
    if not data or "college_code" not in data:
        return jsonify({
            "success": False, 
            "message": "college_code is required in the request body."
        }), 400

    college_code = data["college_code"].strip()
    result = CollegeDeleteModel.delete_college(college_code)
    return jsonify(result), (200 if result["success"] else 400)