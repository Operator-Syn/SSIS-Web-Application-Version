from Models.db.db_utils import DBUtils

class ProgramDeleteModel:

    @staticmethod
    def delete_program(program_code: str):
        """
        Deletes an existing program record from the database.

        Args:
            program_code (str): The unique code of the program to delete.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not program_code:
            return {"success": False, "message": "Program code is required."}

        try:
            # Check if the program exists
            check_query = "SELECT 1 FROM programs WHERE program_code = %s"
            existing = DBUtils.execute_query(check_query, (program_code,), fetch=True)
            if not existing:
                return {"success": False, "message": "Program not found."}

            # Check if any students are linked to this program
            student_check_query = "SELECT 1 FROM students WHERE program_code = %s LIMIT 1"
            linked_student = DBUtils.execute_query(student_check_query, (program_code,), fetch=True)
            if linked_student:
                return {
                    "success": False,
                    "message": "Cannot delete program: There are students enrolled in it."
                }

            # Safe to delete
            delete_query = "DELETE FROM programs WHERE program_code = %s"
            DBUtils.execute_query(delete_query, (program_code,), fetch=False)

            return {"success": True, "message": "Program deleted successfully."}

        except Exception as e:
            print("Error in delete_program:", e)
            return {"success": False, "message": "Database error while deleting program."}
