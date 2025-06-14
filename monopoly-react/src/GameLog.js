import React from 'react';
import { useTransition, animated } from '@react-spring/web';

export default function GameLog({ log }) {
  const transitions = useTransition(log.slice(-8).reverse(), {
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(-20px)' },
    keys: (item, idx) => idx
  });
  return (
    <div className="game-log">
      <h3>Game Log</h3>
      <div id="log-entries">
        {transitions((style, item, t, idx) => (
          <animated.div className="log-entry" style={style} key={idx}>
            {item.action === 'rollDice' && `${item.player} rolled ${item.dice1} and ${item.dice2} (${item.total})`}
            {item.action === 'buyProperty' && `${item.player} bought ${item.property} for $${item.price}`}
            {item.action === 'payRent' && `${item.player} paid $${item.amount} rent to ${item.to}`}
          </animated.div>
        ))}
      </div>
    </div>
  );
} 