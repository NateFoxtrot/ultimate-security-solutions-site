const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;
const fs = require('fs');
const path = require('path');

// Load and parse the products.js file securely on the server
function loadCatalog() {
    try {
        const filePath = path.join(__dirname, '../../products.js');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonStr = fileContent.substring(fileContent.indexOf('['), fileContent.lastIndexOf(']') + 1);
        const products = JSON.parse(jsonStr);
        return products.flatMap(p => p.variants || []);
    } catch (e) {
        console.error('Failed to parse catalog', e);
        return [];
    }
}

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        if (!stripe) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Stripe is not configured' }) };
        }

        const data = JSON.parse(event.body);
        const { cart, source } = data;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Cart is empty or invalid' }) };
        }

        const catalog = loadCatalog();
        
        // Build line items securely
        const lineItems = cart.map(item => {
            const catalogItem = catalog.find(ci => ci.sku === item.sku);
            if (!catalogItem) {
                throw new Error(`Item ${item.sku} not found found in catalog`);
            }
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: catalogItem.name,
                        description: `SKU: ${catalogItem.sku}`,
                    },
                    unit_amount: Math.round(catalogItem.price * 100), // Stripe expects cents
                },
                quantity: item.quantity,
            };
        });

        // Add a shipping placeholder
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Shipping & Handling',
                    description: 'Standard Insured Drop-ship',
                },
                unit_amount: 2500, // $25 flat rate
            },
            quantity: 1
        });

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB'],
            },
            phone_number_collection: {
                enabled: true,
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.URL || 'http://localhost:3000'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL || 'http://localhost:3000'}/ordering_system.html`,
            metadata: {
                // The Drop-ship agent will look for this flag
                fulfillment_status: 'pending',
                order_origin: source || 'Secure Checkout'
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ url: session.url })
        };

    } catch (error) {
        console.error('Stripe Error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message || 'Internal Server Error' })
        };
    }
};
