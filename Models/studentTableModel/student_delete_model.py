from Models.db.db_utils import DBUtils

class StudentDeleteModel:

    @staticmethod
    def delete_student(id_number: str):
        """
        Deletes an existing student record from the database.

        Args:
            id_number (str): The unique ID number of the student to delete.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not id_number:
            return {"success": False, "message": "Student ID number is required."}

        try:
            # Check if the student exists
            check_query = "SELECT 1 FROM students WHERE id_number = %s"
            existing = DBUtils.execute_query(check_query, (id_number,), fetch=True)
            if not existing:
                return {"success": False, "message": "Student not found."}

            # Safe to delete
            delete_query = "DELETE FROM students WHERE id_number = %s"
            DBUtils.execute_query(delete_query, (id_number,), fetch=False)

            return {"success": True, "message": "Student deleted successfully."}

        except Exception as e:
            print("Error in delete_student:", e)
            return {"success": False, "message": "Database error while deleting student."}
