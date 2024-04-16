from fastapi import FastAPI, Request
from sse_starlette.sse import EventSourceResponse
from typing import AsyncGenerator
import asyncio
import time

app = FastAPI()

connected_members = {}
last_connection_time = {}

async def member_events(request: Request) -> AsyncGenerator:
    client_id = request.headers.get("X-Client-ID")
    connected_members[client_id] = {"last_ping": time.time()}
    last_connection_time[client_id] = time.time()

    try:
        while True:
            if await request.is_disconnected():
                break

            # クライアントからのメッセージを処理する
            if request.headers.get("X-Event") == "ping":
                last_connection_time[client_id] = time.time()

            # 切断されたメンバーをチェックする
            current_time = time.time()
            disconnected_members = [
                member_id
                for member_id, last_time in last_connection_time.items()
                if current_time - last_time > 10  # 10秒以上接続がない場合は切断とみなす
            ]
            for member_id in disconnected_members:
                del connected_members[member_id]
                del last_connection_time[member_id]
                yield {"event": "member-left", "data": member_id}

            await asyncio.sleep(1)

    except asyncio.CancelledError:
        pass

    finally:
        del connected_members[client_id]
        del last_connection_time[client_id]
        yield {"event": "member-left", "data": client_id}