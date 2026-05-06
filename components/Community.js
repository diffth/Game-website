export function initCommunity() {
    const messageBoard = document.getElementById('message-board');
    const messageForm = document.getElementById('message-form');
    const inputName = document.getElementById('input-name');
    const inputMessage = document.getElementById('input-message');

    // Load existing messages
    const messages = JSON.parse(localStorage.getItem('community_messages') || '[]');

    function renderMessages() {
        messageBoard.innerHTML = messages.map(msg => `
            <div class="message-card">
                <div class="message-header">
                    <span class="user-name">${msg.name}</span>
                    <span class="message-date">${new Date(msg.date).toLocaleDateString()}</span>
                </div>
                <p class="message-text">${msg.text}</p>
            </div>
        `).join('');
        messageBoard.scrollTop = messageBoard.scrollHeight;
    }

    messageForm.onsubmit = (e) => {
        e.preventDefault();
        const newMessage = {
            name: inputName.value,
            text: inputMessage.value,
            date: new Date().toISOString()
        };
        messages.push(newMessage);
        localStorage.setItem('community_messages', JSON.stringify(messages));
        
        inputName.value = '';
        inputMessage.value = '';
        renderMessages();
        
        // Add animation class to new message
        const cards = messageBoard.querySelectorAll('.message-card');
        const lastCard = cards[cards.length - 1];
        if (lastCard) {
            lastCard.classList.add('new-message');
        }
    };

    renderMessages();
}
