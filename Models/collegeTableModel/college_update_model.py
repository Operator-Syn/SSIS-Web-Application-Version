from Models.db.db_utils import DBUtils

class CollegeUpdateModel:

    @staticmethod
    def update_college(college_code: str, new_college_name: str):
        """
        Updates an existing college record in the database.

        Args:
            college_code (str): The unique code of the college to update.
            new_college_name (str): The new name for the college.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not college_code or not new_college_name:
            return {"success": False, "message": "College code and new name are required."}

        try:
            # Check if the college exists
            check_query = "SELECT 1 FROM colleges WHERE college_code = %s"
            existing = DBUtils.execute_query(check_query, (college_code,), fetch=True)
            if not existing:
                return {"success": False, "message": "College not found."}

            # Update the college name
            update_query = """
                UPDATE colleges
                SET college_name = %s
                WHERE college_code = %s
            """
            DBUtils.execute_query(update_query, (new_college_name, college_code), fetch=False)
            return {"success": True, "message": "College updated successfully."}

        except Exception as e:
            print("Error in update_college:", e)
            return {"success": False, "message": "Database error while updating college."}
