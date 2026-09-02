import React from 'react';

export default function Scoreboard({ map, phaseCountdowns, bomb }) {
  if (!map) return null;
  
  const ct = map.team_ct;
  const t = map.team_t;
  const round = map.round || 0;
  const maxRounds = map.num_matches_to_win_series * 2 || 24;
  
  // 时间格式化
  let timeText = '--:--';
  let phaseText = '';
  
  if (phaseCountdowns) {
    const phase = phaseCountdowns.phase;
    const time = Math.ceil(phaseCountdowns.phase_ends_in || 0);
    
    if (phase === 'warmup') phaseText = '热身';
    else if (phase === 'freezetime') phaseText = '冻结';
    else if (phase === 'live') {
      phaseText = '回合中';
      const m = Math.floor(time / 60);
      const s = time % 60;
      timeText = `${m}:${s.toString().padStart(2, '0')}`;
    }
    else if (phase === 'over') phaseText = '回合结束';
    else if (phase === 'bomb') {
      phaseText = '炸弹';
      timeText = time.toString();
    }
    else if (phase === 'defuse') phaseText = '拆弹';
  }
  
  // 炸弹状态
  const bombPlanted = bomb?.state === 'planted';
  const bombTime = bomb?.countdown || 0;

  return (
    <div className="scoreboard-top">
      <div className="team-side ct">
        <span className="team-name">{ct?.name || 'COUNTER-TERRORISTS'}</span>
        <span className="score">{ct?.score || 0}</span>
      </div>
      
      <div className="match-center">
        <div className="round-info">ROUND {round} / {maxRounds}</div>
        <div className={`timer ${bombPlanted ? 'bomb-active' : ''}`}>
          {bombPlanted ? `💣 ${bombTime.toFixed(1)}` : timeText}
        </div>
        <div className="phase-text">{phaseText}</div>
      </div>
      
      <div className="team-side t">
        <span className="score">{t?.score || 0}</span>
        <span className="team-name">{t?.name || 'TERRORISTS'}</span>
      </div>
    </div>
  );
}
