(function() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const token = localStorage.getItem('uss_gh_token');
    const owner = localStorage.getItem('uss_gh_owner');
    const repo = localStorage.getItem('uss_gh_repo');

    if (mode === 'edit' && token && owner && repo) {
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
            <span>🔧 USS LIVE EDITOR [ONLINE]</span>
            <div id="editor-status" style="font-size:0.7rem; color:#333;">Click any text to edit.</div>
            <div>
                <button onclick="savePageChanges()" id="save-btn" style="background:black; color:#00ff00; border:1px solid black; padding:5px 15px; cursor:pointer; font-weight:bold;">SAVE TO CLOUD</button>
                <button onclick="exitEdit()" style="background:transparent; color:black; border:1px solid black; padding:5px 10px; cursor:pointer; margin-left:10px;">EXIT</button>
            </div>
        `;
        document.body.prepend(toolbar);
        document.body.style.marginTop = '50px';

        // 2. Make Elements Editable (Improved Selection)
        const editableSelectors = 'h1, h2, h3, p, span, .service-card p, .hero-subtitle';
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

        // 3. Image Captioning Logic
        document.querySelectorAll('img').forEach(img => {
            if(img.closest('.admin-toolbar')) return;
            img.style.cursor = 'pointer';
            img.title = "Click to change caption/alt text";
            img.addEventListener('click', (e) => {
                e.preventDefault();
                const newAlt = prompt("Enter new caption/alt text for this image:", img.alt);
                if(newAlt !== null) {
                    img.alt = newAlt;
                    alert("Caption updated! Click 'Save to Cloud' to commit.");
                }
            });
        });
    }

    // --- REAL GITHUB SAVE LOGIC ---
    window.savePageChanges = async function() {
        const btn = document.getElementById('save-btn');
        const status = document.getElementById('editor-status');
        
        btn.disabled = true;
        btn.innerText = "UPLOADING...";
        status.innerText = "Connecting to GitHub Uplink...";

        // Cleanup DOM before saving
        const toolbar = document.querySelector('.admin-toolbar');
        toolbar.remove();
        document.body.style.marginTop = '0';
        
        // Remove all contentEditable attributes and editor styles
        document.querySelectorAll('[contentEditable="true"]').forEach(el => {
            el.removeAttribute('contentEditable');
            el.style.outline = "";
            el.style.background = "";
        });

        const fullHTML = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
        const filePath = window.location.pathname.split('/').pop() || 'index.html';
        
        try {
            // 1. Get current file SHA
            const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
            const getRes = await fetch(getUrl, {
                headers: { 'Authorization': `token ${token}` }
            });
            const getData = await getRes.json();
            const sha = getData.sha;

            // 2. Push Update
            const putRes = await fetch(getUrl, {
                method: 'PUT',
                headers: { 
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `admin: visual edit of ${filePath}`,
                    content: btoa(unescape(encodeURIComponent(fullHTML))), // Robust Base64
                    sha: sha
                })
            });

            if(putRes.ok) {
                alert("DEPLOYMENT INITIALIZED. Changes are being pushed to Netlify. The page will reload in 3 seconds.");
                setTimeout(() => location.reload(), 3000);
            } else {
                const err = await putRes.json();
                throw new Error(err.message);
            }

        } catch(e) {
            console.error(e);
            alert("Uplink Failed: " + e.message);
            // Put toolbar back
            location.reload(); 
        }
    };

    window.exitEdit = function() {
        window.location.href = window.location.pathname;
    };

})();