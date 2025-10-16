from Models.db.db_utils import DBUtils

class CollegeAddModel:

    @staticmethod
    def add_college(college_code: str, college_name: str):
        """
        Inserts a new college record into the database.

        Args:
            college_code (str): The unique code for the college (PRIMARY KEY).
            college_name (str): The official name of the college.

        Returns:
            dict: {
                "success": bool,
                "message": str
            }
        """
        if not college_code or not college_name:
            return {"success": False, "message": "College code and name are required."}

        try:
            # Check if the college already exists
            check_query = "SELECT 1 FROM colleges WHERE college_code = %s"
            existing = DBUtils.execute_query(check_query, (college_code,), fetch=True)
            if existing:
                return {"success": False, "message": "College code already exists."}

            # Insert new college
            insert_query = """
                INSERT INTO colleges (college_code, college_name)
                VALUES (%s, %s)
            """
            DBUtils.execute_query(insert_query, (college_code, college_name), fetch=False)
            return {"success": True, "message": "College added successfully."}

        except Exception as e:
            print("Error in add_college:", e)
            return {"success": False, "message": "Database error while adding college."}
