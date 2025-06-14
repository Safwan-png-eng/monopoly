import React from 'react';
import { useSprings, animated } from '@react-spring/web';

export default function Lobby({ socket, room, player, gameState }) {
  const isHost = gameState.players[0]?.id === player.id;
  const springs = useSprings(
    gameState.players.length,
    gameState.players.map((p, i) => ({
      scale: isHost && i === 0 ? 1.1 : 1,
      background: isHost && i === 0 ? '#FFD16644' : '#393053',
      config: { tension: 300, friction: 20 }
    }))
  );
  return (
    <div className="lobby-container">
      <h2>Lobby - Room <span>{room}</span></h2>
      <div id="lobby-players">
        {springs.map((style, i) => (
          <animated.div key={gameState.players[i].id} className="lobby-player" style={style}>
            <span className="lobby-player-avatar">{gameState.players[i].avatar}</span>
            <span>{gameState.players[i].name}</span>
            {i === 0 && <span style={{ color: '#FFD166', marginLeft: 8 }}>(Host)</span>}
          </animated.div>
        ))}
      </div>
      {isHost && !gameState.started && (
        <button id="start-game-btn" onClick={() => socket.emit('startGame', room)}>
          Start Game
        </button>
      )}
      {!isHost && !gameState.started && (
        <div id="lobby-waiting">Waiting for host to start...</div>
      )}
    </div>
  );
} 