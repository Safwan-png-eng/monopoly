import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import AvatarPicker from './AvatarPicker';

export default function RoomModal({ socket, setRoom, setPlayer }) {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [show, setShow] = useState(true);

  const modalAnim = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? 'scale(1)' : 'scale(0.8)',
  });

  const joinRoom = () => {
    if (!name || avatar === null) return;
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
      <h2 style={{marginBottom: '1.5rem'}}>Join or Create a Room</h2>
      <input value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="Room code (optional)" style={{marginBottom: '1rem'}} />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{marginBottom: '1rem'}} />
      <AvatarPicker avatar={avatar} setAvatar={setAvatar} />
      <button onClick={joinRoom} disabled={!name || avatar === null} style={{marginTop: '1rem', background: '#FFD166', color: '#231942', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 600, fontSize: 18, cursor: (!name || avatar === null) ? 'not-allowed' : 'pointer'}}>Join Room</button>
    </animated.div>
  );
} 