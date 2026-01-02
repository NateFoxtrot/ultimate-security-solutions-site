(function() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const token = localStorage.getItem('uss_admin_token');

    if (mode === 'edit' && token) {
        initVisualEditor();
    }

    function initVisualEditor() {
        // 1. Inject Admin Toolbar
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; 
            background: #00ff00; color: black; padding: 10px; 
            z-index: 99999; font-family: monospace; font-weight: bold;
            display: flex; justify-content: space-between; align-items: center;
        `;
        toolbar.innerHTML = `
            <span>🔧 USS VISUAL EDITOR ACTIVE</span>
            <div>
                <button onclick="saveChanges()" style="background:black; color:#00ff00; border:none; padding:5px 10px; cursor:pointer;">SAVE CHANGES</button>
                <button onclick="exitEdit()" style="background:black; color:red; border:none; padding:5px 10px; cursor:pointer;">EXIT</button>
            </div>
        `;
        document.body.prepend(toolbar);
        document.body.style.marginTop = '40px';

        // 2. Make Elements Editable
        const editableTags = ['h1', 'h2', 'h3', 'p', 'span', 'li', 'a'];
        editableTags.forEach(tag => {
            document.querySelectorAll(tag).forEach(el => {
                // Ignore admin UI
                if(el.closest('.admin-toolbar')) return;
                
                el.contentEditable = "true";
                el.style.border = "1px dashed rgba(0, 255, 0, 0.3)";
                el.style.cursor = "text";
                
                el.addEventListener('focus', () => {
                    el.style.border = "1px solid #00ff00";
                    el.style.background = "rgba(0,255,0,0.1)";
                });
                
                el.addEventListener('blur', () => {
                    el.style.border = "1px dashed rgba(0, 255, 0, 0.3)";
                    el.style.background = "transparent";
                });
            });
        });

        // 3. Prevent Link Clicks in Edit Mode
        document.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }

    window.saveChanges = function() {
        // Collect all edits (Simulated)
        // In a real app, we'd map DOM paths to a JSON or POST the full HTML
        alert("Changes saved to local cache! (Backend Save Not Connected in Prototype)");
    };

    window.exitEdit = function() {
        window.location.href = window.location.pathname;
    };

})();
