import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { 
  UserCircle, Smiley, Star, DiceSix, House, Crown, Rocket, Heart, 
  Lightning, Ghost, Cat, Dog, Train, Drop, Money, Bank, Car, 
  ShoppingBag, Briefcase, Factory, Building, HouseLine, 
  Buildings, HouseSimple, Storefront, Warehouse, 
  ShoppingCart, Storefront as Store, Bank as BankIcon
} from 'phosphor-react';

const BOARD_SIZE = 11; // 11 tiles per side for a classic board
const BOARD_LENGTH = BOARD_SIZE * 4 - 4; // 40 tiles
const TILE_SIZE = 60; // Increased size
const CORNER_SIZE = 90; // Increased size

// Enhanced player tokens with better icons
const icons = [
  <UserCircle size={32} weight="fill" color="#FFD166" />,
  <Smiley size={32} weight="fill" color="#4CAF50" />,
  <Star size={32} weight="fill" color="#845EC2" />,
  <DiceSix size={32} weight="fill" color="#FF6B6B" />,
  <House size={32} weight="fill" color="#00C9A7" />,
  <Crown size={32} weight="fill" color="#FFD700" />,
  <Rocket size={32} weight="fill" color="#4D96FF" />,
  <Heart size={32} weight="fill" color="#F67280" />,
  <Lightning size={32} weight="fill" color="#B983FF" />,
  <Ghost size={32} weight="fill" color="#A3F7BF" />,
  <Cat size={32} weight="fill" color="#F9C80E" />,
  <Dog size={32} weight="fill" color="#6BCB77" />
];

// Enhanced token colors with gradients
const tokenBgColors = [
  'linear-gradient(135deg, #FFD166, #FF9F1C)',
  'linear-gradient(135deg, #4CAF50, #2E7D32)',
  'linear-gradient(135deg, #845EC2, #6C63FF)',
  'linear-gradient(135deg, #FF6B6B, #FF4757)',
  'linear-gradient(135deg, #00C9A7, #00B894)',
  'linear-gradient(135deg, #FFD700, #FFA000)',
  'linear-gradient(135deg, #4D96FF, #1E88E5)',
  'linear-gradient(135deg, #F67280, #E91E63)',
  'linear-gradient(135deg, #B983FF, #9C27B0)',
  'linear-gradient(135deg, #A3F7BF, #4CAF50)',
  'linear-gradient(135deg, #F9C80E, #FFA000)',
  'linear-gradient(135deg, #6BCB77, #43A047)'
];

// Property colors with gradients
const propertyColors = [
  // Bottom row (0-10)
  '#fff', 'linear-gradient(135deg, #8B4513, #A0522D)', 'linear-gradient(135deg, #8B4513, #A0522D)', '#fff',
  'linear-gradient(135deg, #ADD8E6, #87CEEB)', 'linear-gradient(135deg, #ADD8E6, #87CEEB)', 'linear-gradient(135deg, #ADD8E6, #87CEEB)', '#fff',
  'linear-gradient(135deg, #FFC0CB, #FFB6C1)', 'linear-gradient(135deg, #FFC0CB, #FFB6C1)', 'linear-gradient(135deg, #FFC0CB, #FFB6C1)',
  // Left column (11-19)
  '#fff', 'linear-gradient(135deg, #FFA500, #FF8C00)', 'linear-gradient(135deg, #FFA500, #FF8C00)', 'linear-gradient(135deg, #FFA500, #FF8C00)', '#fff',
  'linear-gradient(135deg, #FF0000, #DC143C)', 'linear-gradient(135deg, #FF0000, #DC143C)', 'linear-gradient(135deg, #FF0000, #DC143C)', '#fff',
  // Top row (20-30)
  'linear-gradient(135deg, #FFFF00, #FFD700)', 'linear-gradient(135deg, #FFFF00, #FFD700)', '#fff',
  'linear-gradient(135deg, #008000, #006400)', 'linear-gradient(135deg, #008000, #006400)', 'linear-gradient(135deg, #008000, #006400)', '#fff',
  'linear-gradient(135deg, #00008B, #0000CD)', 'linear-gradient(135deg, #00008B, #0000CD)', '#fff',
  // Right column (31-39)
  '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'
];

const cornerTiles = [0, 10, 20, 30];
const railroadTiles = [5, 15, 25, 35];
const utilityTiles = [12, 28];

// Enhanced property groups with better names and colors
const propertyGroups = [
  { name: 'Mediterranean Avenue', color: '#8B4513', tiles: [1, 2], icon: <HouseSimple size={20} /> },
  { name: 'Baltic Avenue', color: '#ADD8E6', tiles: [4, 5, 6], icon: <HouseLine size={20} /> },
  { name: 'Oriental Avenue', color: '#FFC0CB', tiles: [8, 9, 10], icon: <Buildings size={20} /> },
  { name: 'Vermont Avenue', color: '#FFA500', tiles: [12, 13, 14], icon: <Storefront size={20} /> },
  { name: 'Connecticut Avenue', color: '#FF0000', tiles: [16, 17, 18], icon: <Storefront size={20} /> },
  { name: 'St. Charles Place', color: '#FFFF00', tiles: [21, 22], icon: <ShoppingCart size={20} /> },
  { name: 'States Avenue', color: '#008000', tiles: [24, 25, 26], icon: <Store size={20} /> },
  { name: 'Virginia Avenue', color: '#00008B', tiles: [28, 29], icon: <BankIcon size={20} /> }
];

// Special tile icons
const specialTileIcons = {
  0: <Bank size={24} color="#FFD166" />, // GO
  2: <Money size={24} color="#4CAF50" />, // Community Chest
  7: <Briefcase size={24} color="#845EC2" />, // Chance
  10: <Car size={24} color="#FF6B6B" />, // Jail
  17: <Factory size={24} color="#00C9A7" />, // Free Parking
  20: <ShoppingBag size={24} color="#FFD700" />, // Go To Jail
  30: <Building size={24} color="#4D96FF" />, // Income Tax
  38: <Money size={24} color="#F67280" />, // Luxury Tax
};

function getTilePosition(idx) {
  if (idx < BOARD_SIZE) return { left: (BOARD_SIZE - 1 - idx) * TILE_SIZE, top: (BOARD_SIZE - 1) * TILE_SIZE };
  if (idx < BOARD_SIZE * 2 - 1) return { left: 0, top: (BOARD_SIZE - 1 - (idx - (BOARD_SIZE - 1))) * TILE_SIZE };
  if (idx < BOARD_SIZE * 3 - 2) return { left: (idx - (BOARD_SIZE * 2 - 2)) * TILE_SIZE, top: 0 };
  return { left: (BOARD_SIZE - 1) * TILE_SIZE, top: (idx - (BOARD_SIZE * 3 - 3)) * TILE_SIZE };
}

export default function Board({ board, players }) {
  return (
    <div className="monopoly-board" style={{
      position: 'relative',
      width: TILE_SIZE * (BOARD_SIZE - 1) + CORNER_SIZE,
      height: TILE_SIZE * (BOARD_SIZE - 1) + CORNER_SIZE,
      margin: '0 auto',
      border: '4px solid #393053',
      boxShadow: '0 0 32px #0008',
      background: 'linear-gradient(135deg, #18122B, #231942)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {board.slice(0, BOARD_LENGTH).map((tile, idx) => {
        const pos = getTilePosition(idx);
        const isCorner = cornerTiles.includes(idx);
        const isRailroad = railroadTiles.includes(idx);
        const isUtility = utilityTiles.includes(idx);
        const color = propertyColors[idx] || '#393053';
        const group = propertyGroups.find(g => g.tiles.includes(idx));
        const specialIcon = specialTileIcons[idx];

        return (
          <div
            key={idx}
            className="property-tile"
            style={{
              left: pos.left,
              top: pos.top,
              width: isCorner ? CORNER_SIZE : TILE_SIZE,
              height: isCorner ? CORNER_SIZE : TILE_SIZE,
              background: isCorner ? 'linear-gradient(135deg, #393053, #2D3250)' : 'linear-gradient(135deg, #231942, #1A1B2E)',
              border: isCorner ? '3px solid #FFD166' : '2px solid #2D3250',
              boxShadow: isCorner ? '0 0 16px #FFD166' : '0 1px 8px #0003',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              zIndex: 1,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'scale(1.05)',
                zIndex: 2
              }
            }}
          >
            {!isCorner && (
              <div style={{
                width: '100%',
                height: 10,
                background: color,
                borderRadius: 4,
                marginBottom: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            )}
            <div className="property-label" style={{
              fontWeight: 700,
              fontSize: isCorner ? 16 : 13,
              textAlign: 'center',
              margin: isCorner ? '0.5rem 0' : '0.2rem 0',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {specialIcon}
              {isRailroad && <Train size={20} color="#fff" style={{ marginBottom: -3, marginRight: 2 }} />}
              {isUtility && (idx === 12 ? <Drop size={20} color="#fff" style={{ marginBottom: -3, marginRight: 2 }} /> : <Lightning size={20} color="#fff" style={{ marginBottom: -3, marginRight: 2 }} />)}
              {group?.icon}
              {tile.name}
            </div>
            {group && (
              <div style={{
                fontSize: 10,
                color: group.color,
                fontWeight: 700,
                marginBottom: 2,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {group.name}
              </div>
            )}
            {tile.price > 0 && (
              <div className="property-price" style={{
                fontSize: 12,
                color: '#FFD166',
                fontWeight: 600,
                marginTop: 2
              }}>
                ${tile.price}
              </div>
            )}
            {tile.owner !== null && (
              <div className="property-owner" style={{
                fontSize: 11,
                color: '#fff',
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <House size={14} color="#FFD166" />
                {players.find(p => p.id === tile.owner)?.name}
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: 4,
              marginTop: 4,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {players.filter(p => p.position % BOARD_LENGTH === idx).map((p, i) => (
                <animated.span
                  key={p.id}
                  className="tile-player-avatar"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: tokenBgColors[p.avatar % tokenBgColors.length],
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px #0006',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px #0008'
                    }
                  }}
                >
                  {icons[p.avatar]}
                </animated.span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 