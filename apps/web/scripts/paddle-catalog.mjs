#!/usr/bin/env node
/**
 * Creates the Tonelle catalog in Paddle (idempotent: existing products/prices are reused).
 *
 *   PADDLE_API_KEY=... node scripts/paddle-catalog.mjs          # sandbox (pdl_sdbx_ key)
 *   PADDLE_API_KEY=... node scripts/paddle-catalog.mjs --live   # live account
 *
 * Prints the price IDs to put in NEXT_PUBLIC_PADDLE_PRICE_* env vars. Amounts mirror
 * packages/shared/src/pricing.ts: EUR is the base price, Türkiye gets a TRY override.
 * Prices are tax inclusive (tax_mode "internal"), like the prices shown on the site.
 */

const live = process.argv.includes('--live');
const key = process.env.PADDLE_API_KEY;
if (!key) throw new Error('PADDLE_API_KEY is not set');
if (live === key.includes('_sdbx_')) throw new Error(`Key does not match ${live ? 'live' : 'sandbox'} mode`);
const API = live ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';

async function paddle(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path}: ${JSON.stringify(body.error)}`);
  return body.data;
}

const money = (amount, currency) => ({ amount: String(Math.round(amount * 100)), currency_code: currency });

const CATALOG = [
  {
    product: { name: 'Tonelle Premium', tax_category: 'standard', custom_data: { tonelle: 'premium' } },
    prices: [
      { plan: 'weekly', description: 'Haftalık / Weekly', eur: 3.99, try: 129.99, billing_cycle: { interval: 'week', frequency: 1 } },
      {
        plan: 'yearly',
        description: 'Yıllık, 7 gün ücretsiz / Yearly, 7-day free trial',
        eur: 24.99,
        try: 799.99,
        billing_cycle: { interval: 'year', frequency: 1 },
        trial_period: { interval: 'day', frequency: 7 },
      },
    ],
  },
  {
    product: { name: 'Tonelle Tek Rapor', tax_category: 'standard', custom_data: { tonelle: 'report' } },
    prices: [{ plan: 'report', description: 'Tek rapor / One-time report', eur: 6.99, try: 199 }],
  },
];

const products = await paddle('/products?status=active&per_page=200');
const ids = {};
for (const { product, prices } of CATALOG) {
  let p = products.find((x) => x.custom_data?.tonelle === product.custom_data.tonelle);
  if (!p) p = await paddle('/products', { method: 'POST', body: JSON.stringify(product) });
  const existing = await paddle(`/prices?product_id=${p.id}&status=active&per_page=200`);
  for (const price of prices) {
    let pr = existing.find((x) => x.custom_data?.plan === price.plan);
    if (!pr) {
      pr = await paddle('/prices', {
        method: 'POST',
        body: JSON.stringify({
          product_id: p.id,
          description: price.description,
          name: price.description,
          tax_mode: 'internal',
          unit_price: money(price.eur, 'EUR'),
          unit_price_overrides: [{ country_codes: ['TR'], unit_price: money(price.try, 'TRY') }],
          ...(price.billing_cycle ? { billing_cycle: price.billing_cycle } : {}),
          ...(price.trial_period ? { trial_period: price.trial_period } : {}),
          quantity: { minimum: 1, maximum: 1 },
          custom_data: { plan: price.plan },
        }),
      });
    }
    ids[price.plan] = pr.id;
  }
}

for (const [plan, id] of Object.entries(ids)) console.log(`NEXT_PUBLIC_PADDLE_PRICE_${plan.toUpperCase()}=${id}`);
