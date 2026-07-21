/**
 * A terminal-only demonstration of the Agent Wallet payment protocol.
 *
 * Start BotNews and BotWallet first, then run: npm run demo:agent
 * Override endpoints or the report with BOTNEWS_URL, BOTWALLET_URL, REPORT_ID,
 * AGENT_ID, and WALLET_USER_ID environment variables.
 */

type PaymentOffer = {
  merchant: string;
  resourceId: string;
  title: string;
  priceInCents: number;
  currency: string;
  paymentProvider: string;
};

type UnlockedReport = { title: string; content: string };

const botNewsUrl = (process.env.BOTNEWS_URL || 'http://localhost:3001').replace(/\/$/, '');
const botWalletUrl = (process.env.BOTWALLET_URL || 'http://localhost:8000').replace(/\/$/, '');
const reportId = process.env.REPORT_ID || 'market-report-001';
const agentId = process.env.AGENT_ID || `hackathon-agent-${crypto.randomUUID().slice(0, 8)}`;
const walletUserId = process.env.WALLET_USER_ID || 'demo-user';
const reportUrl = `${botNewsUrl}/api/reports/${encodeURIComponent(reportId)}`;

const divider = '─'.repeat(72);
const money = (cents: number, currency = 'AUD') => new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format(cents / 100);
const step = (number: number, title: string) => console.log(`\n${divider}\n${number}. ${title}`);

async function json<T>(response: Response): Promise<T> {
  const body = await response.text();
  try { return JSON.parse(body) as T; }
  catch { throw new Error(`Expected JSON from ${response.url}, received: ${body.slice(0, 100) || 'an empty response'}`); }
}

async function requestPremiumReport(): Promise<Response> {
  return fetch(reportUrl, { headers: { 'x-agent-id': agentId } });
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║                 BOTWALLET × BOTNEWS AGENT DEMO                     ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`Agent: ${agentId}\nResource: ${reportId}`);

  step(1, 'REQUEST PREMIUM ARTICLE');
  console.log(`GET ${reportUrl}`);
  const initialResponse = await requestPremiumReport();
  console.log(`← ${initialResponse.status} ${initialResponse.statusText}`);

  if (initialResponse.ok) {
    const report = await json<UnlockedReport>(initialResponse);
    console.log('\nAlready unlocked for this agent.\n');
    printReport(report);
    return;
  }
  if (initialResponse.status !== 402) throw new Error(`Expected 402 Payment Required, received ${initialResponse.status}.`);

  const offer = await json<PaymentOffer>(initialResponse);
  step(2, 'PAYMENT REQUIRED — OFFER RECEIVED');
  console.log(`Merchant: ${offer.merchant}`);
  console.log(`Article:  ${offer.title}`);
  console.log(`Price:    ${money(offer.priceInCents, offer.currency)} via ${offer.paymentProvider}`);

  step(3, 'AGENT WALLET APPROVES PAYMENT');
  console.log(`POST ${botWalletUrl}/api/agent/purchase-premium`);
  const walletResponse = await fetch(`${botWalletUrl}/api/agent/purchase-premium`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': walletUserId }
  });
  const walletPayment = await json<{ success?: boolean; error?: string }>(walletResponse);
  if (!walletResponse.ok || !walletPayment.success) throw new Error(walletPayment.error || `Wallet payment failed with ${walletResponse.status}.`);
  console.log('← 200 OK — Wallet approved and payment completed.');

  // BotNews is the merchant of record in this demo. This call records the approved
  // payment against the same agent identity, allowing the retry below to unlock it.
  step(4, 'SETTLE WITH BOTNEWS');
  console.log(`POST ${reportUrl}/purchase`);
  const settlementResponse = await fetch(`${reportUrl}/purchase`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-agent-id': agentId }, body: JSON.stringify({ agentId })
  });
  const settlement = await json<{ status?: string; error?: string }>(settlementResponse);
  if (!settlementResponse.ok || settlement.status !== 'paid') throw new Error(settlement.error || `Publisher settlement failed with ${settlementResponse.status}.`);
  console.log('← 201 Created — Publisher recorded the payment receipt.');

  step(5, 'RETRY ORIGINAL REQUEST');
  console.log(`GET ${reportUrl}`);
  const unlockedResponse = await requestPremiumReport();
  console.log(`← ${unlockedResponse.status} ${unlockedResponse.statusText}`);
  if (!unlockedResponse.ok) throw new Error(`Expected 200 OK after payment, received ${unlockedResponse.status}.`);

  step(6, 'PREMIUM ARTICLE UNLOCKED');
  printReport(await json<UnlockedReport>(unlockedResponse));
  console.log('\n✓ Demo complete — the agent detected a 402, paid within its wallet rules, and retrieved the protected content.\n');
}

function printReport(report: UnlockedReport) {
  console.log(`\n${report.title}\n${divider}`);
  console.log(report.content);
}

main().catch((error: unknown) => {
  console.error(`\n✗ Demo stopped: ${error instanceof Error ? error.message : 'Unexpected error.'}\n`);
  process.exitCode = 1;
});
