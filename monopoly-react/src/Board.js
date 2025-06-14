import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import { UserCircle, Smiley, Star, DiceSix, House, Crown, Rocket, Heart, Lightning, Ghost, Cat, Dog } from 'phosphor-react';

const BOARD_SIZE = 8;
const TILE_SIZE = 60; // px

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

export default function Board({ board, players }) {
  // Calculate positions for each tile (row, col)
  const tilePositions = board.map((_, idx) => {
    const row = Math.floor(idx / BOARD_SIZE);
    const col = idx % BOARD_SIZE;
    return { row, col };
  });

  // Prepare player tokens for animation
  const playerTokens = players.map((p) => {
    const pos = tilePositions[p.position] || { row: 0, col: 0 };
    return {
      ...p,
      left: pos.col * TILE_SIZE,
      top: pos.row * TILE_SIZE,
    };
  });

  const springs = useSprings(
    playerTokens.length,
    playerTokens.map((p) => ({
      left: p.left,
      top: p.top,
      config: { tension: 200, friction: 20 },
    }))
  );

  return (
    <div className="board-grid" style={{ position: 'relative', width: BOARD_SIZE * TILE_SIZE, height: BOARD_SIZE * TILE_SIZE }}>
      {board.map((tile, idx) => (
        <div key={idx} className="board-tile">
          <div>{tile.name}</div>
          {tile.owner && <div style={{ fontSize: 12, color: '#FFD166' }}>🏠 {players.find(p => p.id === tile.owner)?.name}</div>}
        </div>
      ))}
      {springs.map((style, i) => (
        <animated.span
          key={playerTokens[i].id}
          className="tile-player-avatar"
          style={{
            ...style,
            position: 'absolute',
            zIndex: 2,
            fontSize: 22,
            marginLeft: 2,
            pointerEvents: 'none',
          }}
        >
          {icons[playerTokens[i].avatar]}
        </animated.span>
      ))}
    </div>
  );
} 