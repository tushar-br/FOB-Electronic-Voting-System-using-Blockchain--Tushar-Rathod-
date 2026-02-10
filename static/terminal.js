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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
    `;
    document.body.appendChild(triggerBtn);

    // --- 2. CREATE CLOSE BUTTON IN HEADER ---
    if (terminalHeader) {
        terminalHeader.innerHTML = `
            <span>Blockchain Ledger (Live) ~user/tusharbr</span>
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
    function appendLog(message, className = '') {
        if (!terminalContent) return;

        const div = document.createElement('div');
        div.className = 'log-entry ' + className;
        div.textContent = message;

        terminalContent.appendChild(div);

        if (terminalContainer.classList.contains('active')) {
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    }

    function appendJSON(data) {
        if (!terminalContent) return;

        const pre = document.createElement('pre');
        pre.className = 'log-json';
        pre.textContent = JSON.stringify(data, null, 4);
        terminalContent.appendChild(pre);

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

                // Print Header for the batch
                if (newBlocks.length > 0) {
                    appendLog(`--- Current Blockchain State ---`, 'header-log');
                }

                newBlocks.forEach(block => {
                    // Format the block data exactly as requested
                    appendJSON({
                        "index": block.index,
                        "timestamp": block.timestamp,
                        "voter_id": block.voter_id,
                        "candidate": block.candidate,
                        "previous_hash": block.previous_hash,
                        "hash": block.hash
                    });

                    if (currentChainLength > 0) {
                        // Flash button effect for new blocks
                        if (!terminalContainer.classList.contains('active')) {
                            triggerBtn.style.background = '#00f2ea';
                            triggerBtn.style.color = '#000';
                            setTimeout(() => {
                                triggerBtn.style.background = '';
                                triggerBtn.style.color = '';
                            }, 500);
                        }
                    }
                });

                // Print Footer after the batch
                if (newBlocks.length > 0) {
                    appendLog(`--------------------------------`, 'header-log');
                    // Add an extra newline effect (empty div)
                    const div = document.createElement('div');
                    div.innerHTML = '<br>';
                    terminalContent.appendChild(div);
                }

                currentChainLength = data.length;
            }
        } catch (error) {
            console.error('Error fetching blockchain data:', error);
        }
    }

    fetchChainData();
    setInterval(fetchChainData, 2000);
});
