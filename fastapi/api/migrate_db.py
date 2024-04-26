import time
from sqlalchemy import create_engine
from models.task import Base
from config import get_env_variable

# DB_URL = "mysql+pymysql://root@db:3306/demo?charset=utf8" #demoデータベース

MYSQL_USER = get_env_variable("MYSQL_USER")
MYSQL_PASSWORD = get_env_variable("MYSQL_PASSWORD")
MYSQL_DATABASE = get_env_variable("MYSQL_DATABASE")
HOST = "db"  # DockerのDBサービス名

DB_URL = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{HOST}/{MYSQL_DATABASE}'

engine = create_engine(DB_URL, echo=True)

def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    time.sleep(5)  # Wait for 5 seconds before trying to connect to the database
    reset_database()