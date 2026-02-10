import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HeartBackground = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts = [];
      for (let i = 0; i < 20; i++) {
        newHearts.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: Math.random() * 0.5 + 0.5,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 10,
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' // Fallback
    }}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ 
            x: `${heart.x}vw`, 
            y: '110vh', 
            opacity: 0, 
            scale: heart.scale 
          }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 1, 1, 0],
            rotate: [0, 45, -45, 0]
          }}
          transition={{ 
            duration: heart.duration, 
            repeat: Infinity, 
            delay: heart.delay, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            fontSize: '2rem',
            color: 'rgba(255, 182, 193, 0.6)', // Light pink
            filter: 'blur(1px)'
          }}
        >
          ❤
        </motion.div>
      ))}
    </div>
  );
};

export default HeartBackground;
