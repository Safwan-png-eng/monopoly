import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import { UserCircle, Smiley, Star, DiceSix, House, Crown, Rocket, Heart, Lightning, Ghost, Cat, Dog } from 'phosphor-react';

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

export default function AvatarPicker({ avatar, setAvatar }) {
  const springs = useSprings(
    icons.length,
    icons.map((_, i) => ({
      scale: avatar === i ? 1.2 : 1,
      boxShadow: avatar === i ? '0 0 12px #FFD166' : 'none',
      config: { tension: 300, friction: 20 }
    }))
  );
  return (
    <div className="avatar-grid">
      {springs.map((style, i) => (
        <animated.div
          key={i}
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
            border: avatar === i ? '3px solid #FFD166' : '3px solid transparent',
            boxShadow: avatar === i ? '0 0 12px #FFD166' : 'none',
            transition: 'box-shadow 0.2s',
          }}
          onClick={() => setAvatar(i)}
        >
          {icons[i]}
        </animated.div>
      ))}
    </div>
  );
} 