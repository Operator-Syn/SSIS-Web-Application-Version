from flask import Blueprint, request, jsonify

# Importing all relevant models
from Models.studentTableModel.student_add_model import StudentAddModel
from Models.studentTableModel.student_search_model import StudentSearchModel
from Models.studentTableModel.student_table_model import StudentModel
from Models.studentTableModel.student_update_model import StudentUpdateModel
from Models.studentTableModel.student_delete_model import StudentDeleteModel

# Define a single blueprint for all student operations
student_bp = Blueprint("students", __name__, url_prefix="/api/students")

# --- READ (List & Filter) ---
@student_bp.route("", methods=["GET"])
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

# --- SEARCH ---
@student_bp.route("/search", methods=["GET"])
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

# --- CREATE ---
@student_bp.route("/add", methods=["POST"])
def add_student():
    try:
        data = request.get_json(force=True)
        id_number = data.get("id_number", "").strip()
        first_name = data.get("first_name", "").strip()
        middle_name = data.get("middle_name", "").strip()
        last_name = data.get("last_name", "").strip()
        gender = data.get("gender", "").strip()
        year_level = data.get("year_level")
        program_code = data.get("program_code", "").strip()
        profile_image_path = data.get("profile_image_path")

        if not id_number or not first_name or not last_name or not gender or not year_level or not program_code:
            return jsonify({
                "success": False,
                "message": "All required fields must be provided."
            }), 400

        result = StudentAddModel.add_student(
            id_number=id_number,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            gender=gender,
            year_level=year_level,
            program_code=program_code,
            profile_image_path=profile_image_path 
        )

        status_code = 201 if result["success"] else 400
        return jsonify(result), status_code

    except Exception as e:
        print("Error in add_student controller:", e)
        return jsonify({"success": False, "message": "Internal server error."}), 500

# --- UPDATE ---
@student_bp.route("/update", methods=["PUT"])
def update_student():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Missing JSON body."}), 400

        result = StudentUpdateModel.update_student(
            id_number=data.get("id_number"),
            new_first_name=data.get("new_first_name"),
            new_middle_name=data.get("new_middle_name"),
            new_last_name=data.get("new_last_name"),
            new_gender=data.get("new_gender"),
            new_year_level=data.get("new_year_level"),
            new_program_code=data.get("new_program_code"),
            new_image_path=data.get("new_image_path")  
        )

        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code
    except Exception as e:
        print("Error in update_student controller:", e)
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred while updating student."
        }), 500

# --- DELETE ---
@student_bp.route("/delete", methods=["DELETE"])
def delete_student():
    try:
        data = request.get_json(force=True)
        id_number = data.get("id_number", "").strip()

        if not id_number:
            return jsonify({"success": False, "message": "id_number is required."}), 400

        result = StudentDeleteModel.delete_student(id_number)
        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code
    except Exception as e:
        print("Error in delete_student controller:", e)
        return jsonify({"success": False, "message": "Internal server error."}), 500