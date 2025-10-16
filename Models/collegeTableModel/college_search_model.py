from Models.db.db_utils import DBUtils

class CollegeSearchModel:

    @staticmethod
    def search_colleges(query="", limit=20, offset=0, order_by="college_code", direction="ASC"):
        base_query = "FROM colleges c"

        def build_where_clause(tokens, exact=False):
            where_clauses = []
            params = []
            if not tokens.strip():
                return where_clauses, params
            if exact:
                where_clauses.append("(c.college_code ILIKE %s OR c.college_name ILIKE %s)")
                params.extend([f"%{tokens}%", f"%{tokens}%"])
            else:
                for token in tokens.split():
                    token_like = f"%{token}%"
                    where_clauses.append("(c.college_code ILIKE %s OR c.college_name ILIKE %s)")
                    params.extend([token_like, token_like])
            return where_clauses, params

        # Step 1: Exact search
        where_clauses, params = build_where_clause(query, exact=True)
        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        count_query = f"SELECT COUNT(*) {base_query} {where_sql}"
        total_count_result = DBUtils.execute_query(count_query, tuple(params), fetch=True)
        total_count = total_count_result[0][0] if total_count_result else 0

        # Step 2: Fallback to tokenized search
        if total_count == 0 and query.strip():
            where_clauses, params = build_where_clause(query, exact=False)
            where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
            count_query = f"SELECT COUNT(*) {base_query} {where_sql}"
            total_count_result = DBUtils.execute_query(count_query, tuple(params), fetch=True)
            total_count = total_count_result[0][0] if total_count_result else 0

        # Step 3: Fetch paginated rows
        order_column = {"college_code": "c.college_code", "college_name": "c.college_name"}.get(order_by, "c.college_code")
        data_query = f"""
            SELECT c.college_code, c.college_name
            {base_query}
            {where_sql}
            ORDER BY {order_column} {direction}
            LIMIT %s OFFSET %s
        """
        rows = DBUtils.execute_query(data_query, tuple(params + [limit, offset]), fetch=True)
        result_rows = [{"college_code": r[0], "college_name": r[1]} for r in rows]

        return total_count, result_rows
