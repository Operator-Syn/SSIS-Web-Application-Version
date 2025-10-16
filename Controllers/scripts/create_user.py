from Models.db.db_utils import DBUtils
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = DBUtils()

def create_user(username: str, password: str):
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    query = "INSERT INTO users (username, password_hash) VALUES (%s, %s)"
    db.execute_query(query, (username, password_hash))

# Example
create_user("Brad", "nigga")
