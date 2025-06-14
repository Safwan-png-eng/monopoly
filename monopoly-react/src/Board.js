import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import { UserCircle, Smiley, Star, DiceSix, House, Crown, Rocket, Heart, Lightning, Ghost, Cat, Dog, Train, Drop } from 'phosphor-react';

const BOARD_SIZE = 11; // 11 tiles per side for a classic board
const BOARD_LENGTH = BOARD_SIZE * 4 - 4; // 40 tiles
const TILE_SIZE = 54; // px
const CORNER_SIZE = 80; // px

const icons = [
  <UserCircle size={28} weight="fill" color="#FFD166" />,
  <Smiley size={28} weight="fill" color="#4CAF50" />,
  <Star size={28} weight="fill" color="#845EC2" />,
  <DiceSix size={28} weight="fill" color="#FF6B6B" />,
  <House size={28} weight="fill" color="#00C9A7" />,
  <Crown size={28} weight="fill" color="#FFD700" />,
  <Rocket size={28} weight="fill" color="#4D96FF" />,
  <Heart size={28} weight="fill" color="#F67280" />,
  <Lightning size={28} weight="fill" color="#B983FF" />,
  <Ghost size={28} weight="fill" color="#A3F7BF" />,
  <Cat size={28} weight="fill" color="#F9C80E" />,
  <Dog size={28} weight="fill" color="#6BCB77" />
];

// Vibrant background colors for player tokens
const tokenBgColors = [
  '#FFD166', '#4CAF50', '#845EC2', '#FF6B6B', '#00C9A7', '#FFD700', '#4D96FF', '#F67280', '#B983FF', '#A3F7BF', '#F9C80E', '#6BCB77'
];

// Classic Monopoly property colors (by tile index)
const propertyColors = [
  // Bottom row (0-10)
  '#fff', '#8B4513', '#8B4513', '#fff', '#ADD8E6', '#ADD8E6', '#ADD8E6', '#fff', '#FFC0CB', '#FFC0CB', '#FFC0CB',
  // Left column (11-19)
  '#fff', '#FFA500', '#FFA500', '#FFA500', '#fff', '#FF0000', '#FF0000', '#FF0000', '#fff',
  // Top row (20-30)
  '#FFFF00', '#FFFF00', '#fff', '#008000', '#008000', '#008000', '#fff', '#00008B', '#00008B', '#fff',
  // Right column (31-39)
  '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'
];

const cornerTiles = [0, 10, 20, 30];
const railroadTiles = [5, 15, 25, 35];
const utilityTiles = [12, 28];

const propertyGroups = [
  { name: 'Brown', color: '#8B4513', tiles: [1, 2] },
  { name: 'Light Blue', color: '#ADD8E6', tiles: [4, 5, 6] },
  { name: 'Pink', color: '#FFC0CB', tiles: [8, 9, 10] },
  { name: 'Orange', color: '#FFA500', tiles: [12, 13, 14] },
  { name: 'Red', color: '#FF0000', tiles: [16, 17, 18] },
  { name: 'Yellow', color: '#FFFF00', tiles: [21, 22] },
  { name: 'Green', color: '#008000', tiles: [24, 25, 26] },
  { name: 'Dark Blue', color: '#00008B', tiles: [28, 29] }
];

function getTilePosition(idx) {
  if (idx < BOARD_SIZE) return { left: (BOARD_SIZE - 1 - idx) * TILE_SIZE, top: (BOARD_SIZE - 1) * TILE_SIZE };
  if (idx < BOARD_SIZE * 2 - 1) return { left: 0, top: (BOARD_SIZE - 1 - (idx - (BOARD_SIZE - 1))) * TILE_SIZE };
  if (idx < BOARD_SIZE * 3 - 2) return { left: (idx - (BOARD_SIZE * 2 - 2)) * TILE_SIZE, top: 0 };
  return { left: (BOARD_SIZE - 1) * TILE_SIZE, top: (idx - (BOARD_SIZE * 3 - 3)) * TILE_SIZE };
}

export default function Board({ board, players }) {
  // Prepare player tokens for animation
  const playerTokens = players.map((p) => {
    const pos = getTilePosition(p.position % BOARD_LENGTH);
    return {
      ...p,
      left: pos.left,
      top: pos.top,
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
    <div className="monopoly-board" style={{ position: 'relative', width: TILE_SIZE * (BOARD_SIZE - 1) + CORNER_SIZE, height: TILE_SIZE * (BOARD_SIZE - 1) + CORNER_SIZE, margin: '0 auto', border: '4px solid #393053', boxShadow: '0 0 32px #0008', background: '#18122B' }}>
      {board.slice(0, BOARD_LENGTH).map((tile, idx) => {
        const pos = getTilePosition(idx);
        const isCorner = cornerTiles.includes(idx);
        const isRailroad = railroadTiles.includes(idx);
        const isUtility = utilityTiles.includes(idx);
        const color = propertyColors[idx] || '#393053';
        // Find property group label
        const group = propertyGroups.find(g => g.tiles.includes(idx));
        return (
          <div
            key={idx}
            className="property-tile"
            style={{
              left: pos.left,
              top: pos.top,
              width: isCorner ? CORNER_SIZE : TILE_SIZE,
              height: isCorner ? CORNER_SIZE : TILE_SIZE,
              background: isCorner ? '#393053' : '#231942',
              border: isCorner ? '3px solid #FFD166' : '2px solid #2D3250',
              boxShadow: isCorner ? '0 0 16px #FFD166' : '0 1px 8px #0003',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            {!isCorner && <div style={{ width: '100%', height: 8, background: color, borderRadius: 4, marginBottom: 2 }} />}
            <div className="property-label" style={{ fontWeight: 700, fontSize: isCorner ? 16 : 13, textAlign: 'center', margin: isCorner ? '0.5rem 0' : '0.2rem 0' }}>
              {isRailroad && <Train size={18} color="#fff" style={{ marginBottom: -3, marginRight: 2 }} />}
              {isUtility && (idx === 12 ? <Drop size={18} color="#fff" style={{ marginBottom: -3, marginRight: 2 }} /> : <Lightning size={18} color="#fff" style={{ marginBottom: -3, marginRight: 2 }} />)}
              {tile.name}
            </div>
            {group && <div style={{ fontSize: 10, color: group.color, fontWeight: 700, marginBottom: 2 }}>{group.name}</div>}
            {tile.price > 0 && <div className="property-price">${tile.price}</div>}
            {tile.owner !== null && <div className="property-owner">🏠 {players.find(p => p.id === tile.owner)?.name}</div>}
            <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
              {players.filter(p => p.position % BOARD_LENGTH === idx).map((p, i) => (
                <span
                  key={p.id}
                  className="tile-player-avatar"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: tokenBgColors[p.avatar % tokenBgColors.length],
                    border: '2.5px solid #fff',
                    boxShadow: '0 2px 8px #0006',
                    marginLeft: 2,
                    marginRight: 2,
                    marginTop: 2,
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {icons[p.avatar]}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 