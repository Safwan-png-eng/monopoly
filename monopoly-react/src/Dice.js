import React from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function Dice({ dice, canRoll, socket, room }) {
  const { transform } = useSpring({
    transform: `rotate(${(dice?.dice1 || 1) * 60}deg)`,
    config: { tension: 300, friction: 10 }
  });
  return (
    <div style={{ display: 'flex', gap: 16, margin: '1rem 0' }}>
      <animated.div style={{
        width: 48, height: 48, background: '#fff', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, boxShadow: '0 2px 8px #0002', transform
      }}>
        {dice?.dice1 || 1}
      </animated.div>
      <animated.div style={{
        width: 48, height: 48, background: '#fff', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, boxShadow: '0 2px 8px #0002', transform
      }}>
        {dice?.dice2 || 1}
      </animated.div>
      <button
        onClick={() => socket.emit('action', { roomId: room, action: 'rollDice' })}
        disabled={!canRoll}
        style={{
          marginLeft: 16,
          background: canRoll ? '#FFD166' : '#ccc',
          color: '#231942',
          border: 'none',
          borderRadius: 8,
          padding: '0.7rem 1.5rem',
          fontWeight: 600,
          fontSize: 18,
          cursor: canRoll ? 'pointer' : 'not-allowed'
        }}
      >
        {canRoll ? 'Roll Dice' : 'Waiting...'}
      </button>
    </div>
  );
} 