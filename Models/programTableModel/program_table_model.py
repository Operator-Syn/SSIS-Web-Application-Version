from Models.db.db_utils import DBUtils

class ProgramModel:
    column_map = {
        "program_code": "p.program_code",
        "program_name": "p.program_name",
        "college_code": "p.college_code",
        "college_name": "c.college_name"
    }

    @staticmethod
    def get_programs(order_by="program_code", direction="ASC", limit=5, offset=0, filters={}):
        base_query = """
            SELECT
                p.program_code,
                p.program_name,
                p.college_code,
                c.college_name
            FROM programs p
            JOIN colleges c ON p.college_code = c.college_code
        """
        where_clauses = []
        values = []

        # Apply filters based on column_map
        for key, value in filters.items():
            if key in ProgramModel.column_map:
                where_clauses.append(f"{ProgramModel.column_map[key]} = %s")
                values.append(value)

        if where_clauses:
            base_query += " WHERE " + " AND ".join(where_clauses)

        order_column = ProgramModel.column_map.get(order_by, "p.program_code")
        base_query += f" ORDER BY {order_column} {direction} LIMIT %s OFFSET %s"
        values.extend([limit, offset])

        rows = DBUtils.execute_query(base_query, tuple(values), fetch=True)
        columns = list(ProgramModel.column_map.keys())
        return [dict(zip(columns, row)) for row in rows]

    @staticmethod
    def get_count(filters={}):
        base_query = "SELECT COUNT(*) FROM programs p"
        where_clauses = []
        values = []

        for key, value in filters.items():
            if key in ProgramModel.column_map:
                where_clauses.append(f"{ProgramModel.column_map[key]} = %s")
                values.append(value)

        if where_clauses:
            base_query += " WHERE " + " AND ".join(where_clauses)

        return DBUtils.execute_query(base_query, tuple(values), fetch=True)[0][0]
