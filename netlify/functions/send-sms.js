const https = require('https');
const querystring = require('querystring');

exports.handler = async function(event, context) {
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

        const sessionId = Math.random().toString(36).substring(2, 10);
        const captureLink = `https://usstech.net/capture.html?session=${sessionId}&proj=${projectId}`;

        // REAL TWILIO INTEGRATION
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

        const postData = querystring.stringify({
            'To': phone,
            'MessagingServiceSid': messagingServiceSid,
            'Body': `USS BOT: Tap here to start your interactive site survey: ${captureLink}`
        });

        const options = {
            hostname: 'api.twilio.com',
            port: 443,
            path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')
            }
        };

        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => resolve({ statusCode: res.statusCode, body }));
            });
            req.on('error', reject);
            req.write(postData);
            req.end();
        });

        if (response.statusCode >= 200 && response.statusCode < 300) {
            return {
                statusCode: 200,
                body: JSON.stringify({ status: "sent", session_id: sessionId, link: captureLink })
            };
        } else {
            console.error("Twilio Error:", response.body);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Twilio API error", detail: response.body })
            };
        }

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        };
    }
};