import React from 'react';
import { useSprings, animated } from '@react-spring/web';

const BOARD_SIZE = 8;
const TILE_SIZE = 60; // px

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
          {playerTokens[i].avatar}
        </animated.span>
      ))}
    </div>
  );
} 