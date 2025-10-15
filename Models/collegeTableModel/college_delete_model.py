from Models.db.db_utils import DBUtils

class CollegeDeleteModel:

    @staticmethod
    def delete_college(college_code: str):
        """
        Deletes an existing college record from the database.

        Args:
            college_code (str): The unique code of the college to delete.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not college_code:
            return {"success": False, "message": "College code is required."}

        try:
            # Check if the college exists
            check_query = "SELECT 1 FROM colleges WHERE college_code = %s"
            existing = DBUtils.execute_query(check_query, (college_code,), fetch=True)
            if not existing:
                return {"success": False, "message": "College not found."}

            # Delete the college
            delete_query = "DELETE FROM colleges WHERE college_code = %s"
            DBUtils.execute_query(delete_query, (college_code,), fetch=False)

            return {"success": True, "message": "College deleted successfully."}

        except Exception as e:
            print("Error in delete_college:", e)
            return {"success": False, "message": "Database error while deleting college."}
