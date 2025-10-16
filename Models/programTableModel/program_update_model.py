# Models/programTableModel/program_update_model.py
from Models.db.db_utils import DBUtils

class ProgramUpdateModel:

    @staticmethod
    def update_program(program_code: str, new_program_name: str, new_college_code: str):
        """
        Updates an existing program record in the database.

        Args:
            program_code (str): The unique code of the program to update.
            new_program_name (str): The new name for the program.
            new_college_code (str): The new college code the program belongs to.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not program_code or not new_program_name or not new_college_code:
            return {"success": False, "message": "program_code, new_program_name, and new_college_code are required."}

        try:
            # Check if the program exists
            check_program_query = "SELECT 1 FROM programs WHERE program_code = %s"
            program_exists = DBUtils.execute_query(check_program_query, (program_code,), fetch=True)
            if not program_exists:
                return {"success": False, "message": "Program not found."}

            # Check if the target college exists
            check_college_query = "SELECT 1 FROM colleges WHERE college_code = %s"
            college_exists = DBUtils.execute_query(check_college_query, (new_college_code,), fetch=True)
            if not college_exists:
                return {"success": False, "message": "College code does not exist."}

            # Perform update
            update_query = """
                UPDATE programs
                SET program_name = %s,
                    college_code = %s
                WHERE program_code = %s
            """
            DBUtils.execute_query(update_query, (new_program_name, new_college_code, program_code), fetch=False)

            return {"success": True, "message": "Program updated successfully."}

        except Exception as e:
            print("Error in update_program:", e)
            return {"success": False, "message": "Database error while updating program."}
