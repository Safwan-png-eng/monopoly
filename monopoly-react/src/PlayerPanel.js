import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import { UserCircle, Smiley, Star, DiceSix, House, Crown, Rocket, Heart, Lightning, Ghost, Cat, Dog } from 'phosphor-react';

const icons = [
  <UserCircle size={22} weight="fill" color="#FFD166" />,
  <Smiley size={22} weight="fill" color="#4CAF50" />,
  <Star size={22} weight="fill" color="#845EC2" />,
  <DiceSix size={22} weight="fill" color="#FF6B6B" />,
  <House size={22} weight="fill" color="#00C9A7" />,
  <Crown size={22} weight="fill" color="#FFD700" />,
  <Rocket size={22} weight="fill" color="#4D96FF" />,
  <Heart size={22} weight="fill" color="#F67280" />,
  <Lightning size={22} weight="fill" color="#B983FF" />,
  <Ghost size={22} weight="fill" color="#A3F7BF" />,
  <Cat size={22} weight="fill" color="#F9C80E" />,
  <Dog size={22} weight="fill" color="#6BCB77" />
];

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
            <span className="player-list-avatar">{icons[players[i].avatar]}</span>
            <span>{players[i].name}</span>
            <span style={{ marginLeft: 'auto' }}>${players[i].money}</span>
          </animated.div>
        ))}
      </div>
    </div>
  );
} 