import React from 'react';
import WeaponIcon from './WeaponIcon';

export default function SpectatorInfo({ player }) {
  if (!player) return <div className="spectator-card empty" />;
  
  const state = player.state || {};
  const weapons = player.weapons || {};
  const activeWeapon = Object.values(weapons).find(w => w.state === 'active');
  const ammoClip = activeWeapon?.ammo_clip || 0;
  const ammoReserve = activeWeapon?.ammo_clip_max ? 
    (activeWeapon?.ammo_reserve || 0) : 0;
  
  return (
    <div className="spectator-card">
      <div className="spectator-header">
        <span className="spec-name">{player.name}</span>
        <span className={`spec-hp ${state.health <= 20 ? 'low' : ''}`}>
          {state.health || 0} HP
        </span>
      </div>
      <div className="spec-stats">
        <div className="spec-stat">
          <span className="label">K</span>
          <span className="value">{state.round_kills || 0}</span>
        </div>
        <div className="spec-stat">
          <span className="label">A</span>
          <span className="value">{state.round_killhs || 0}</span>
        </div>
        <div className="spec-stat">
          <span className="label">D</span>
          <span className="value">{state.armor || 0}</span>
        </div>
      </div>
      <div className="spec-weapon">
        <WeaponIcon weaponName={activeWeapon?.name?.replace('weapon_', '')} size={24} />
        <span className="ammo">
          {ammoClip}{ammoReserve > 0 ? ` / ${ammoReserve}` : ''}
        </span>
      </div>
    </div>
  );
}
