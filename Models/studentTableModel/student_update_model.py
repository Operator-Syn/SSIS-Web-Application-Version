from Models.db.db_utils import DBUtils

class StudentUpdateModel:
    @staticmethod
    def update_student(
        id_number: str,
        new_first_name: str = None,
        new_middle_name: str = None,
        new_last_name: str = None,
        new_gender: str = None,
        new_year_level: int = None,
        new_program_code: str = None
    ):
        """
        Updates an existing student record in the database.

        Args:
            id_number (str): Student ID number (primary key).
            new_first_name (str): Updated first name.
            new_middle_name (str): Updated middle name.
            new_last_name (str): Updated last name.
            new_gender (str): Updated gender.
            new_year_level (int): Updated year level.
            new_program_code (str): Updated program code (FK).

        Returns:
            dict: { "success": bool, "message": str }
        """
        if not id_number:
            return {"success": False, "message": "id_number is required."}

        try:
            # Check if the student exists
            check_query = "SELECT 1 FROM students WHERE id_number = %s"
            existing = DBUtils.execute_query(check_query, (id_number,), fetch=True)
            if not existing:
                return {"success": False, "message": "Student not found."}

            # If program code is being updated, ensure it exists
            if new_program_code:
                program_check_query = "SELECT 1 FROM programs WHERE program_code = %s"
                valid_program = DBUtils.execute_query(program_check_query, (new_program_code,), fetch=True)
                if not valid_program:
                    return {"success": False, "message": "Invalid program_code: does not exist."}

            # Build dynamic SET clause
            fields = []
            params = []

            if new_first_name:
                fields.append("first_name = %s")
                params.append(new_first_name)
            if new_middle_name is not None:  
                fields.append("middle_name = %s")
                params.append(new_middle_name)
            if new_last_name:
                fields.append("last_name = %s")
                params.append(new_last_name)
            if new_gender:
                fields.append("gender = %s")
                params.append(new_gender)
            if new_year_level:
                fields.append("year_level = %s")
                params.append(new_year_level)
            if new_program_code:
                fields.append("program_code = %s")
                params.append(new_program_code)

            if not fields:
                return {"success": False, "message": "No fields to update."}

            params.append(id_number)
            update_query = f"""
                UPDATE students
                SET {', '.join(fields)}
                WHERE id_number = %s
            """

            DBUtils.execute_query(update_query, tuple(params), fetch=False)
            return {"success": True, "message": "Student record updated successfully."}

        except Exception as e:
            print("Error in update_student:", e)
            return {"success": False, "message": "Database error while updating student."}
