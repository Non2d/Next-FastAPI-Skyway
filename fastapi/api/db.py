from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from config import get_env_variable
import os

# "mysql+aiomysql://root@db:3306/demo?charset=utf8"
MYSQL_USER = get_env_variable("MYSQL_USER")
MYSQL_PASSWORD = get_env_variable("MYSQL_PASSWORD")
MYSQL_DATABASE = get_env_variable("MYSQL_DATABASE")
HOST = "db"  # DockerのDBサービス名

print("Hey")
print(MYSQL_DATABASE)

ASYNC_DB_URL = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{HOST}/{MYSQL_DATABASE}'

print(ASYNC_DB_URL)

# async_engine = create_async_engine(ASYNC_DB_URL, echo=True)
# async_session = sessionmaker(
#     autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
# )

async def create_engine_with_retry(max_retries=5, delay=3):
    retries = 0
    while retries < max_retries:
        try:
            async_engine = create_async_engine(ASYNC_DB_URL, echo=True)
            async_session = sessionmaker(
                autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
            )
            return async_engine, async_session
        except OperationalError as e:
            retries += 1
            print(f"Failed to connect to MySQL (retry {retries}/{max_retries}): {e}")
            await asyncio.sleep(delay)
    raise OperationalError(f"Failed to connect to MySQL after {max_retries} retries")

Base = declarative_base()

async def get_db():
    async_engine, async_session = await create_engine_with_retry()
    async with async_session() as session:
        yield session