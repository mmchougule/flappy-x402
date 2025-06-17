# Environment File Setup Guide

## Server .env File (`flappy-x402/server/.env`)

Create a file named `.env` in the `server` directory with the following content:

```env
# x402 Configuration
FACILITATOR_URL=https://x402.org/facilitator
NETWORK=base-sepolia
ADDRESS=0xYOUR_WALLET_ADDRESS_HERE

# Server Configuration
PORT=3001

# Game Configuration (optional - defaults are set in code)
GAME_PRICE=0.001
SESSION_DURATION_MINUTES=10
```

### Server Environment Variables Explained:

- **ADDRESS**: Your Ethereum wallet address that will receive the USDC payments
  - Format: `0x` followed by 40 hexadecimal characters
  - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f6789a`
  - This is where all game payments will be sent

- **FACILITATOR_URL**: The x402 facilitator service URL
  - Use: `https://x402.org/facilitator` (default)
  
- **NETWORK**: The blockchain network
  - Use: `base-sepolia` for testing
  - Alternative: `base` for mainnet (requires real USDC)

- **PORT**: Server port (default: 3001)

- **GAME_PRICE**: Price per game in USD (default: 0.001)

- **SESSION_DURATION_MINUTES**: How long a game session lasts (default: 10)

## Client .env File (`flappy-x402/client/.env`)

Create a file named `.env` in the `client` directory with the following content:

```env
# Your private key for signing transactions
VITE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# API base URL
VITE_API_BASE_URL=http://localhost:3001
```

### Client Environment Variables Explained:

- **VITE_PRIVATE_KEY**: Your wallet's private key for signing transactions
  - Format: `0x` followed by 64 hexadecimal characters
  - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
  - ⚠️ **NEVER share or commit this to git!**
  - ⚠️ **Only use a testnet wallet with small amounts!**

- **VITE_API_BASE_URL**: The backend server URL
  - Local development: `http://localhost:3001`
  - Production: Your deployed server URL

## Getting Your Wallet Details

### 1. Create a Test Wallet
For safety, create a new wallet specifically for testing:
- Use MetaMask or any Ethereum wallet
- Save the private key and address

### 2. Get Base Sepolia ETH
You need ETH for gas fees:
- Visit: https://docs.base.org/tools/network-faucets/
- Or use: https://www.alchemy.com/faucets/base-sepolia
- Request some test ETH to your wallet address

### 3. Get Base Sepolia USDC
You need USDC for game payments:
- Option 1: Use a testnet USDC faucet
- Option 2: Bridge USDC from Ethereum Sepolia to Base Sepolia
- You only need a small amount (e.g., 1 USDC = 1000 games)

### 4. Find Your Private Key
In MetaMask:
1. Click the three dots menu
2. Select "Account details"
3. Click "Export private key"
4. Enter your password
5. Copy the private key (without 0x prefix)
6. Add `0x` prefix when putting in .env

## Security Best Practices

1. **Never commit .env files to git** (they're already in .gitignore)
2. **Use separate wallets for testing and production**
3. **In production, use wallet connectors instead of private keys**
4. **Keep only small amounts in test wallets**

## Example Working Configuration

Here's an example with dummy values:

**Server .env:**
```env
FACILITATOR_URL=https://x402.org/facilitator
NETWORK=base-sepolia
ADDRESS=0x1234567890123456789012345678901234567890
PORT=3001
```

**Client .env:**
```env
VITE_PRIVATE_KEY=0x1234567890123456789012345678901234567890123456789012345678901234
VITE_API_BASE_URL=http://localhost:3001
```

Replace these with your actual wallet address and private key! 