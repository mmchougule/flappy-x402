# Flappy x402 Client

This is the React frontend for the Flappy Bird game with x402 payment integration.

## Setup

1. **Create a .env file** with your configuration:

```bash
# Your private key for signing transactions (DO NOT COMMIT!)
# In production, use a wallet connector instead
VITE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# API base URL
VITE_API_BASE_URL=http://localhost:3001
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

The client will be available at http://localhost:5173

## Important Notes

### Private Key Security

⚠️ **WARNING**: The current implementation uses a private key directly for demo purposes. In production:
- Never expose private keys in client-side code
- Use wallet connectors like MetaMask, WalletConnect, or Coinbase Wallet
- Implement proper key management and security practices

### Base Sepolia Setup

To use this demo, you'll need:
1. A wallet with some ETH on Base Sepolia for gas fees
2. Some USDC on Base Sepolia for game payments

You can get:
- Base Sepolia ETH from: https://docs.base.org/tools/network-faucets/
- Base Sepolia USDC from: Circle's testnet faucet or bridge from Sepolia

## Game Controls

- **SPACE** or **Click/Tap** - Make the bird jump
- Avoid the pipes to score points
- Each game session lasts 10 minutes

## How It Works

1. User clicks "Play Game"
2. x402 client intercepts the request and handles payment
3. User signs a $0.001 USDC transaction
4. Server verifies payment and creates a game session
5. Game becomes playable
6. Score is submitted when game ends

## Development

The client is built with:
- React + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- x402-axios for payment handling
- HTML5 Canvas for the game
