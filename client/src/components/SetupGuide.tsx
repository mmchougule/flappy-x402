import React from "react";

interface SetupGuideProps {
  error?: string | null;
}

export function SetupGuide({ error }: SetupGuideProps) {
  return (
    <div className="arcade-screen min-h-[600px] relative">
      <div className="relative z-10 p-8 overflow-auto max-h-[600px]">
        <h2 className="text-2xl text-yellow-400 pixel-font mb-6">SETUP REQUIRED</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border-2 border-red-500 rounded">
            <p className="text-red-400 pixel-font-xs">{error}</p>
          </div>
        )}

        <div className="space-y-8 text-green-400 pixel-font-xs">
          <div>
            <h3 className="text-lg text-yellow-400 mb-3">1. START THE GAME SERVER</h3>
            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
              <p className="mb-2">Open a new terminal and run:</p>
              <code className="block bg-black p-2 rounded text-green-300">
                cd server && npm run dev
              </code>
              <p className="mt-2 text-gray-400">The server should start on port 3001</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg text-yellow-400 mb-3">2. CONNECT YOUR WALLET</h3>
            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
              <p className="mb-2">You'll need:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>MetaMask or another Ethereum wallet</li>
                <li>Base Sepolia network added to your wallet</li>
                <li>Base Sepolia ETH for gas fees</li>
                <li>Base Sepolia USDC to play the game</li>
              </ul>
              <p className="mt-4">The game will help you switch to the correct network when you connect.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg text-yellow-400 mb-3">3. GET TEST TOKENS</h3>
            <div className="bg-gray-800/50 p-4 rounded border border-gray-700 space-y-3">
              <div>
                <p className="font-bold">Base Sepolia ETH:</p>
                <a 
                  href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Coinbase Base Sepolia Faucet
                </a>
              </div>
              
              <div>
                <p className="font-bold">Base Sepolia USDC:</p>
                <p>Mint test USDC at:</p>
                <a 
                  href="https://faucet.circle.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Circle USDC Faucet
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg text-yellow-400 mb-3">4. PLAY THE GAME!</h3>
            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
              <p>Once everything is set up:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Connect your wallet using the button</li>
                <li>Click "INSERT COIN" to pay and start</li>
                <li>Each game costs $0.001 USDC</li>
                <li>Press SPACE or click to fly!</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg text-yellow-400 mb-3">FOR DEVELOPERS</h3>
            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
              <p className="mb-2">You can still use a private key for testing:</p>
              <code className="block bg-black p-2 rounded text-green-300 text-xs">
                VITE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
              </code>
              <p className="mt-2 text-gray-400">But wallet connection is recommended!</p>
            </div>
          </div>
        </div>
      </div>

      {/* CRT Effect Overlay */}
      <div className="crt-flicker absolute inset-0 pointer-events-none"></div>
    </div>
  );
} 