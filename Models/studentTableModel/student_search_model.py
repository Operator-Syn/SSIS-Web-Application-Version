from Models.db.db_utils import DBUtils

class StudentSearchModel:

    @staticmethod
    def search_students(query="", limit=20, offset=0, order_by="id_number", direction="ASC"):
        base_query = """
            FROM students s
            JOIN programs p ON s.program_code = p.program_code
            JOIN colleges c ON p.college_code = c.college_code
        """

        def build_where_clause(tokens, exact=False, prioritize_year=False):
            where_clauses = []
            params = []

            if prioritize_year and tokens.isdigit() and tokens in {"1","2","3","4"}:
                # Prioritize year_level exact match
                where_clauses.append("s.year_level::text = %s")
                params.append(tokens)

            if exact:
                where_clauses.append("""
                    s.id_number::text ILIKE %s OR
                    s.first_name ILIKE %s OR
                    s.middle_name ILIKE %s OR
                    s.last_name ILIKE %s OR
                    s.year_level::text ILIKE %s OR
                    p.program_name ILIKE %s OR
                    c.college_name ILIKE %s
                """)
                params.extend([f"%{tokens}%"]*7)
            else:
                token_list = tokens.split()
                for token in token_list:
                    token_like = f"%{token}%"
                    where_clauses.append("""
                        (
                            s.id_number::text ILIKE %s OR
                            s.first_name ILIKE %s OR
                            s.middle_name ILIKE %s OR
                            s.last_name ILIKE %s OR
                            s.year_level::text ILIKE %s OR
                            p.program_name ILIKE %s OR
                            c.college_name ILIKE %s
                        )
                    """)
                    params.extend([token_like]*7)
            return where_clauses, params

        # Step 1: Prioritize year_level if applicable
        prioritize_year = query.isdigit() and query in {"1","2","3","4"}

        # Step 2: Try exact phrase match
        where_clauses, params = build_where_clause(query, exact=True, prioritize_year=prioritize_year)
        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        count_query = f"SELECT COUNT(*) {base_query} {where_sql}"
        total_count_result = DBUtils.execute_query(count_query, params, fetch=True)
        total_count = total_count_result[0][0] if total_count_result else 0

        # Step 3: Fallback to tokenized search if no results
        if total_count == 0 and query:
            where_clauses, params = build_where_clause(query, exact=False, prioritize_year=prioritize_year)
            where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
            count_query = f"SELECT COUNT(*) {base_query} {where_sql}"
            total_count_result = DBUtils.execute_query(count_query, params, fetch=True)
            total_count = total_count_result[0][0] if total_count_result else 0

        # Step 4: Fetch paginated rows
        data_query = f"""
            SELECT
                s.id_number,
                s.first_name,
                s.middle_name,
                s.last_name,
                s.gender,
                s.year_level,
                p.program_name AS program_name,
                c.college_name AS college_name
            {base_query}
            {where_sql}
            ORDER BY {order_by} {direction}
            LIMIT %s OFFSET %s
        """
        rows = DBUtils.execute_query(data_query, params + [limit, offset], fetch=True)

        result_rows = []
        for r in rows:
            result_rows.append({
                "id_number": r[0],
                "first_name": r[1],
                "middle_name": r[2],
                "last_name": r[3],
                "gender": r[4],
                "year_level": r[5],
                "program_name": r[6],
                "college_name": r[7],
            })

        return total_count, result_rows
