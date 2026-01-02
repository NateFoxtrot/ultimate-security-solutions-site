(function() {
    // USS AI Concierge - Knowledge-driven Security Assistant
    const conciergeHTML = `
        <div id="uss-concierge" style="position:fixed; bottom:2rem; left:2rem; z-index:5000; font-family:'Segoe UI', Tahoma, sans-serif;">
            <div id="concierge-chat" style="display:none; width:350px; height:500px; background:#0f1c2e; border:1px solid #ffd700; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="background:#ffd700; color:#050b14; padding:1rem; font-weight:800; display:flex; justify-content:space-between;">
                    <span>USS INTELLIGENCE CORE</span>
                    <i class="fas fa-times" onclick="toggleConcierge(false)" style="cursor:pointer;"></i>
                </div>
                <div id="concierge-messages" style="flex-grow:1; overflow-y:auto; padding:1rem; color:#e6f1ff; font-size:0.9rem;">
                    <div style="margin-bottom:1rem; border-left:2px solid #ffd700; padding-left:10px;">
                        Hello Engineer. I am the USS Design Assistant. How can I help you optimize your security infrastructure today?
                    </div>
                </div>
                <div style="padding:1rem; border-top:1px solid rgba(255,215,0,0.2); display:flex; gap:10px;">
                    <input type="text" id="concierge-input" placeholder="Ask about products or design..." style="flex:1; background:rgba(0,0,0,0.3); border:1px solid #ffd700; color:white; padding:0.5rem;">
                    <button onclick="handleConciergeMessage()" style="background:#ffd700; border:none; padding:0.5rem 1rem; cursor:pointer;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="concierge-trigger" onclick="toggleConcierge(true)" style="width:60px; height:60px; background:#ffd700; color:#050b14; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 5px 20px rgba(0,0,0,0.4);">
                <i class="fas fa-robot" style="font-size:1.5rem;"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', conciergeHTML);

    window.toggleConcierge = function(show) {
        document.getElementById('concierge-chat').style.display = show ? 'flex' : 'none';
        document.getElementById('concierge-trigger').style.display = show ? 'none' : 'flex';
    };

    window.handleConciergeMessage = function() {
        const input = document.getElementById('concierge-input');
        const msg = input.value.trim();
        if(!msg) return;

        const container = document.getElementById('concierge-messages');
        const userDiv = document.createElement('div');
        userDiv.style.textAlign = 'right';
        userDiv.style.marginBottom = '1rem';
        userDiv.innerHTML = `<span style="background:rgba(255,215,0,0.1); padding:5px 10px;">${msg}</span>`;
        container.appendChild(userDiv);

        input.value = '';

        // Simulated intelligence based on keywords
        setTimeout(() => {
            const reply = document.createElement('div');
            reply.style.marginBottom = '1rem';
            reply.style.borderLeft = '2px solid #ffd700';
            reply.style.paddingLeft = '10px';
            
            let response = "I'm analyzing that request. For complex system design, I recommend using our Virtual Blueprint tool or consulting with a Lead Engineer.";
            
            if(msg.toLowerCase().includes('cat6')) response = "Cat6 standards require a max length of 100m. We recommend Cat6a for all 10G uplink applications.";
            if(msg.toLowerCase().includes('4k')) response = "Our Platinum 8K NVRs support up to 32TB of raw storage. Would you like to view the compatibility list?";
            if(msg.toLowerCase().includes('osha')) response = "Safety is paramount. Ensure all technicians are using proper fall protection when operating above 6 feet.";

            reply.innerText = response;
            container.appendChild(reply);
            container.scrollTop = container.scrollHeight;
        }, 1000);
    };
})();
