import React from 'react';
import WeaponIcon from './WeaponIcon';

export default function PlayerBar({ players, team, spectatedId }) {
  const isCT = team === 'CT';
  
  return (
    <div className={`player-bar ${isCT ? 'team-ct' : 'team-t'}`}>
      {players.map((player, idx) => {
        const isDead = player.state?.health === 0;
        const isSpectated = player.steamid === spectatedId;
        const hp = player.state?.health || 0;
        const armor = player.state?.armor || 0;
        const hasHelmet = player.state?.helmet || false;
        const money = player.state?.money || 0;
        const equipValue = player.state?.equip_value || 0;
        const activeWeapon = getActiveWeapon(player.weapons);
        
        return (
          <div 
            key={player.steamid || idx}
            className={`player-card ${isDead ? 'dead' : ''} ${isSpectated ? 'spectated' : ''}`}
          >
            <div className="card-header">
              <div className="avatar">
                <span className="avatar-initial">{player.name?.[0] || '?'}</span>
              </div>
              <div className={`hp-text ${hp <= 20 ? 'low' : ''}`}>
                {isDead ? '0' : hp}
              </div>
            </div>
            
            <div className="player-name">{player.name || `Player ${idx+1}`}</div>
            
            <div className="stats-row">
              <span className="stat-item" title="装备价值">
                🛡️ {equipValue}
              </span>
            </div>
            
            <div className="money-row">
              <span className="armor-icon" title={hasHelmet ? '头盔+护甲' : '护甲'}>
                {hasHelmet ? '🪖' : '🛡️'}
              </span>
              <span className="money">${money}</span>
            </div>
            
            <div className="weapon-row">
              <WeaponIcon weaponName={activeWeapon} />
              <span className="weapon-name">{formatWeaponName(activeWeapon)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getActiveWeapon(weapons) {
  if (!weapons) return 'Unknown';
  const active = Object.values(weapons).find(w => w.state === 'active');
  return active?.name?.replace('weapon_', '') || 'Unknown';
}

function formatWeaponName(name) {
  const map = {
    'ak47': 'AK-47',
    'm4a1': 'M4A1-S',
    'm4a1_silencer': 'M4A1-S',
    'm4a4': 'M4A4',
    'awp': 'AWP',
    'deagle': 'Deagle',
    'usp_silencer': 'USP-S',
    'glock': 'Glock',
    'p250': 'P250',
    'tec9': 'Tec-9',
    'mp9': 'MP9',
    'ump45': 'UMP-45',
    'p90': 'P90',
    'nova': 'Nova',
    'xm1014': 'XM1014',
    'ssg08': 'SSG 08',
    'scar20': 'SCAR-20',
    'famas': 'FAMAS',
    'galilar': 'Galil AR',
    'aug': 'AUG',
    'sg556': 'SG 553',
    'mac10': 'MAC-10',
    'mp7': 'MP7',
    'mp5sd': 'MP5-SD',
    'bizon': 'PP-Bizon',
    'negev': 'Negev',
    'm249': 'M249',
    'sawedoff': 'Sawed-Off',
    'mag7': 'MAG-7',
    'hkp2000': 'P2000',
    'cz75a': 'CZ75-Auto',
    'fiveseven': 'Five-SeveN',
    'elite': 'Dual Berettas',
    'revolver': 'R8 Revolver',
    'knife': 'Knife',
    'hegrenade': 'HE Grenade',
    'flashbang': 'Flashbang',
    'smokegrenade': 'Smoke',
    'molotov': 'Molotov',
    'incgrenade': 'Incendiary',
    'decoy': 'Decoy',
    'taser': 'Zeus',
    'c4': 'C4',
  };
  return map[name] || name.toUpperCase();
}
