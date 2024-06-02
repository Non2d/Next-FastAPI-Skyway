from fastapi import APIRouter, Request, HTTPException
from db import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any
import schemas.room as room_schema
import cruds.room as room_crud
from fastapi.responses import StreamingResponse
import time, json, uuid, jwt, os, httpx
from dotenv import load_dotenv

load_dotenv("../.env")

router = APIRouter()

#Server sent eventで，1秒ごとにルームの情報を返す
@router.get("/rooms/sse", response_model=Any)
async def rooms_sse(request: Request):
    event_generator = event_stream(10) #引数は普通に渡せるけど，まぁ初期値よね
    return generate_token()
    return StreamingResponse(event_generator, media_type="text/event-stream")

def event_stream(initial:int):
    count = initial
    response = {"count": count, "members":["Tarou", "Jirou", "Saburou"]}
    while True:
        response["count"]=count
        yield f"data: {json.dumps(response)}\n\n"
        count += 1
        time.sleep(1)  # 1秒ごとにメッセージを送信

def generate_token():
    payload = {
        "iat": int(time.time()),  # 現在のUNIXタイムスタンプ
        "jti": str(uuid.uuid4()),  # ランダムなUUID
        "exp": int(time.time()) + 60 * 60 * 24 * 7,  # 1週間後のUNIXタイムスタンプ
        "appId": "79fb69d3-5b84-44d9-9db9-d65aeb4caca4"  # アプリケーションID
    }

    SECRET_KEY = "an6nwOtf3zy72XdoaEZsX+5c6afhtiLGIq6LwbKIxuY="  # シークレットキー
    token = jwt.encode(payload, SECRET_KEY)
    return token

@router.post("/find-channel/")
async def find_channel(channel_id: str = None):
    url = "https://channel.skyway.ntt.com/v1/json-rpc"
    TOKEN = generate_token()
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTcxNDQ4NzUsImp0aSI6IjIwMDkyYzhkLWY1ZTgtNDRiOS1hZGFlLWEyNzkzYmRiY2Q0NCIsImV4cCI6MTcxNzc0OTY3NSwiYXBwSWQiOiI3OWZiNjlkMy01Yjg0LTQ0ZDktOWRiOS1kNjVhZWI0Y2FjYTQifQ.1Wk8PtSvlYbWBvUDDuUpuUTfc7bEQ74lIxtjjLcRvjY",  # トークンを適切なものに置き換えてください
        "Content-Type": "application/json"
    }
    json_body = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "findChannel",
        "params": {
            "id": channel_id
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=json_body)
        response_data = response.json()

    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response_data)
    
    return response_data

# @router.post("/find-channel/")
# async def find_channel(channel_id: str = None, channel_name: str = None):
#     url = "https://channel.skyway.ntt.com/v1/json-rpc"
#     headers = {
#         "Authorization": "Bearer YOUR_SKYWAY_ADMIN_AUTH_TOKEN",  # トークンを適切なものに置き換えてください
#         "Content-Type": "application/json"
#     }
#     json_body = {
#         "jsonrpc": "2.0",
#         "id": 0,
#         "method": "findChannel",
#         "params": {}
#     }

#     if channel_id:
#         json_body["params"]["id"] = channel_id
#     elif channel_name:
#         json_body["params"]["name"] = channel_name
#     else:
#         raise HTTPException(status_code=400, detail="Either channel_id or channel_name must be provided")

#     async with httpx.AsyncClient() as client:
#         response = await client.post(url, headers=headers, json=json_body)
#         response_data = response.json()

#     if response.is_error:
#         raise HTTPException(status_code=response.status_code, detail=response_data)

#     return response_data