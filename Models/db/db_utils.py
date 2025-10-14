from .db_connection import DatabaseConnection

class DBUtils:
    @staticmethod
    def execute_query(query, params=None, fetch=False):
        db = DatabaseConnection()
        conn = None
        try:
            conn = db.get_conn()
            cur = conn.cursor()
            cur.execute(query, params or ())
            
            result = cur.fetchall() if fetch else None
            conn.commit()
            cur.close()
            return result
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                db.put_conn(conn)
