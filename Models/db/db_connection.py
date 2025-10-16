import psycopg2
from psycopg2 import pool
from config import Config

class DatabaseConnection:
    _instance = None
    _pool = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_pool()
        return cls._instance

    def _init_pool(self):
        try:
            print(f"Connecting to database {Config.DB_NAME} at {Config.DB_HOST}:{Config.DB_PORT} as {Config.DB_USER}")
            self._pool = psycopg2.pool.SimpleConnectionPool(
                1, 25,
                database=Config.DB_NAME,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                host=Config.DB_HOST,
                port=Config.DB_PORT
            )
            print("Connection pool created successfully.")
        except Exception as e:
            print("Error initializing connection pool:", e)
            self._pool = None

    def get_conn(self):
        if not self._pool:
            raise ConnectionError("Connection pool not initialized.")
        return self._pool.getconn()

    def put_conn(self, conn):
        if self._pool:
            self._pool.putconn(conn)

    def close_all(self):
        if self._pool:
            self._pool.closeall()
