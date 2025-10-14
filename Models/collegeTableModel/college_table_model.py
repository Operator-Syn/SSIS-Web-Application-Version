from Models.db.db_utils import DBUtils

class CollegeModel:
    column_map = {
        "college_code": "c.college_code",
        "college_name": "c.college_name",
    }

    @staticmethod
    def get_colleges(order_by="college_code", direction="ASC", limit=20, offset=0, filters={}):
        base_query = """
            SELECT 
                c.college_code,
                c.college_name
            FROM colleges c
        """
        where_clauses = []
        values = []

        for key, value in filters.items():
            if key in CollegeModel.column_map:
                where_clauses.append(f"{CollegeModel.column_map[key]} = %s")
                values.append(value)

        if where_clauses:
            base_query += " WHERE " + " AND ".join(where_clauses)

        order_column = CollegeModel.column_map.get(order_by, "c.college_code")
        base_query += f" ORDER BY {order_column} {direction} LIMIT %s OFFSET %s"
        values.extend([limit, offset])

        rows = DBUtils.execute_query(base_query, tuple(values), fetch=True)
        columns = list(CollegeModel.column_map.keys())
        return [dict(zip(columns, row)) for row in rows]

    @staticmethod
    def get_count(filters={}):
        base_query = "SELECT COUNT(*) FROM colleges c"
        where_clauses = []
        values = []

        for key, value in filters.items():
            if key in CollegeModel.column_map:
                where_clauses.append(f"{CollegeModel.column_map[key]} = %s")
                values.append(value)

        if where_clauses:
            base_query += " WHERE " + " AND ".join(where_clauses)

        return DBUtils.execute_query(base_query, tuple(values), fetch=True)[0][0]
