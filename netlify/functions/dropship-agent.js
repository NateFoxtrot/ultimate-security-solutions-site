/**
 * dropship-agent.js — Netlify Function
 * =====================================
 * Credential-gated dropshipping fulfillment endpoint.
 *
 * Polled by an external agent or cron job. Checks Stripe for completed
 * checkouts with fulfillment_status='pending', marks them 'processing',
 * and queues them for supplier fulfillment.
 *
 * Setup:
 *   1. Set STRIPE_SECRET_KEY in Netlify env vars.
 *   2. Set DROPSHIP_API_KEY for agent authentication (caller must provide).
 *   3. Set DROPSHIP_SUPPLIER_URL + DROPSHIP_SUPPLIER_KEY for supplier API.
 *
 * Endpoints:
 *   GET  /.netlify/functions/dropship-agent?action=status
 *        Returns count of pending/processing orders.
 *   POST /.netlify/functions/dropship-agent
 *        Body: { action: "poll" | "fulfill" | "mark-shipped", api_key, ... }
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ── Auth Gate ──────────────────────────────────────────────────────
function authenticate(event) {
    const agentKey = process.env.DROPSHIP_API_KEY;
    if (!agentKey) {
        return { ok: false, error: 'DROPSHIP_API_KEY not configured on server' };
    }
    const provided = event.headers['x-api-key']
        || (event.body && JSON.parse(event.body).api_key);
    if (provided !== agentKey) {
        return { ok: false, error: 'Unauthorized: invalid api_key' };
    }
    return { ok: true };
}

// ── Helpers ────────────────────────────────────────────────────────
async function getPendingSessions() {
    const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        expand: ['data.line_items'],
    });
    return sessions.data.filter(s =>
        s.metadata?.fulfillment_status === 'pending'
        && s.payment_status === 'paid'
    );
}

async function updateFulfillmentStatus(sessionId, status) {
    await stripe.checkout.sessions.update(sessionId, {
        metadata: { fulfillment_status: status },
    });
}

// ── Main Handler ───────────────────────────────────────────────────
exports.handler = async (event) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: '',
        };
    }

    // Auth gate
    const auth = authenticate(event);
    if (!auth.ok) {
        return {
            statusCode: 401,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: auth.error }),
        };
    }

    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        // GET: status check
        if (event.httpMethod === 'GET') {
            const params = event.queryStringParameters || {};
            const pending = await getPendingSessions();
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    pending_count: pending.length,
                    orders: pending.map(s => ({
                        id: s.id,
                        amount: s.amount_total,
                        customer: s.customer_details?.email,
                        created: s.created,
                    })),
                }),
            };
        }

        // POST: actions
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const { action } = body;

            switch (action) {
                case 'poll': {
                    // Return pending orders without changing state
                    const pending = await getPendingSessions();
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({
                            pending_count: pending.length,
                            orders: pending.map(s => ({
                                id: s.id,
                                amount_total: s.amount_total,
                                currency: s.currency,
                                customer_email: s.customer_details?.email,
                                shipping: s.shipping_details,
                                line_items: s.line_items?.data?.map(li => ({
                                    description: li.description,
                                    amount: li.amount_total,
                                    quantity: li.quantity,
                                })),
                                metadata: s.metadata,
                                created: new Date(s.created * 1000).toISOString(),
                            })),
                        }),
                    };
                }

                case 'fulfill': {
                    // Mark a session as processing (credential-gated supplier call)
                    const { session_id } = body;
                    if (!session_id) {
                        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'session_id required' }) };
                    }

                    const supplierUrl = process.env.DROPSHIP_SUPPLIER_URL;
                    const supplierKey = process.env.DROPSHIP_SUPPLIER_KEY;

                    if (!supplierUrl || !supplierKey) {
                        // No supplier configured — just mark as processing
                        await updateFulfillmentStatus(session_id, 'processing');
                        return {
                            statusCode: 200,
                            headers: corsHeaders,
                            body: JSON.stringify({
                                status: 'processing',
                                note: 'Supplier not configured. Order marked processing locally only.',
                            }),
                        };
                    }

                    // Supplier integration point: POST order to supplier API
                    const session = await stripe.checkout.sessions.retrieve(session_id);
                    const supplierResponse = await fetch(supplierUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${supplierKey}`,
                        },
                        body: JSON.stringify({
                            order_ref: session.id,
                            shipping: session.shipping_details,
                            line_items: session.line_items?.data,
                            customer_email: session.customer_details?.email,
                        }),
                    });

                    if (supplierResponse.ok) {
                        await updateFulfillmentStatus(session_id, 'submitted_to_supplier');
                        return {
                            statusCode: 200,
                            headers: corsHeaders,
                            body: JSON.stringify({ status: 'submitted_to_supplier' }),
                        };
                    } else {
                        const errText = await supplierResponse.text().catch(() => 'Unknown');
                        console.error('[dropship] Supplier API error:', errText);
                        return {
                            statusCode: 502,
                            headers: corsHeaders,
                            body: JSON.stringify({ error: 'Supplier API rejected order', detail: errText }),
                        };
                    }
                }

                case 'mark-shipped': {
                    const { session_id, tracking_number, carrier } = body;
                    if (!session_id) {
                        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'session_id required' }) };
                    }

                    await stripe.checkout.sessions.update(session_id, {
                        metadata: {
                            fulfillment_status: 'shipped',
                            tracking_number: tracking_number || '',
                            carrier: carrier || '',
                        },
                    });

                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({ status: 'shipped' }),
                    };
                }

                default:
                    return {
                        statusCode: 400,
                        headers: corsHeaders,
                        body: JSON.stringify({ error: `Unknown action: ${action}. Valid: poll, fulfill, mark-shipped` }),
                    };
            }
        }

        return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    } catch (error) {
        console.error('[dropship-agent] Error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
        };
    }
};
