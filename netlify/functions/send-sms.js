exports.handler = async function(event, context) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const phone = data.phone;
        const projectId = data.project_id || 'proj-' + Date.now();
        
        if (!phone) {
            return { statusCode: 400, body: JSON.stringify({ error: "Phone number required" }) };
        }

        // Generate Session
        const sessionId = Math.random().toString(36).substring(2, 10);
        
        // In production, you would uncomment the Twilio code below:
        /*
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);
        
        await client.messages.create({
            body: `USS BOT: Tap to start survey: https://usstech.net/capture.html?session=${sessionId}`,
            from: process.env.TWILIO_PHONE,
            to: phone
        });
        */

        // For now, return the link so the frontend simulation works
        const captureLink = `capture.html?session=${sessionId}&proj=${projectId}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: "sent",
                session_id: sessionId,
                link: captureLink,
                debug_note: "SMS simulated. Check Netlify logs for real integration."
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process SMS request" })
        };
    }
};
