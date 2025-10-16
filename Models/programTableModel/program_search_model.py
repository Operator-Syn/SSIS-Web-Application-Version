from Models.db.db_utils import DBUtils

class ProgramSearchModel:

    @staticmethod
    def search_programs(query="", limit=20, offset=0, order_by="program_code", direction="ASC"):
        base_query = """
            FROM programs p
            JOIN colleges c ON p.college_code = c.college_code
        """

        def build_where_clause(tokens, exact=False):
            where_clauses = []
            params = []
            if not tokens.strip():
                return where_clauses, params

            if exact:
                where_clauses.append("""
                    (p.program_code ILIKE %s 
                     OR p.program_name ILIKE %s 
                     OR c.college_name ILIKE %s)
                """)
                params.extend([f"%{tokens}%", f"%{tokens}%", f"%{tokens}%"])
            else:
                for token in tokens.split():
                    token_like = f"%{token}%"
                    where_clauses.append("""
                        (p.program_code ILIKE %s 
                         OR p.program_name ILIKE %s 
                         OR c.college_name ILIKE %s)
                    """)
                    params.extend([token_like, token_like, token_like])
            return where_clauses, params

        # Step 1: Try exact match first
        where_clauses, params = build_where_clause(query, exact=True)
        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        count_query = f"SELECT COUNT(*) {base_query} {where_sql}"
        total_count_result = DBUtils.execute_query(count_query, tuple(params), fetch=True)
        total_count = total_count_result[0][0] if total_count_result else 0

        # Step 2: If no exact matches, try tokenized search
        if total_count == 0 and query.strip():
            where_clauses, params = build_where_clause(query, exact=False)
            where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
            count_query = f"SELECT COUNT(*) {base_query} {where_sql}"
            total_count_result = DBUtils.execute_query(count_query, tuple(params), fetch=True)
            total_count = total_count_result[0][0] if total_count_result else 0

        # Step 3: Fetch paginated results
        order_column = {
            "program_code": "p.program_code",
            "program_name": "p.program_name",
            "college_name": "c.college_name"
        }.get(order_by, "p.program_code")

        data_query = f"""
            SELECT 
                p.program_code,
                p.program_name,
                c.college_name
            {base_query}
            {where_sql}
            ORDER BY {order_column} {direction}
            LIMIT %s OFFSET %s
        """

        rows = DBUtils.execute_query(data_query, tuple(params + [limit, offset]), fetch=True)
        result_rows = [
            {
                "program_code": r[0],
                "program_name": r[1],
                "college_name": r[2]
            }
            for r in rows
        ]

        return total_count, result_rows
