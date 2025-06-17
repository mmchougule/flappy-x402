import React, { useRef, useEffect, useState, useCallback } from "react";

interface FlappyBirdProps {
  onGameOver: (score: number) => void;
  isPlaying: boolean;
  initialScore?: number;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
}

const GRAVITY = 0.4;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 80;
const PIPE_GAP = 250;
const PIPE_SPEED = 2;
const BIRD_RADIUS = 20;
const PIPE_INTERVAL = 3000;

export function FlappyBird({ onGameOver, isPlaying, initialScore = 0 }: FlappyBirdProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastPipeTimeRef = useRef<number>(0);
  const gameOverCalledRef = useRef<boolean>(false);
  const [score, setScore] = useState(initialScore);
  const [bird, setBird] = useState<Bird>({
    x: 100,
    y: 300,
    velocity: 0,
    radius: BIRD_RADIUS,
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle jump
  const jump = useCallback(() => {
    if (!isPlaying) return;
    
    if (!gameStarted) {
      setGameStarted(true);
      lastPipeTimeRef.current = Date.now();
      setBird(prev => ({
        ...prev,
        velocity: JUMP_STRENGTH,
      }));
    } else {
      setBird(prev => ({
        ...prev,
        velocity: JUMP_STRENGTH,
      }));
    }
  }, [isPlaying, gameStarted]);

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && isPlaying) {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump, isPlaying]);

  // Add mouse/touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (isPlaying) {
        jump();
      }
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleClick);
    };
  }, [jump, isPlaying]);

  // Reset game when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      setBird({
        x: 100,
        y: 300,
        velocity: 0,
        radius: BIRD_RADIUS,
      });
      setPipes([]);
      setScore(initialScore);
      setGameStarted(false);
      lastPipeTimeRef.current = 0;
      gameOverCalledRef.current = false;
    }
  }, [isPlaying, initialScore]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      // Clear canvas with gradient sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, "#4A90E2"); // Light blue
      skyGradient.addColorStop(0.7, "#87CEEB"); // Sky blue
      skyGradient.addColorStop(1, "#98D8E8"); // Lighter blue at horizon
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw some clouds for atmosphere
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(100, 100, 30, 0, Math.PI * 2);
      ctx.arc(130, 100, 35, 0, Math.PI * 2);
      ctx.arc(160, 100, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(600, 150, 25, 0, Math.PI * 2);
      ctx.arc(625, 150, 30, 0, Math.PI * 2);
      ctx.arc(650, 150, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw ground
      ctx.fillStyle = "#8B7355"; // Brown
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      
      // Draw grass on ground
      ctx.fillStyle = "#228B22";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 5);

      let currentBird = bird;
      let currentPipes = pipes;
      let currentScore = score;

      // Only update game physics if game has started
      if (gameStarted) {
        // Update bird
        currentBird = {
          ...bird,
          y: bird.y + bird.velocity,
          velocity: bird.velocity + GRAVITY,
        };

        // Check boundaries (ground is at canvas.height - 20)
        if (currentBird.y + currentBird.radius > canvas.height - 20 || currentBird.y - currentBird.radius < 0) {
          if (!gameOverCalledRef.current) {
            gameOverCalledRef.current = true;
            console.log("Game over: Hit boundary");
            onGameOver(currentScore);
          }
          return;
        }

        // Generate new pipes
        const now = Date.now();
        if (now - lastPipeTimeRef.current > PIPE_INTERVAL) {
          const minHeight = 80;
          const maxHeight = canvas.height - PIPE_GAP - 100;
          const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
          
          currentPipes = [...pipes, {
            x: canvas.width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            width: PIPE_WIDTH,
            passed: false,
          }];
          
          lastPipeTimeRef.current = now;
        }

        // Update pipes
        currentPipes = currentPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED,
        })).filter(pipe => pipe.x + pipe.width > -50); // Keep pipes a bit longer

        // Check collisions and scoring
        for (const pipe of currentPipes) {
          // Check if bird passed the pipe
          if (!pipe.passed && pipe.x + pipe.width < currentBird.x) {
            pipe.passed = true;
            currentScore++;
          }

          // Check collision
          if (
            currentBird.x + currentBird.radius > pipe.x &&
            currentBird.x - currentBird.radius < pipe.x + pipe.width
          ) {
            if (
              currentBird.y - currentBird.radius < pipe.topHeight ||
              currentBird.y + currentBird.radius > pipe.bottomY
            ) {
              if (!gameOverCalledRef.current) {
                gameOverCalledRef.current = true;
                console.log("Game over: Hit pipe");
                onGameOver(currentScore);
              }
              return;
            }
          }
        }

        // Update states
        setBird(currentBird);
        setPipes(currentPipes);
        setScore(currentScore);
      }

      // Draw pipes
      ctx.fillStyle = "#228B22"; // Forest green
      for (const pipe of currentPipes) {
        // Create gradient for pipes
        const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        pipeGradient.addColorStop(0, "#2d5a2d");
        pipeGradient.addColorStop(0.5, "#228b22");
        pipeGradient.addColorStop(1, "#1a4d1a");
        ctx.fillStyle = pipeGradient;
        
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // Top pipe cap with darker green
        ctx.fillStyle = "#1a4d1a";
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, pipe.width + 10, 30);
        
        ctx.fillStyle = pipeGradient;
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY - 20);
        // Bottom pipe cap with darker green
        ctx.fillStyle = "#1a4d1a";
        ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 30);
      }

      // Draw pixelated bird (8x8 sprite style)
      const pixelSize = 4;
      const birdSprite = [
        [0,0,1,1,1,0,0,0],
        [0,1,2,2,2,1,0,0],
        [1,2,2,3,2,2,1,0],
        [1,2,2,2,2,2,2,1],
        [1,2,2,2,2,2,2,1],
        [0,1,2,2,2,2,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0]
      ];
      
      const colors = ["transparent", "#FFD700", "#FFED4E", "#000000"];
      
      // Draw bird at its position
      const startX = currentBird.x - (4 * pixelSize);
      const startY = currentBird.y - (4 * pixelSize);
      
      for (let row = 0; row < birdSprite.length; row++) {
        for (let col = 0; col < birdSprite[row].length; col++) {
          const colorIndex = birdSprite[row][col];
          if (colorIndex > 0) {
            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(
              startX + col * pixelSize,
              startY + row * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        }
      }

      // Draw score with arcade style
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 4;
      ctx.font = "bold 48px 'Press Start 2P', monospace";
      const scoreText = currentScore.toString();
      const textWidth = ctx.measureText(scoreText).width;
      ctx.strokeText(scoreText, canvas.width / 2 - textWidth / 2, 60);
      ctx.fillText(scoreText, canvas.width / 2 - textWidth / 2, 60);

      // Draw instructions if game hasn't started
      if (!gameStarted) {
        // Draw semi-transparent background for text
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 60, 500, 120);
        
        // Draw scanlines effect
        ctx.fillStyle = "rgba(0, 255, 0, 0.02)";
        for (let i = 0; i < canvas.height; i += 4) {
          ctx.fillRect(0, i, canvas.width, 2);
        }
        
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.font = "bold 24px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        const startText = "PRESS SPACE TO START";
        ctx.strokeText(startText, canvas.width / 2, canvas.height / 2);
        ctx.fillText(startText, canvas.width / 2, canvas.height / 2);
        
        ctx.font = "16px 'Press Start 2P', monospace";
        const instructionText = "AVOID THE PIPES!";
        ctx.strokeText(instructionText, canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText(instructionText, canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = "left";
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameStarted, onGameOver, bird, pipes, score]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border-4 border-gray-700 shadow-2xl cursor-pointer rounded-lg"
      style={{ 
        imageRendering: "pixelated"
      }}
    />
  );
} 