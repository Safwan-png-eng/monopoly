import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import AvatarPicker from './AvatarPicker';

export default function RoomModal({ socket, setRoom, setPlayer }) {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [show, setShow] = useState(true);

  const modalAnim = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? 'scale(1)' : 'scale(0.8)',
  });

  const joinRoom = () => {
    if (!name || !avatar) return;
    const code = roomCode.trim().toUpperCase() || Math.random().toString(36).substr(2, 6).toUpperCase();
    socket.emit('joinRoom', { roomId: code, name, avatar }, (res) => {
      if (res && res.success) {
        setRoom(code);
        setPlayer({ id: res.playerId, name, avatar });
        setShow(false);
      }
    });
  };

  return (
    <animated.div style={modalAnim} className="modal">
      <h2>Join or Create a Room</h2>
      <input value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="Room code (optional)" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
      <AvatarPicker avatar={avatar} setAvatar={setAvatar} />
      <button onClick={joinRoom} disabled={!name || !avatar}>Join Room</button>
    </animated.div>
  );
} 