import React from 'react';
import { useSprings, animated } from '@react-spring/web';

const avatars = ['🟡','🟠','🔴','🟢','🔵','🟣','🟤','🟣','🟢','🟣','🟡','🟢'];

export default function AvatarPicker({ avatar, setAvatar }) {
  const springs = useSprings(
    avatars.length,
    avatars.map((a, i) => ({
      scale: avatar === a ? 1.2 : 1,
      boxShadow: avatar === a ? '0 0 12px #FFD166' : 'none',
      config: { tension: 300, friction: 20 }
    }))
  );
  return (
    <div className="avatar-grid">
      {springs.map((style, i) => (
        <animated.div
          key={avatars[i]}
          style={{
            ...style,
            display: 'inline-block',
            margin: 8,
            cursor: 'pointer',
            borderRadius: '50%',
            background: '#fff2',
            width: 48,
            height: 48,
            textAlign: 'center',
            lineHeight: '48px',
            fontSize: 32,
            border: avatar === avatars[i] ? '3px solid #FFD166' : '3px solid transparent'
          }}
          onClick={() => setAvatar(avatars[i])}
        >
          {avatars[i]}
        </animated.div>
      ))}
    </div>
  );
} 