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
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('update', setGameState);
    return () => socket.off('update');
  }, []);

  if (!room) {
    return <RoomModal socket={socket} setRoom={setRoom} setPlayer={setPlayer} />;
  }
  if (gameState && !gameState.started) {
    return <Lobby socket={socket} room={room} player={player} gameState={gameState} />;
  }
  return (
    <div className="main-game">
      <PlayerPanel players={gameState.players} turn={gameState.turn} />
      <Board board={gameState.board} players={gameState.players} />
      <Dice dice={gameState.log?.slice(-1)[0]} canRoll={gameState.players[gameState.turn].id === player.id} socket={socket} room={room} />
      <GameLog log={gameState.log || []} />
    </div>
  );
}

export default App;
