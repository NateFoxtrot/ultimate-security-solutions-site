/**
 * USS Feedback System
 * Injects a feedback tool when ?dev=true is present in URL
 */
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('dev')) return;

    console.log('USS Dev Tools Active');

    // Create Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .uss-feedback-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #B8953A;
            color: black;
            border: none;
            padding: 12px 20px;
            border-radius: 50px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: sans-serif;
        }

        .uss-comment-mode {
            cursor: crosshair !important;
        }

        .uss-comment-mode *:hover {
            outline: 2px dashed #B8953A !important;
            background: rgba(251, 191, 36, 0.1) !important;
        }

        .uss-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1e293b;
            color: white;
            padding: 30px;
            border-radius: 12px;
            z-index: 10000;
            width: 400px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            font-family: sans-serif;
        }

        .uss-modal textarea {
            width: 100%;
            height: 100px;
            background: #0f172a;
            color: white;
            border: 1px solid #334155;
            padding: 10px;
            border-radius: 4px;
            margin: 15px 0;
            resize: none;
        }

        .uss-modal-btns {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .uss-modal-btns button {
            padding: 8px 15px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
        }

        .uss-btn-save { background: #B8953A; color: black; font-weight: bold; }
        .uss-btn-cancel { background: #475569; color: white; }
    `;
    document.head.appendChild(style);

    // Create Button
    const btn = document.createElement('button');
    btn.className = 'uss-feedback-btn';
    btn.innerHTML = '<span>💬</span> LEAVE FEEDBACK';
    document.body.appendChild(btn);

    let isCommentMode = false;

    btn.onclick = () => {
        isCommentMode = !isCommentMode;
        document.body.classList.toggle('uss-comment-mode', isCommentMode);
        btn.style.background = isCommentMode ? '#ef4444' : '#B8953A';
        btn.style.color = isCommentMode ? 'white' : 'black';
        btn.innerHTML = isCommentMode ? '<span>✖</span> CANCEL MODE' : '<span>💬</span> LEAVE FEEDBACK';
    };

    document.addEventListener('click', (e) => {
        if (!isCommentMode) return;
        if (e.target.closest('.uss-feedback-btn') || e.target.closest('.uss-modal')) return;

        e.preventDefault();
        e.stopPropagation();

        const selector = getSelector(e.target);
        showModal(selector);
    }, true);

    function getSelector(el) {
        if (el.id) return '#' + el.id;
        if (el.className) return '.' + el.className.split(' ').join('.');
        return el.tagName.toLowerCase();
    }

    function showModal(selector) {
        const modal = document.createElement('div');
        modal.className = 'uss-modal';
        modal.innerHTML = `
            <h3 style="margin:0">Add Comment</h3>
            <p style="font-size:0.8rem; color:#94a3b8">On element: <code>${selector}</code></p>
            <textarea id="uss-comment-text" placeholder="What needs to change?"></textarea>
            <div class="uss-modal-btns">
                <button class="uss-btn-cancel" onclick="this.closest('.uss-modal').remove()">Cancel</button>
                <button class="uss-btn-save" id="uss-save-comment">Save Comment</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#uss-save-comment').onclick = async () => {
            const text = modal.querySelector('#uss-comment-text').value;
            if (!text) return;

            const res = await fetch('http://localhost:3001/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: window.location.pathname,
                    selector: selector,
                    text: text
                })
            });

            if (res.ok) {
                alert('Comment saved!');
                modal.remove();
                isCommentMode = false;
                document.body.classList.remove('uss-comment-mode');
                btn.style.background = '#B8953A';
                btn.style.color = 'black';
                btn.innerHTML = '<span>💬</span> LEAVE FEEDBACK';
            }
        };
    }
})();
