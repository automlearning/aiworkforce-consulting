(function() {
    'use strict';

    // Create chatbot HTML
    const chatbotHTML = `
        <button class="chatbot-toggle" aria-label="Open chat">
            <svg class="chatbot-open-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>
            <svg class="chatbot-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <div class="chatbot-panel">
            <div class="chatbot-header">
                <div class="chatbot-header-dot"></div>
                <div class="chatbot-header-text">
                    <h3>Samuel's AI Assistant</h3>
                    <p>Ask me about services & availability</p>
                </div>
                <button class="chatbot-header-close" aria-label="Close chat">
                    <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
            <div class="chatbot-messages">
                <div class="chatbot-message bot">Hi! I'm Samuel's AI assistant. I can help you learn about AI orchestration and automation services. What would you like to know?</div>
                <div class="chatbot-quick-actions">
                    <button class="chatbot-quick-btn" data-message="What services do you offer?">Our Services</button>
                    <button class="chatbot-quick-btn" data-message="I want to start a project">Start a Project</button>
                    <button class="chatbot-quick-btn" data-message="How can I book a call?">Book a Call</button>
                </div>
            </div>
            <div class="chatbot-typing">
                <span></span><span></span><span></span>
            </div>
            <div class="chatbot-input-area">
                <textarea class="chatbot-input" placeholder="Type a message..." rows="1"></textarea>
                <button class="chatbot-send" aria-label="Send message" disabled>
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    `;

    // Inject chatbot into page
    const container = document.createElement('div');
    container.id = 'chatbot-widget';
    container.innerHTML = chatbotHTML;
    document.body.appendChild(container);

    // Elements
    const toggle = container.querySelector('.chatbot-toggle');
    const panel = container.querySelector('.chatbot-panel');
    const headerClose = container.querySelector('.chatbot-header-close');
    const messagesEl = container.querySelector('.chatbot-messages');
    const typingEl = container.querySelector('.chatbot-typing');
    const input = container.querySelector('.chatbot-input');
    const sendBtn = container.querySelector('.chatbot-send');

    // State
    let history = [];
    let isOpen = false;
    let isSending = false;

    // Toggle chat panel
    toggle.addEventListener('click', function() {
        isOpen = !isOpen;
        toggle.classList.toggle('active', isOpen);
        panel.classList.toggle('open', isOpen);
        if (isOpen) {
            input.focus();
        }
    });

    // Header close button (for mobile)
    headerClose.addEventListener('click', function() {
        isOpen = false;
        toggle.classList.remove('active');
        panel.classList.remove('open');
    });

    // Input handling
    input.addEventListener('input', function() {
        sendBtn.disabled = !input.value.trim() || isSending;
        // Auto-resize
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.value.trim() && !isSending) {
                sendMessage();
            }
        }
    });

    sendBtn.addEventListener('click', function() {
        if (input.value.trim() && !isSending) {
            sendMessage();
        }
    });

    // Quick action buttons
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('chatbot-quick-btn')) {
            const message = e.target.getAttribute('data-message');
            if (message && !isSending) {
                input.value = message;
                sendMessage();
                // Hide quick actions after use
                const quickActions = container.querySelector('.chatbot-quick-actions');
                if (quickActions) {
                    quickActions.style.display = 'none';
                }
            }
        }
    });

    function formatMessage(text) {
        // Escape HTML first
        let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Bold: **text**
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Convert URLs to clickable links
        html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

        // Convert inline numbered lists to proper newlines (e.g., "text 1. item 2. item" -> "text\n1. item\n2. item")
        html = html.replace(/\s+(\d+)\.\s+/g, '\n$1. ');

        // Convert inline bullet lists to proper newlines
        html = html.replace(/\s+([-•])\s+/g, '\n$1 ');

        // Split into lines for list processing
        const lines = html.split('\n');
        let result = '';
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const olMatch = line.match(/^(\d+)\.\s+(.+)/);
            const ulMatch = line.match(/^[-•]\s+(.+)/);

            if (olMatch || ulMatch) {
                if (!inList) { result += '<div class="chat-list">'; inList = true; }
                const content = olMatch ? '<span class="list-num">' + olMatch[1] + '.</span> ' + olMatch[2] : ulMatch[1];
                result += '<div class="chat-list-item">' + content + '</div>';
            } else {
                if (inList) { result += '</div>'; inList = false; }
                result += '<p>' + line + '</p>';
            }
        }
        if (inList) result += '</div>';

        return result;
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = 'chatbot-message ' + type;
        if (type === 'user') {
            msg.textContent = text;
        } else {
            msg.innerHTML = formatMessage(text);
        }
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;
        isSending = true;

        // Show typing indicator
        typingEl.classList.add('visible');
        messagesEl.scrollTop = messagesEl.scrollHeight;

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: history
                })
            });

            if (!response.ok) {
                let errorMsg = 'Something went wrong';
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || errorMsg;
                } catch (e) {}
                throw new Error(errorMsg);
            }

            const data = await response.json();

            // Add to history
            history.push({ role: 'user', content: text });
            history.push({ role: 'assistant', content: data.reply });

            // Keep history manageable
            if (history.length > 20) {
                history = history.slice(-20);
            }

            addMessage(data.reply, 'bot');
        } catch (error) {
            addMessage('Error: ' + error.message, 'error');
        } finally {
            typingEl.classList.remove('visible');
            isSending = false;
            sendBtn.disabled = !input.value.trim();
        }
    }
})();
