# from typing import List
# import schemas.task as task_schema #import api.schemas.taskだとエラーになる

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession

# from sse import member_events
# from sse_starlette.sse import EventSourceResponse

# from fastapi import Request

# router = APIRouter()

# @router.get("/api/member-events")
# async def sse_endpoint(request: Request):
#     event_generator = member_events(request)
#     return EventSourceResponse(event_generator)