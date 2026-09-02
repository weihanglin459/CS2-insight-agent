import { useState, useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:8000/ws/hud';

export function useGSI() {
  const [gameState, setGameState] = useState(null);
  const prevStateRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[HUD] WebSocket 已连接');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // 保存上一帧用于击杀检测
          const enriched = {
            ...data,
            previous: prevStateRef.current
          };
          prevStateRef.current = data;
          setGameState(enriched);
        } catch (e) {
          console.error('[HUD] 数据解析失败:', e);
        }
      };

      ws.onclose = () => {
        console.log('[HUD] WebSocket 断开，5秒后重连...');
        setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error('[HUD] WebSocket 错误:', err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return gameState;
}
