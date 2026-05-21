/**
 * QuoteService - Unified Lead Submission Engine
 * Handles all lead and quote requests across the Ultimate Security Solutions site.
 */
class QuoteService {
    constructor() {
        this.config = {
            // Leads are submitted via the serverless proxy to keep the API key server-side
            productionUrl: '/api/submit-lead',
            fallbackEmail: 'admin@usstech.net'
        };
    }

    /**
     * Submits a lead request
     * @param {Object} data { name, email, phone, company, message, source, cart }
     * @returns {Promise<{success: boolean, method: 'API' | 'FALLBACK', error?: string}>}
     */
    async submitLead(data) {
        console.log('[QuoteService] Initiating submission:', data);

        const payload = {
            id: crypto.randomUUID(),
            contact: data.name,
            email: data.email,
            phone: data.phone || 'N/A',
            company: data.company || 'N/A',
            notes: this._formatNotes(data),
            source: data.source || 'Website',
            status: 'New',
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(this.config.productionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                return { success: true, method: 'API' };
            } else {
                throw new Error(`API returned status ${response.status}`);
            }
        } catch (error) {
            console.warn('[QuoteService] API submission failed, triggering fallback:', error);
            return this.handleFallback(data);
        }
    }

    async submitCheckout(data) {
        console.log('[QuoteService] Initiating checkout:', data);
        try {
            const response = await fetch('/.netlify/functions/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok && result.url) {
                window.location.href = result.url;
                return { success: true, method: 'STRIPE' };
            } else {
                throw new Error(result.error || 'Checkout initialization failed');
            }
        } catch (error) {
            console.error('[QuoteService] Checkout Error:', error);
            // alert('Secure checkout is currently unavailable. Initiating fallback.');
            return this.handleFallback(data);
        }
    }

    /**
     * Generates a mailto link as a fail-safe
     */
    handleFallback(data) {
        const subject = `Quote Request: ${data.name} (${data.source || 'Website'})`;
        const body = `NAME: ${data.name}\nEMAIL: ${data.email}\nPHONE: ${data.phone || 'N/A'}\nCOMPANY: ${data.company || 'N/A'}\n\nNOTES:\n${this._formatNotes(data)}`;
        
        const mailtoUrl = `mailto:${this.config.fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Return success info but indicate fallback was used
        return { success: true, method: 'FALLBACK', mailtoUrl };
    }

    _formatNotes(data) {
        let notes = data.message || '';
        if (data.cart && data.cart.length > 0) {
            notes += `\n\nSELECTED EQUIPMENT:\n` + data.cart.map(i => `- ${i.name} (${i.sku}) x${i.quantity}`).join('\n');
        }
        return notes;
    }
}

// Export for global use
window.QuoteEngine = new QuoteService();
