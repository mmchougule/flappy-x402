import React, { useEffect, useState } from 'react';

export function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate confetti particles
    const colors = ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-3 animate-confetti"
          style={{
            backgroundColor: particle.color,
            left: `${particle.left}%`,
            top: '-10px',
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      
      {/* Big "PAY TO WIN!" text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl pixel-font text-yellow-400 animate-bounce pay-to-win-text">
          PAY TO WIN!
        </div>
      </div>
    </div>
  );
} 