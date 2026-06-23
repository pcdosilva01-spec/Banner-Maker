// Chat System
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

let chatHistory = [];

chatToggle?.addEventListener('click', () => {
  chatContainer.classList.remove('hidden');
  chatInput.focus();
});

chatClose?.addEventListener('click', () => {
  chatContainer.classList.add('hidden');
});

chatForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  
  // Add typing indicator
  const typingId = addTypingIndicator();
  
  try {
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        history: chatHistory.slice(-6)
      })
    });
    
    const data = await response.json();
    
    // Remove typing indicator
    removeTypingIndicator(typingId);
    
    if (data.success) {
      addMessage(data.response, 'bot');
      
      // Update history
      chatHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      );
    } else {
      addMessage('Desculpe, ocorreu um erro. Tente novamente.', 'bot');
    }
  } catch (error) {
    removeTypingIndicator(typingId);
    addMessage('Erro de conexão. Verifique se o servidor está rodando.', 'bot');
    console.error(error);
  }
});

function addMessage(content, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = type === 'bot' ? '🤖' : '👤';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  // Limpar formatação markdown
  const cleanContent = content
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/###/g, '')
    .replace(/---/g, '')
    .replace(/\|/g, '');
  
  messageContent.textContent = cleanContent;
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(messageContent);
  
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot typing';
  typingDiv.id = `typing-${Date.now()}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '🤖';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  
  typingDiv.appendChild(avatar);
  typingDiv.appendChild(messageContent);
  
  chatMessages.appendChild(typingDiv);
  scrollToBottom();
  
  return typingDiv.id;
}

function removeTypingIndicator(id) {
  const typingDiv = document.getElementById(id);
  if (typingDiv) {
    typingDiv.remove();
  }
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
