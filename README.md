# BotWallet

**BotWallet is an autonomous AI agent wallet that lets AI agents become paying customers.**

Instead of blocking AI bots, websites can charge them and let them buy access automatically.

## Basically: bots can be customers!

Instead of blocking ai bots websites can charge them and let them buy access automatically.

payment systems, front end with buttons are designed for humans and bots cannot buy stuff. usually they clog traffic, scrape websites and are annoying. what if they were paying customers? Now bots can buy information (news articles), even clothes, aeroplane tickets, anything!

BotWallet is an autonomous AI agent that can research, compare options, and complete approved purchases. It follows the user’s spending rules, daily budget, and auto-approval limits through Pinch Payments.

---

# How It Works

BotWallet allows an AI agent to interact with websites and make purchases without needing a human to click through a traditional checkout.

For example, in our demo:

1. The agent requests a premium news article from BotNews.
2. BotNews responds with `402 Payment Required` and provides the available payment offer.
3. The agent reads the payment requirement.
4. BotWallet checks the agent's Bot Limit and spending rules.
5. If the payment is allowed, BotWallet completes the payment through Pinch.
6. BotNews records the payment.
7. The agent retries the original request.
8. BotNews returns `200 OK` and gives the agent the premium article.

This same model can be used for other online purchases, including information, subscriptions, clothing, travel, airline tickets, and other services.

The key idea is simple: **websites can treat bots as customers instead of just blocking them.**

---

# 402 Payment Flow

The terminal demo shows the machine-to-machine payment flow directly.

```text
AI Agent
    │
    │ Request protected resource
    ▼
BotNews
    │
    │ 402 Payment Required
    │ Payment offer + price
    ▼
BotWallet
    │
    │ Check Bot Limit
    │ Check spending rules
    ▼
Pinch Payments
    │
    │ Payment completed
    ▼
BotNews
    │
    │ Payment confirmed
    ▼
AI Agent
    │
    │ Retry request
    ▼
BotNews
    │
    │ 200 OK
    │ Premium content
    ▼
AI Agent
```

The `402 Payment Required` response allows a website to communicate payment requirements directly to an AI agent using standard HTTP semantics.

The agent does not need to navigate a human checkout interface or press buttons. It can receive the payment requirement, check its rules, pay, and request the resource again.

---

# Demo

The project includes a standalone CLI agent demo.

The demo shows:

* The agent requesting a protected BotNews article
* BotNews returning `402 Payment Required`
* The agent receiving the payment offer
* BotWallet checking the Bot Limit
* The payment being completed through Pinch
* BotNews recording the payment
* The agent retrying the original request
* BotNews returning `200 OK`
* The premium article being unlocked

Run:

```bash
npm run demo:agent
```

The agent can also be run with:

```bash
npm run demo:agent -- --pay
```

The CLI is implemented in [`agent.ts`](./agent.ts).

---

# How We Built BotWallet with Codex and GPT-5.6

Everyone has ideas. The hard part is execution, and even harder is knowing which idea is actually worth building.

Our original idea was simple: **build a bot that could block other bots.**

But while asking GPT-5.6 and Codex, they questioned whether that was actually the right problem to solve.

Instead of **"How do we stop bots?"**, we started asking, **"What if bots could become customers?"**

That changed the direction of the project.

AI agents are not going away. They are going to search, compare, and eventually buy things on behalf of people. Instead of treating agents as a problem that websites need to block, we built a system that lets websites **monetise them**.

That became the core idea behind BotWallet:

> **Bots can be customers.**

This was one of the biggest ways GPT-5.6 and Codex influenced the project. They didn't just help us implement the idea we started with. They helped us question whether our original idea was actually the right one.

## From "make it unhackable" to "make it useful"

At one point, our thinking was heavily focused on security.

We were thinking about how to make the wallet as safe as possible, how many guardrails we could add, and how to make sure an agent could never be hacked or spend too much.

Those things are important, but we realised we were starting to over-engineer the problem before proving that the product itself was something people and businesses actually wanted.

GPT-5.6 and Codex helped us step back and look at the bigger picture.

The real problem was not simply:

> "How do we build a safer bot?"

It was:

> **"How do we make autonomous agents useful participants in the real economy?"**

This led us to think about the merchant side as well as the agent side.

The result is a system where agents can discover that something requires payment, websites can communicate prices and payment options directly to machines, BotWallet checks the agent's spending rules, payments can happen automatically through Pinch, and merchants can receive payment before giving access.

The same model can extend beyond news to other online purchases such as products, subscriptions, travel, and other services.

The security and spending controls still matter, but they now support the larger product instead of becoming the product itself.

## How Codex accelerated development

Codex was used throughout development to turn the product ideas into a working system.

It helped us:

* Design and implement the BotWallet architecture
* Build the agent payment flow
* Implement the HTTP `402 Payment Required` flow
* Create BotNews as a machine-readable merchant
* Integrate Pinch Payments
* Build Bot Limit spending controls
* Build the standalone CLI agent demo
* Connect the agent, wallet, merchant, and payment provider
* Debug payment failures and integration issues
* Iterate on the frontend and user experience
* Test the complete end-to-end payment and settlement flow

The biggest difference was that Codex was not treated as just a code generator.

We could give it a high-level goal, discuss the problem with GPT-5.6, make a plan, and then have Codex implement it directly inside the codebase.

We could then test the result, see what worked or failed, feed that information back into the process, and continue iterating.

## GPT-5.6 + Codex: a selfimproving development loop

One of the most useful parts of the workflow was using GPT-5.6 and Codex together.

GPT-5.6 was useful for stepping back and thinking through the problem. We could use it to explore ideas, challenge our assumptions, identify gaps, and work out what should actually be built.

We could then use GPT-5.6 to create a detailed prompt for Codex. We would paste that prompt into Codex, let it implement the changes directly in the project, test the result, and then use the results to start the next cycle.

The workflow was essentially:

```text
Idea
  ↓
GPT-5.6
Think through the problem and challenge the idea
  ↓
GPT-5.6
Create a clear implementation prompt
  ↓
Codex
Implement the changes inside the codebase
  ↓
Test the result
  ↓
Feed the result back
  ↓
GPT-5.6 + Codex
Improve, debug, and iterate
  ↓
Working product
```

This was more useful than simply asking an AI to write code.

GPT-5.6 helped us think about **what should be built and why**.

Codex helped us figure out **how to build it inside a real codebase and actually make it work**.

We could repeat this cycle throughout development. Codex could also help generate follow-up prompts and continue working from the results of previous tasks, making the process much more hands-off than a typical coding assistant workflow.

Eg, we could start with a vague stuff like:

> "Build a bot that can pay for stuff."

GPT-5.6 and Codex helped turn that into a much more complete system involving a machine-readable merchant, HTTP 402 payment requests, Bot Limit spending controls, Pinch payments, payment settlement, and an agent that can automatically pay and retry the original request.

## Where we made the key product and engineering decisions

GPT-5.6 and Codex contributed heavily to the development process, but the key product direction came from the conversations and decisions we made together.

### 1. Bots should be customers, not just traffic

Instead of building another tool to block or detect bots, we decided to build infrastructure that lets websites charge them.

The idea is simple: if an AI agent wants access to something, the website should be able to say what it costs and let the agent pay for it.

### 2. Use HTTP 402 for machine-to-machine payments

We chose the `402 Payment Required` flow because it gives a standard way for a website to tell an agent:

> "You can have this resource, but you need to pay first."

The agent can receive the payment requirements directly from the server without needing to navigate a human checkout page or press buttons.

This creates a machine-to-machine payment flow that can work with APIs, websites, and AI agents.

### 3. Put spending rules between the agent and payment

We decided that an agent should not have unlimited access to money.

BotWallet checks the Bot Limit and spending rules before allowing a payment. This means the agent can act autonomously while still operating within limits set by the user.

### 4. Separate the agent, wallet, merchant, and payment provider

We designed the system so that the agent, BotWallet, BotNews, and Pinch each have separate roles.

The agent requests the resource.

BotNews acts as the merchant and returns the payment requirement.

BotWallet checks whether the payment is allowed.

Pinch processes the payment.

BotNews then records the payment and provides the protected content.

This separation makes the concept easier to extend to other merchants and types of purchases.

### 5. Prove the concept with a real end-to-end flow

Instead of only building a UI mockup, we built a working machine-to-machine demo.


This made the concept tangible and testable.

## The impact of GPT-5.6 and Codex

The biggest contribution of GPT-5.6 and Codex was not any individual line of code.

It was helping us think beyond our first idea and find the SWEET SPOT between what is technically possible and what solves a real problem that people and businesses actually have a need and desire for.

Our initial thinking was focused on what we could build technically. We were thinking about blocking bots and making the wallet as secure as possible.

Through the development process, we became much more focused on what people and businesses would actually want.

That led us from:

> **"How do we stop bots?"**

to opening our mindset to:

> **"How do we let bots become paying customers?"**

GPT-5.6 helped us challenge our shalllow assumptions, think through real-world problems, and work out the direction of the product.

Codex helped us turn those decisions into working software, test them, debug them, and keep iterating.

Together, they helped us move through the full cycle of **idea → strategy → architecture → implementation → testing → debugging → refinement** much faster than we could have done alone.


It felt like having an engineer, strategist, and co-founder working alongside us.

### Big decisions

Some of the key product and engineering decisions were:

* Using HTTP `402 Payment Required` so websites can communicate payment requirements directly to AI agents
* Separating the AI agent, BotWallet, payment provider, and merchant
* Using Bot Limit to control how much an agent can spend
* Checking spending rules before allowing payments
* Allowing the agent to retry the original request after payment confirmation
* Creating a standalone CLI demo to show the machine-to-machine flow without relying on a human-facing checkout UI


---

# Project Structure

The repository includes both the BotWallet application and the BotNews demo merchant so the complete payment flow can be tested from one repository.

```text
BotWallet/
├── src/                 # BotWallet frontend
├── server/              # BotWallet backend and Pinch integration
├── agent.ts             # Standalone AI agent CLI demo
├── BotNews/             # Demo merchant / protected news website
├── package.json
└── README.md
```

**BotWallet** is the main project.

**BotNews** is the demo merchant used to demonstrate how a website can return a `402 Payment Required` response and sell protected content to an AI agent.

---

# Setup

## Requirements

* Node.js
* npm
* Pinch Payments test credentials

## 1. Clone the repository

```bash
git clone https://github.com/linnfire/BotWallet.git
cd BotWallet
```

## 2. Install BotWallet

```bash
npm install
```

## 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Add your Pinch **test** credentials.

`VITE_PINCH_PUBLISHABLE_KEY` must be a public `pk_...` key.

**Never put the Pinch client secret in a Vite environment variable or expose it in frontend code.**

---

# Run BotWallet

From the root `BotWallet` folder:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Run BotNews

Open a second Terminal window.

Go into the included BotNews folder:

```bash
cd BotNews
```

Install dependencies:

```bash
npm install
```

Start BotNews:

```bash
npm run dev
```

BotNews acts as the demo merchant and provides the protected premium article used in the agent demo.

---

# Run the Agent Demo

Make sure both BotWallet and BotNews are running.

From the root BotWallet folder:

```bash
npm run demo:agent
```

The demo uses:

* `BOTNEWS_URL`
* `BOTWALLET_URL`
* `REPORT_ID`
* `AGENT_ID`
* `WALLET_USER_ID`

These can be configured with environment variables if required.

---

# Pinch Payment Integration

The application uses the documented Pinch payment flow:

1. `ConnectWalletModal` loads Pinch CaptureJS with its published SRI hash.
2. Card fields are tokenised in the browser using `Pinch.Capture({ publishableKey }).createToken(...)`.
3. Only the short-lived token is sent to `POST /api/pinch/connect-wallet`.
4. The server obtains an OAuth client-credentials token.
5. The server creates the Payer and adds a `credit-card` Payment Source.
6. Only Pinch IDs are stored. The application never stores the card number, expiry date, or CVC.
7. A budget-approved agent request calls the Pinch realtime payment endpoint using the stored Payer and payment source IDs.

---

# API Routes

* `GET /api/pinch/wallet` — wallet status and recent purchases
* `POST /api/pinch/connect-wallet` — accepts `{ "creditCardToken": "…" }`
* `PATCH /api/pinch/wallet` — saves `{ "dailyLimitCents", "autoApproveCents" }`
* `POST /api/agent/purchase-premium` — makes the realtime purchase after enforcing Bot Limit rules

The included `authenticatedUserId` is a small demo adapter that defaults to `demo-user` or accepts `X-User-Id`.

For production deployment, replace this with the application's real session or JWT identity.

`server/wallets.json` is used for local demo persistence. A production deployment should use an encrypted database and a secure secrets manager.

---

# Production Build

Build the project:

```bash
npm run build
```

Then run the production server:

```bash
NODE_ENV=production npm start
```

---

# Testing the Full Demo

The recommended judging flow is:

1. Start BotNews.
2. Start BotWallet.
3. Run the agent CLI.
4. Watch the agent request the premium resource.
5. See the `402 Payment Required` response.
6. See the payment offer received by the agent.
7. See BotWallet check the Bot Limit.
8. See the Pinch payment complete.
9. See BotNews record the payment.
10. See the agent retry the request.
11. See the `200 OK` response.
12. See the premium article returned to the agent.

This demonstrates the complete machine-to-machine payment flow without requiring a human to manually navigate a checkout page.
