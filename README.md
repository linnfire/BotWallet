# BotWallet (AI Agent Wallet)

so basically: Bots are blocked, but bots can be customers! ^o^
instead of blocking ai bots websites can charge them and let them buy access automatically. 

payment systems, front end with buttons are designed for humans and bots cannot buy stuff. Usually they clog traffic, scrape websites and are annoying. But what if they were paying customers? Now bots can buy information (news articles), even clothes, aeroplane tickets, anything!


BotWallet is an autonomous AI agent that can research, compare options, and complete approved purchases. It follows the user’s spending rules, daily budget, and auto-approval limits through Pinch Payments.

## Run locally

1. Copy `.env.example` to `.env` and add your Pinch **test** credentials from the Developer Portal. `VITE_PINCH_PUBLISHABLE_KEY` must be a public `pk_…` key; never place the client secret in a Vite variable.
2. Install packages: `npm install`
3. Start the app: `npm run dev`
4. Open `http://localhost:5173`.

## Run the terminal demo

With BotWallet running and BotNews started from `/Users/melinda/Desktop/BotNews` (`npm run dev`), run:

```bash
npm run demo:agent
```

The standalone [`agent.ts`](./agent.ts) requests a BotNews premium article, handles its `402 Payment Required` offer, obtains approval through BotWallet, records the approved payment with BotNews, and retries the article request. Optional environment variables: `BOTNEWS_URL`, `BOTWALLET_URL`, `REPORT_ID`, `AGENT_ID`, and `WALLET_USER_ID`.

The application uses the documented Pinch flow:

1. `ConnectWalletModal` loads CaptureJS with its published SRI hash.
2. Card fields are tokenised in the browser with `Pinch.Capture({ publishableKey }).createToken(...)`.
3. Only the short-lived token is sent to `POST /api/pinch/connect-wallet`.
4. The server obtains an OAuth client-credentials token, creates the Payer once, then adds a `credit-card` Payment Source. It stores only Pinch IDs—never PAN, expiry, or CVC.
5. A budget-approved research request calls Pinch’s realtime payment endpoint with the stored Payer and source IDs.

## API routes

- `GET /api/pinch/wallet` — wallet status and recent purchases
- `POST /api/pinch/connect-wallet` — accepts `{ "creditCardToken": "…" }`
- `PATCH /api/pinch/wallet` — saves `{ "dailyLimitCents", "autoApproveCents" }`
- `POST /api/agent/purchase-premium` — makes the $1.00 realtime purchase after enforcing wallet rules

The included `authenticatedUserId` is a deliberately small demo adapter (defaults to `demo-user`, or accepts `X-User-Id`). Replace it with the project’s actual session/JWT identity before deployment. `server/wallets.json` is local demo persistence; use an encrypted production database and secrets manager in production.

Run `npm run build` to produce the Vite client bundle and compiled Express server; then use `NODE_ENV=production npm start`.
