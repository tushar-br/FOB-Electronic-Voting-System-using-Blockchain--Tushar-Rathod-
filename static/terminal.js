document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.getElementById('terminal-logs');
    const terminalContainer = document.getElementById('live-terminal');
    const terminalHeader = document.querySelector('.terminal-header');

    // --- 1. CREATE FLOATING TRIGGER BUTTON DYNAMICALLY (Fix for new Homepage) ---
    // Remove if already exists (to avoid duplicates on reload logic if stored)
    const existingBtn = document.querySelector('.terminal-trigger-btn');
    if (existingBtn) existingBtn.remove();

    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'terminal-trigger-btn';
    triggerBtn.innerHTML = `
        <div class="status-dot"></div>
        View Blockchain Ledger
    `;
    document.body.appendChild(triggerBtn);

    // --- 2. CREATE CLOSE BUTTON IN HEADER ---
    if (terminalHeader) {
        terminalHeader.innerHTML = `
            <span>Blockchain Ledger (Live)</span>
        `;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'terminal-close-btn';
        closeBtn.textContent = 'Close Overlay';
        terminalHeader.appendChild(closeBtn);

        closeBtn.addEventListener('click', closeTerminal);
    }

    // --- 3. STATE MANAGEMENT ---
    let currentChainLength = 0;

    function openTerminal() {
        terminalContainer.classList.add('active');
        if (terminalContent) terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    function closeTerminal() {
        terminalContainer.classList.remove('active');
    }

    // Event Listeners
    triggerBtn.addEventListener('click', openTerminal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && terminalContainer && terminalContainer.classList.contains('active')) {
            closeTerminal();
        }
    });

    // --- 4. FORMATTING & LOGGING ---
    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }

    function appendLog(message, isHash = false) {
        if (!terminalContent) return; // Guard clause if terminal isn't in DOM yet

        const div = document.createElement('div');
        div.className = 'log-entry';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-time';
        timeSpan.textContent = `[${formatTime()}]`;

        div.appendChild(timeSpan);

        if (isHash) {
            const msgSpan = document.createElement('span');
            msgSpan.className = 'log-hash';
            msgSpan.textContent = message;
            div.appendChild(msgSpan);
        } else {
            div.appendChild(document.createTextNode(" " + message));
        }

        terminalContent.appendChild(div);

        if (terminalContainer.classList.contains('active')) {
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    }

    // --- 5. DATA FETCHING ---
    async function fetchChainData() {
        try {
            const response = await fetch('/chain');
            const data = await response.json();

            if (data.length > currentChainLength) {
                const newBlocks = data.chain.slice(currentChainLength);

                newBlocks.forEach(block => {
                    if (currentChainLength === 0 && block.index === 0) {
                        appendLog(`GENESIS BLOCK INITIALIZED`);
                    } else {
                        appendLog(`NEW VOTE BLOCK #${block.index}`);

                        if (!terminalContainer.classList.contains('active')) {
                            triggerBtn.style.background = '#00f2ea';
                            triggerBtn.style.color = '#000';
                            setTimeout(() => {
                                triggerBtn.style.background = '';
                                triggerBtn.style.color = '';
                            }, 500);
                        }
                    }

                    appendLog(`Hash: ${block.hash}`, true);
                    appendLog(`Prev: ${block.previous_hash}`, true);
                    appendLog(`--------------------------------------------------------------------------------`);
                });

                currentChainLength = data.length;
            }
        } catch (error) {
            console.error('Error fetching blockchain data:', error);
        }
    }

    fetchChainData();
    setInterval(fetchChainData, 2000);
});
