/**
 * stripe-webhook.js — Netlify Function
 * =====================================
 * Receives Stripe webhook events, verifies the signature, and
 * acknowledges receipt. The dropship agent polls Stripe independently
 * but this endpoint ensures Stripe isn't left hanging on a timeout.
 *
 * Setup:
 *   1. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *        URL: https://your-site.netlify.app/.netlify/functions/stripe-webhook
 *        Events: checkout.session.completed
 *   2. Copy the "Signing secret" and set it as STRIPE_WEBHOOK_SECRET in Netlify env vars.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const sig     = event.headers['stripe-signature'];
    const secret  = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
        console.warn('[Webhook] STRIPE_WEBHOOK_SECRET not set — skipping verification.');
        return { statusCode: 200, body: JSON.stringify({ received: true }) };
    }

    let stripeEvent;
    try {
        stripeEvent = stripe.webhooks.constructEvent(
            event.body,   // Pass raw body string for signature verification
            sig,
            secret
        );
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    // Log the event type
    console.log(`[Webhook] Received event: ${stripeEvent.type}`);

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;
        console.log(`[Webhook] Checkout completed — Session ID: ${session.id}`);
        console.log(`[Webhook] Amount: $${(session.amount_total / 100).toFixed(2)}`);
        console.log(`[Webhook] Fulfillment status: ${session.metadata?.fulfillment_status}`);
        // The dropship agent will pick this up on its next poll cycle.
        // No action needed here beyond acknowledgement.
    }

    // Always return 200 quickly so Stripe doesn't retry
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ received: true })
    };
};
