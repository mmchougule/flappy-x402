import React from 'react';
import { useDevAccount } from '../services/x402Client';

interface DevModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function DevModeToggle({ enabled, onToggle }: DevModeToggleProps) {
  const isDev = import.meta.env.DEV;
  const hasPrivateKey = import.meta.env.VITE_PRIVATE_KEY && 
                        import.meta.env.VITE_PRIVATE_KEY !== '0xYOUR_PRIVATE_KEY_HERE';

  // Only show in development mode with a configured private key
  if (!isDev || !hasPrivateKey) {
    return null;
  }

  const handleToggle = () => {
    const newValue = !enabled;
    onToggle(newValue);
    
    if (newValue) {
      useDevAccount();
    } else {
      // Will be reset when wallet connects
      console.log('Dev mode disabled - connect wallet to play');
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-black/80 p-2 rounded border border-yellow-400/50">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
          className="cursor-pointer"
        />
        <span className="text-yellow-400 pixel-font-xs">DEV MODE</span>
      </label>
      {enabled && (
        <p className="text-gray-400 pixel-font-xs mt-1">USING TEST WALLET</p>
      )}
    </div>
  );
} 