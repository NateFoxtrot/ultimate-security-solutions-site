/**
 * Netlify Function: submit-lead
 * Proxies lead submissions to Insforge API, keeping the API key server-side.
 *
 * Required environment variables:
 *   LEAD_API_KEY  - Insforge JWT API key
 *   LEAD_API_URL  - (optional) Insforge leads endpoint URL
 */

const DEFAULT_API_URL = 'https://j2mp6xb5.us-east.insforge.app/rest/v1/leads';

exports.handler = async (event, context) => {
    // CORS preflight — MUST come before method check
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    const apiKey = process.env.LEAD_API_KEY;
    if (!apiKey) {
        console.error('[submit-lead] LEAD_API_KEY environment variable is not set');
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Server configuration error' })
        };
    }

    const apiUrl = process.env.LEAD_API_URL || DEFAULT_API_URL;

    try {
        const payload = JSON.parse(event.body);

        // Basic validation
        if (!payload.contact && !payload.email) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Missing required fields: contact or email' })
            };
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: true })
            };
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error('[submit-lead] Upstream API error:', response.status, errorText);
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: `Upstream API returned status ${response.status}` })
            };
        }
    } catch (error) {
        console.error('[submit-lead] Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
