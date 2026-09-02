from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List
import asyncio
import json

router = APIRouter()

# 存储当前 GSI 状态
_current_gsi_state: Dict[str, Any] = {}
_hud_clients: List[WebSocket] = []

@router.post("/api/gsi/hud")
async def gsi_hud_sink(payload: Dict[str, Any]):
    """接收 GSI 数据并广播给所有 HUD WebSocket 客户端"""
    global _current_gsi_state
    _current_gsi_state = payload
    
    # 广播给所有连接的 HUD 客户端
    dead_clients = []
    for client in _hud_clients:
        try:
            await client.send_json(payload)
        except Exception:
            dead_clients.append(client)
    
    # 清理断开的客户端
    for client in dead_clients:
        if client in _hud_clients:
            _hud_clients.remove(client)
    
    return {"status": "ok"}

@router.websocket("/ws/hud")
async def hud_websocket(websocket: WebSocket):
    await websocket.accept()
    _hud_clients.append(websocket)
    
    # 发送当前状态（如果有）
    if _current_gsi_state:
        await websocket.send_json(_current_gsi_state)
    
    try:
        while True:
            # 保持连接存活，接收心跳
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        if websocket in _hud_clients:
            _hud_clients.remove(websocket)
    except Exception:
        if websocket in _hud_clients:
            _hud_clients.remove(websocket)
