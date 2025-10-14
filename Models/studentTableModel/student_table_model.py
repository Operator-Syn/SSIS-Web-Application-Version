from Models.db.db_utils import DBUtils

class StudentModel:
    column_map = {
        "id_number": "s.id_number",
        "first_name": "s.first_name",
        "middle_name": "s.middle_name",
        "last_name": "s.last_name",
        "gender": "s.gender",
        "year_level": "s.year_level",
        "program_name": "p.program_name",
        "college_name": "c.college_name",
        "program_code": "s.program_code",
    }

    @staticmethod
    def get_students(order_by="id_number", direction="ASC", limit=20, offset=0, filters={}):
        base_query = """
            SELECT 
                s.id_number,
                s.first_name,
                s.middle_name,
                s.last_name,
                s.gender,
                s.year_level,
                p.program_name,
                c.college_name,
                s.program_code
            FROM students s
            JOIN programs p ON s.program_code = p.program_code
            JOIN colleges c ON p.college_code = c.college_code
        """
        where_clauses = []
        values = []

        for key, value in filters.items():
            if key in StudentModel.column_map:
                where_clauses.append(f"{StudentModel.column_map[key]} = %s")
                values.append(value)

        if where_clauses:
            base_query += " WHERE " + " AND ".join(where_clauses)

        order_column = StudentModel.column_map.get(order_by, "s.id_number")
        base_query += f" ORDER BY {order_column} {direction} LIMIT %s OFFSET %s"
        values.extend([limit, offset])

        rows = DBUtils.execute_query(base_query, tuple(values), fetch=True)
        columns = list(StudentModel.column_map.keys())
        return [dict(zip(columns, row)) for row in rows]

    @staticmethod
    def get_count(filters={}):
        base_query = """
            SELECT COUNT(*)
            FROM students s
            JOIN programs p ON s.program_code = p.program_code
            JOIN colleges c ON p.college_code = c.college_code
        """
        where_clauses = []
        values = []

        for key, value in filters.items():
            if key in StudentModel.column_map:
                where_clauses.append(f"{StudentModel.column_map[key]} = %s")
                values.append(value)

        if where_clauses:
            base_query += " WHERE " + " AND ".join(where_clauses)

        return DBUtils.execute_query(base_query, tuple(values), fetch=True)[0][0]
