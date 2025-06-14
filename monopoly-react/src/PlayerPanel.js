import React from 'react';
import { useSprings, animated } from '@react-spring/web';

export default function PlayerPanel({ players, turn }) {
  const springs = useSprings(
    players.length,
    players.map((p, i) => ({
      scale: turn === i ? 1.1 : 1,
      background: turn === i ? '#FFD16644' : '#393053',
      config: { tension: 300, friction: 20 }
    }))
  );
  return (
    <div className="player-panel">
      <h3>Players</h3>
      <div id="player-list">
        {springs.map((style, i) => (
          <animated.div key={players[i].id} className="player-list-item" style={style}>
            <span className="player-list-avatar">{players[i].avatar}</span>
            <span>{players[i].name}</span>
            <span style={{ marginLeft: 'auto' }}>${players[i].money}</span>
          </animated.div>
        ))}
      </div>
    </div>
  );
} 