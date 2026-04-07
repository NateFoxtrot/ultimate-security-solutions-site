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

    // Expanded Knowledge Base for "Intelligence" Simulation
    const knowledgeBase = [
        {
            keywords: ['install', 'setup', 'deploy', 'wiring', 'cabling'],
            response: "USS executes full-lifecycle deployment. From structured cabling (Cat6/Fiber) to hardware mounting and final configuration. We adhere to TIA-606-C labeling standards.<br><a href='accomplishments.html' style='color:#ffd700;'>Mission Archive (Our Work)</a>"
        },
        {
            keywords: ['service area', 'location', 'where', 'coverage', 'kansas city', 'kc'],
            response: "Primary Operations Area: Kansas City Metro + 100mi radius. We also support National MSPs with white-label smart hands across the Midwest.<br><a href='service_area.html' style='color:#ffd700;'>View Coverage Map</a>"
        },
        {
            keywords: ['warranty', 'guarantee', 'return', 'rma'],
            response: "<strong>Warranty Protocol:</strong><br>• Platinum Series Hardware: 3-Year Manufacturer Warranty.<br>• Installation Workmanship: 1-Year Guarantee.<br>• RMAs are processed directly through our office."
        },
        {
            keywords: ['support', 'help', 'broken', 'offline', 'error', 'fix', 'repair'],
            response: "<strong>Priority Support:</strong><br>For critical infrastructure failures, call Operations Command at <strong>816-814-2007</strong>.<br>For non-urgent tickets, use the <a href='contact.html' style='color:#ffd700;'>Contact Form</a>."
        },
        {
            keywords: ['msp', 'partner', 'subcontract', 'white label', 'vendor'],
            response: "We are the preferred 'Boots on the Ground' for National MSPs. We carry our own COI, use your ticketing system, and respect client ownership.<br><a href='partners.html' style='color:#ffd700;'>Vendor Onboarding</a>"
        },
        {
            keywords: ['system design', 'blueprint', 'layout', 'plan'],
            response: "Initiate the <strong>USS Blueprint</strong> tool to generate a visual security layout for your facility. It includes budget estimation and FOV calculation.<br><a href='system-design.html' style='color:#ffd700;'>Launch System Designer</a>"
        },
        {
            keywords: ['contact', 'email', 'phone', 'call', 'reach'],
            response: "<strong>Communicate:</strong><br>• Phone: 816-814-2007<br>• Email: admin@usstech.net<br>• HQ: Kansas City, MO"
        }
    ];

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
            let response = "";
            const lowQuery = query.toLowerCase();
            const tokens = lowQuery.split(/\s+/);

            // 1. Search Product Catalog with Scoring
            if (typeof products !== 'undefined') {
                const results = products.map(p => {
                    let score = 0;
                    if ((p.series_id || '').toLowerCase().includes(lowQuery)) score += 30;
                    tokens.forEach(t => {
                        if ((p.name || '').toLowerCase().includes(t)) score += 10;
                        if ((p.description || '').toLowerCase().includes(t)) score += 1;
                    });
                    return { product: p, score: score };
                })
                .filter(item => item.score > 5) // Minimum threshold
                .sort((a, b) => b.score - a.score)
                .slice(0, 3); // Top 3

                if (results.length > 0) {
                    response += "<strong>I found these relevant items in our inventory:</strong><br><br>";
                    results.forEach(item => {
                        const p = item.product;
                        const price = p.variants[0] && p.variants[0].price ? '$' + p.variants[0].price.toFixed(2) : 'Contact for Quote';
                        response += `<div style="margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">
                                        <span style="color:#ffd700; font-weight:bold;">${p.name}</span><br>
                                        <span style="font-size:0.8rem; opacity:0.8;">SKU: ${p.series_id} | ${price}</span><br>
                                        <a href="ordering_system.html?product=${p.series_id}" style="color:#fff; text-decoration:underline; font-size:0.8rem;">View in Catalog</a>
                                     </div>`;
                    });
                }
            }

            // 2. Knowledge Base Search (New Layer)
            if (!response) {
                for (const entry of knowledgeBase) {
                    if (entry.keywords.some(k => lowQuery.includes(k))) {
                        response = entry.response;
                        break;
                    }
                }
            }

            // 3. Category & Vague Term Handling
            if(!response) {
                if(lowQuery.includes('camera') || lowQuery.includes('cctv')) {
                    response = "Accessing Surveillance Database...<br><strong>Quick Link:</strong> Browse our full <a href='ordering_system.html?cat=camera' style='color:#ffd700;'>IP Camera Catalog</a>.";
                } else if(lowQuery.includes('nvr') || lowQuery.includes('recorder') || lowQuery.includes('dvr')) {
                    response = "Accessing Storage Solutions...<br><strong>Quick Link:</strong> Browse our <a href='ordering_system.html?cat=nvr' style='color:#ffd700;'>Recording Solutions</a>.";
                } else if(lowQuery.includes('access') || lowQuery.includes('door') || lowQuery.includes('card')) {
                    response = "Accessing Entry Control Systems...<br><strong>Quick Link:</strong> View <a href='ordering_system.html?cat=access' style='color:#ffd700;'>Access Control Systems</a>.";
                }
            }

            // 4. Technical Standards (Static Overrides)
            if(lowQuery.includes('cat6')) response = "Per TIA-606-C, Cat6 runs should not exceed 90m for permanent links. We utilize shielded Cat6a for high-interference industrial environments.";
            if(lowQuery.includes('fiber')) response = "We specialize in Single Mode and Multi-mode fiber terminations. All fiber spans are certified with OTDR testing reporting.";
            if(lowQuery.includes('osha')) response = "USS maintains 100% OSHA compliance. Fall protection is mandatory for all aerial work over 6ft.";
            if(lowQuery.includes('hikvision') || lowQuery.includes('lts')) response = "USS is a certified partner for LTS and Hikvision hardware. Our Platinum series features deep learning analytics and 24/7 color technology.";
            
            // 5. Lead Gen
            if(lowQuery.includes('quote') || lowQuery.includes('price') || lowQuery.includes('cost')) {
                response += "<br><br>Would you like me to initiate a quote request? You can also use our <a href='contact.html' style='color:#ffd700;'>Contact Form</a>.";
            }

            // 6. Default Fallback
            if (!response) {
                response = `<strong>Query Unrecognized.</strong><br>
                            My database does not have a direct match. How should we proceed?<br><br>
                            1. <a href="ordering_system.html" style="color:#ffd700;">Search Hardware Catalog</a><br>
                            2. <a href="system-design.html" style="color:#ffd700;">Start a System Design</a><br>
                            3. <a href="contact.html" style="color:#ffd700;">Contact an Engineer</a>`;
            }

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