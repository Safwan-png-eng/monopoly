import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import RoomModal from './RoomModal';
import Lobby from './Lobby';
import Board from './Board';
import PlayerPanel from './PlayerPanel';
import Dice from './Dice';
import GameLog from './GameLog';
import './App.css';

const socket = io('https://monopoly-yiw3.onrender.com');

function App() {
  // Restore from localStorage if available
  const [room, setRoomState] = useState(() => localStorage.getItem('room') || null);
  const [player, setPlayerState] = useState(() => {
    const p = localStorage.getItem('player');
    return p ? JSON.parse(p) : null;
  });
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('update', setGameState);
    return () => socket.off('update');
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (room) localStorage.setItem('room', room);
    if (player) localStorage.setItem('player', JSON.stringify(player));
  }, [room, player]);

  // Helper to set and persist room/player
  const setRoom = (r) => {
    setRoomState(r);
    if (r) localStorage.setItem('room', r);
    else localStorage.removeItem('room');
  };
  const setPlayer = (p) => {
    setPlayerState(p);
    if (p) localStorage.setItem('player', JSON.stringify(p));
    else localStorage.removeItem('player');
  };

  // Reset function for debugging
  const reset = () => {
    setRoom(null);
    setPlayer(null);
    setGameState(null);
    localStorage.clear();
    window.location.reload();
  };

  if (!room || !player) {
    return <RoomModal socket={socket} setRoom={setRoom} setPlayer={setPlayer} />;
  }
  if (gameState && !gameState.started) {
    return <>
      <button style={{position:'absolute',top:10,right:10}} onClick={reset}>Reset</button>
      <Lobby socket={socket} room={room} player={player} gameState={gameState} />
    </>;
  }
  return (
    <div className="main-game">
      <button style={{position:'absolute',top:10,right:10}} onClick={reset}>Reset</button>
      <PlayerPanel players={gameState.players} turn={gameState.turn} />
      <Board board={gameState.board} players={gameState.players} />
      <Dice dice={gameState.log?.slice(-1)[0]} canRoll={gameState.players[gameState.turn].id === player.id} socket={socket} room={room} />
      <GameLog log={gameState.log || []} />
    </div>
  );
}

export default App;
