import React, { useState, useEffect, useCallback } from 'react';
import Scoreboard from './components/Scoreboard';
import PlayerBar from './components/PlayerBar';
import KillFeed from './components/KillFeed';
import SpectatorInfo from './components/SpectatorInfo';
import { useGSI } from './hooks/useGSI';
import './styles/broadcast.css';

export default function BroadcastHUD() {
  const gameState = useGSI();
  const [killFeed, setKillFeed] = useState([]);

  // 击杀检测逻辑
  useEffect(() => {
    if (!gameState?.previous?.allplayers || !gameState?.allplayers) return;
    
    const prev = gameState.previous.allplayers;
    const curr = gameState.allplayers;
    
    Object.entries(curr).forEach(([steamid, player]) => {
      const prevPlayer = prev[steamid];
      if (!prevPlayer) return;
      
      // Kills 增加 = 击杀了人
      if ((player.state?.round_kills || 0) > (prevPlayer.state?.round_kills || 0)) {
        // 找到刚死的玩家
        Object.entries(prev).forEach(([vid, victim]) => {
          const currVictim = curr[vid];
          if (currVictim?.state?.health === 0 && victim.state?.health > 0) {
            addKillFeed({
              killer: { name: player.name, team: player.team },
              victim: { name: victim.name, team: victim.team },
              weapon: getActiveWeapon(player.weapons),
              headshot: player.state?.round_killhs > prevPlayer.state?.round_killhs
            });
          }
        });
      }
    });
  }, [gameState]);

  const addKillFeed = useCallback((kill) => {
    setKillFeed(prev => [...prev.slice(-4), { ...kill, id: Date.now() }]);
    setTimeout(() => {
      setKillFeed(prev => prev.filter(k => k.id !== kill.id));
    }, 5000);
  }, []);

  if (!gameState) {
    return <div className="hud-waiting">等待 GSI 数据...</div>;
  }

  const { map, player, allplayers, phase_countdowns, bomb } = gameState;
  const ctPlayers = Object.values(allplayers || {}).filter(p => p.team === 'CT');
  const tPlayers = Object.values(allplayers || {}).filter(p => p.team === 'T');
  
  // 当前观察者目标
  const spectatedId = player?.steamid;
  const spectatedPlayer = allplayers?.[spectatedId];

  return (
    <div className="broadcast-hud">
      <Scoreboard 
        map={map} 
        phaseCountdowns={phase_countdowns}
        bomb={bomb}
      />
      <KillFeed kills={killFeed} />
      <div className="player-bars-wrapper">
        <PlayerBar 
          players={ctPlayers} 
          team="CT" 
          spectatedId={spectatedId}
        />
        <SpectatorInfo player={spectatedPlayer} />
        <PlayerBar 
          players={tPlayers} 
          team="T" 
          spectatedId={spectatedId}
        />
      </div>
    </div>
  );
}

function getActiveWeapon(weapons) {
  if (!weapons) return 'Unknown';
  const active = Object.values(weapons).find(w => w.state === 'active');
  return active?.name?.replace('weapon_', '') || 'Unknown';
}
