(function() {
    // USS AI Concierge - Enhanced Knowledge-driven Security Assistant
    const conciergeHTML = `
        <div id="uss-concierge" style="position:fixed; bottom:2rem; left:2rem; z-index:5000; font-family:'Segoe UI', Tahoma, sans-serif;">
            <div id="concierge-chat" style="display:none; width:350px; height:500px; background:#0f1c2e; border:1px solid #ffd700; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden;">
                <div style="background:#ffd700; color:#050b14; padding:1rem; font-weight:800; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-microchip"></i>
                        <span>USS INTELLIGENCE CORE</span>
                    </div>
                    <i class="fas fa-times" onclick="toggleConcierge(false)" style="cursor:pointer;"></i>
                </div>
                <div id="concierge-messages" style="flex-grow:1; overflow-y:auto; padding:1rem; color:#e6f1ff; font-size:0.9rem; background: rgba(5, 11, 20, 0.5);">
                    <div style="margin-bottom:1rem; border-left:2px solid #ffd700; padding-left:10px; font-style: italic; opacity: 0.8;">
                        [SYSTEM ONLINE] USS Intelligence Core initialized. Awaiting technical query...
                    </div>
                    <div style="margin-bottom:1rem; border-left:2px solid #ffd700; padding-left:10px;">
                        Hello Engineer. I am your Design Assistant. I have access to our full hardware catalog and tactical deployment standards. How can I assist?
                    </div>
                </div>
                <div style="padding:1rem; border-top:1px solid rgba(255,215,0,0.2); display:flex; gap:10px; background: #0f1c2e;">
                    <input type="text" id="concierge-input" placeholder="Ask about products, pricing, or specs..." style="flex:1; background:rgba(0,0,0,0.3); border:1px solid #ffd700; color:white; padding:0.5rem; border-radius:4px;">
                    <button onclick="handleConciergeMessage()" style="background:#ffd700; border:none; padding:0.5rem 1rem; cursor:pointer; border-radius:4px;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="concierge-trigger" onclick="toggleConcierge(true)" style="width:60px; height:60px; background:#ffd700; color:#050b14; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 5px 20px rgba(0,0,0,0.4); border: 2px solid #050b14;">
                <i class="fas fa-robot" style="font-size:1.5rem;"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', conciergeHTML);

    window.toggleConcierge = function(show) {
        document.getElementById('concierge-chat').style.display = show ? 'flex' : 'none';
        document.getElementById('concierge-trigger').style.display = show ? 'none' : 'flex';
        if(show) document.getElementById('concierge-input').focus();
    };

    function addMessage(text, isUser = false) {
        const container = document.getElementById('concierge-messages');
        const div = document.createElement('div');
        div.style.marginBottom = '1rem';
        
        if(isUser) {
            div.style.textAlign = 'right';
            div.innerHTML = `<span style="background:rgba(14, 165, 233, 0.2); padding:8px 12px; border-radius:12px 12px 0 12px; display:inline-block; border: 1px solid rgba(14, 165, 233, 0.3);">${text}</span>`;
        } else {
            div.style.borderLeft = '2px solid #ffd700';
            div.style.paddingLeft = '10px';
            div.style.background = 'rgba(255, 215, 0, 0.03)';
            div.style.padding = '10px';
            div.innerHTML = text;
        }
        
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    window.handleConciergeMessage = function() {
        const input = document.getElementById('concierge-input');
        const query = input.value.trim();
        if(!query) return;

        addMessage(query, true);
        input.value = '';

        // Processing Animation
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '<i class="fas fa-sync fa-spin"></i> Analyzing core data...';
        loadingDiv.style.fontSize = '0.7rem';
        loadingDiv.style.color = '#ffd700';
        document.getElementById('concierge-messages').appendChild(loadingDiv);

        setTimeout(() => {
            loadingDiv.remove();
            let response = "I have analyzed your query. For specialized architectural design, please consult our <strong>System Designer</strong> or contact a Lead Engineer.";
            
            const lowQuery = query.toLowerCase();

            // 1. Search Product Catalog
            if (typeof products !== 'undefined') {
                const found = products.filter(p => 
                    lowQuery.includes(p.series_id.toLowerCase()) || 
                    lowQuery.includes(p.name.toLowerCase())
                );

                if (found.length > 0) {
                    const p = found[0];
                    response = `<strong>Product Found:</strong> ${p.name}<br>
                                <strong>SKU:</strong> ${p.series_id}<br>
                                <strong>MSRP:</strong> ${p.variants[0].price ? '$' + p.variants[0].price.toFixed(2) : 'Contact for Quote'}<br>
                                <a href="ordering_system.html?cat=camera" style="color:#ffd700; text-decoration:underline;">View in Catalog</a>`;
                }
            }

            // 2. Technical Standards
            if(lowQuery.includes('cat6')) response = "Per TIA-606-C, Cat6 runs should not exceed 90m for permanent links. We utilize shielded Cat6a for high-interference industrial environments.";
            if(lowQuery.includes('fiber')) response = "We specialize in Single Mode and Multi-mode fiber terminations. All fiber spans are certified with OTDR testing reporting.";
            if(lowQuery.includes('osha')) response = "USS maintains 100% OSHA compliance. Fall protection is mandatory for all aerial work over 6ft.";
            if(lowQuery.includes('hikvision') || lowQuery.includes('lts')) response = "USS is a certified partner for LTS and Hikvision hardware. Our Platinum series features deep learning analytics and 24/7 color technology.";
            
            // 3. Lead Gen
            if(lowQuery.includes('quote') || lowQuery.includes('price') || lowQuery.includes('cost')) {
                response += "<br><br>Would you like me to initiate a quote request? You can also use our <a href='contact.html' style='color:#ffd700;'>Contact Form</a>.";
            }

            // 4. Greeting
            if(lowQuery === 'hi' || lowQuery === 'hello') response = "Greetings. Systems are nominal. How can I assist with your infrastructure design?";

            addMessage(response);
        }, 800);
    };

    // Allow Enter Key
    document.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && document.activeElement.id === 'concierge-input') {
            handleConciergeMessage();
        }
    });
})();