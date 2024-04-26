from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from config import get_env_variable

# ASYNC_DB_URL = "mysql+aiomysql://root@db:3306/demo?charset=utf8"

MYSQL_USER = get_env_variable("MYSQL_USER")
MYSQL_PASSWORD = get_env_variable("MYSQL_PASSWORD")
MYSQL_DATABASE = get_env_variable("MYSQL_DATABASE")
HOST = "db"  # DockerのDBサービス名

ASYNC_DB_URL = f'mysql+aiomysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{HOST}/{MYSQL_DATABASE}'

async_engine = create_async_engine(ASYNC_DB_URL, echo=True)
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
)

Base = declarative_base()

async def get_db():
    async with async_session() as session:
        yield session