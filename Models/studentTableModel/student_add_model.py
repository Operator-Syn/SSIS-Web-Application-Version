# Models/students/StudentAddModel.py
from Models.db.db_utils import DBUtils

class StudentAddModel:
    @staticmethod
    def add_student(
        id_number: str,
        first_name: str,
        middle_name: str,
        last_name: str,
        gender: str,
        year_level: int,
        program_code: str,
        profile_image_path: str = None  
    ):
        """
        Adds a new student record to the database.

        Args:
            id_number (str): Unique student ID (9 characters).
            first_name (str): First name of the student.
            middle_name (str): Middle name of the student (optional).
            last_name (str): Last name of the student.
            gender (str): "Male" or "Female".
            year_level (int): Year level of the student.
            program_code (str): Code of the program the student is enrolled in.
            profile_image_path (str, optional): Path to the uploaded profile picture.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not id_number or not first_name or not last_name or not gender or not year_level or not program_code:
            return {"success": False, "message": "All required fields must be provided."}

        try:
            # Check if the referenced program exists
            program_check_query = "SELECT 1 FROM programs WHERE program_code = %s"
            program_exists = DBUtils.execute_query(program_check_query, (program_code,), fetch=True)
            if not program_exists:
                return {"success": False, "message": f"Program with code '{program_code}' not found."}

            # Check if the student ID already exists
            duplicate_query = "SELECT 1 FROM students WHERE id_number = %s"
            duplicate_exists = DBUtils.execute_query(duplicate_query, (id_number,), fetch=True)
            if duplicate_exists:
                return {"success": False, "message": f"Student with ID '{id_number}' already exists."}

            # Insert new student, including profile_image_path
            insert_query = """
                INSERT INTO students
                    (id_number, first_name, middle_name, last_name, gender, year_level, program_code, profile_image_path)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
        
            DBUtils.execute_query(
                insert_query,
                (id_number, first_name, middle_name, last_name, gender, year_level, program_code, profile_image_path),
                fetch=False
            )
            return {"success": True, "message": "Student added successfully."}

        except Exception as e:
            print("Error in add_student:", e)
            return {"success": False, "message": "Database error while adding student."}
