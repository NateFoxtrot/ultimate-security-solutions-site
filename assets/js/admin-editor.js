(function() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const token = localStorage.getItem('uss_token');

    if (mode === 'edit' && token) {
        initVisualEditor();
    }

    function initVisualEditor() {
        // 1. Inject Admin Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'admin-toolbar';
        toolbar.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; 
            background: #00ff00; color: black; padding: 10px; 
            z-index: 99999; font-family: monospace; font-weight: bold;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;
        toolbar.innerHTML = `
            <span>🔧 USS LIVE EDITOR [LOCAL SERVER]</span>
            <div id="editor-status" style="font-size:0.7rem; color:#333;">Click any text to edit.</div>
            <div>
                <button onclick="savePageChanges()" id="save-btn" style="background:black; color:#00ff00; border:1px solid black; padding:5px 15px; cursor:pointer; font-weight:bold;">SAVE TO DISK</button>
                <button onclick="exitEdit()" style="background:transparent; color:black; border:1px solid black; padding:5px 10px; cursor:pointer; margin-left:10px;">EXIT</button>
            </div>
        `;
        document.body.prepend(toolbar);
        document.body.style.marginTop = '50px';

        // 2. Make Elements Editable
        const editableSelectors = 'h1, h2, h3, p, span, .service-card p, .hero-subtitle, .value-card p, .review-card p';
        document.querySelectorAll(editableSelectors).forEach(el => {
            if(el.closest('.admin-toolbar')) return;
            
            el.contentEditable = "true";
            el.style.outline = "1px dashed rgba(0, 255, 0, 0.3)";
            
            el.addEventListener('focus', () => {
                el.style.outline = "2px solid #00ff00";
                el.style.background = "rgba(0,255,0,0.05)";
                document.getElementById('editor-status').innerText = "Editing: " + el.tagName;
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = "1px dashed rgba(0, 255, 0, 0.3)";
                el.style.background = "transparent";
                document.getElementById('editor-status').innerText = "Changes pending save...";
            });
        });
    }

    // --- LOCAL SERVER SAVE LOGIC ---
    window.savePageChanges = async function() {
        const btn = document.getElementById('save-btn');
        const status = document.getElementById('editor-status');
        
        btn.disabled = true;
        btn.innerText = "SAVING...";
        status.innerText = "Syncing with Local Server...";

        // Clone current state to clean it
        const cleanDoc = document.documentElement.cloneNode(true);
        
        // Remove Editor UI from clone
        const toolbar = cleanDoc.querySelector('.admin-toolbar');
        if(toolbar) toolbar.remove();
        cleanDoc.body.style.marginTop = '0';
        
        // Cleanup editable elements in clone
        cleanDoc.querySelectorAll('[contentEditable="true"]').forEach(el => {
            el.removeAttribute('contentEditable');
            el.style.outline = "";
            el.style.background = "";
        });

        const fullHTML = "<!DOCTYPE html>\n" + cleanDoc.outerHTML;
        const filePath = window.location.pathname.split('/').pop() || 'index.html';
        
        try {
            const res = await fetch(`http://localhost:8000/api/admin/save_page`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: filePath,
                    content: fullHTML
                })
            });

            if(res.ok) {
                alert("Page Saved Successfully to Disk!");
                location.reload();
            } else {
                const err = await res.json();
                throw new Error(err.detail || "Server Error");
            }

        } catch(e) {
            console.error(e);
            alert("Save Failed: " + e.message);
            btn.disabled = false;
            btn.innerText = "SAVE TO DISK";
        }
    };

    window.exitEdit = function() {
        window.location.href = window.location.pathname;
    };

})();
