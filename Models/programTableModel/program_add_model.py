# Models/programs/ProgramAddModel.py
from Models.db.db_utils import DBUtils

class ProgramAddModel:
    @staticmethod
    def add_program(program_code: str, program_name: str, college_code: str):
        """
        Adds a new program record to the database.

        Args:
            program_code (str): Unique code for the program.
            program_name (str): Descriptive name of the program.
            college_code (str): Code of the college this program belongs to.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not program_code or not program_name or not college_code:
            return {"success": False, "message": "Program code, name, and college code are required."}

        try:
            # Check if the referenced college exists
            college_check_query = "SELECT 1 FROM colleges WHERE college_code = %s"
            college_exists = DBUtils.execute_query(college_check_query, (college_code,), fetch=True)
            if not college_exists:
                return {"success": False, "message": f"College with code '{college_code}' not found."}

            # Check if the program code already exists
            duplicate_query = "SELECT 1 FROM programs WHERE program_code = %s"
            duplicate_exists = DBUtils.execute_query(duplicate_query, (program_code,), fetch=True)
            if duplicate_exists:
                return {"success": False, "message": f"Program with code '{program_code}' already exists."}

            # Insert new program
            insert_query = """
                INSERT INTO programs (program_code, program_name, college_code)
                VALUES (%s, %s, %s)
            """
            DBUtils.execute_query(insert_query, (program_code, program_name, college_code), fetch=False)
            return {"success": True, "message": "Program added successfully."}

        except Exception as e:
            print("Error in add_program:", e)
            return {"success": False, "message": "Database error while adding program."}
