from Models.db.db_utils import DBUtils
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = DBUtils()

class UserModel:
    @staticmethod
    def create_user(username: str, password: str):
        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        query = "INSERT INTO users (username, password_hash) VALUES (%s, %s)"
        db.execute_query(query, (username, password_hash))

    @staticmethod
    def get_user_by_username(username: str):
        query = "SELECT username, password_hash FROM users WHERE username = %s"
        result = db.execute_query(query, (username,), fetch=True)
        return result[0] if result else None

    @staticmethod
    def check_password(password: str, password_hash: str):
        return bcrypt.check_password_hash(password_hash, password)
