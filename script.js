// Discord Prototype - Favorite Messages Feature
class DiscordPrototype {
    constructor() {
        this.favoriteMessages = JSON.parse(localStorage.getItem('favoriteMessages')) || [];
        this.currentView = 'server'; // 'server' or 'dm'
        this.currentDM = null; // null for server, or dm id for DMs
        this.dmMessages = JSON.parse(localStorage.getItem('dmMessages')) || {};
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        if (this.currentUser) {
            this.showDiscordInterface();
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('discord-container').classList.add('hidden');
        this.bindLoginEvents();
    }

    showDiscordInterface() {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('discord-container').classList.remove('hidden');
        this.initializeDMMessages();
        this.init();
    }

    bindLoginEvents() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username-input').value.trim();
            if (username) {
                this.currentUser = {
                    name: username,
                    avatar: username.charAt(0).toUpperCase()
                };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.updateUserInterface();
                this.showDiscordInterface();
            }
        });
    }

    updateUserInterface() {
        // Update user bar
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-avatar').textContent = this.currentUser.avatar;
        
        // Update message placeholder
        const messageInput = document.getElementById('message-input');
        const currentChannel = this.currentView === 'server' ? 'geral' : 
                              this.currentDM ? this.currentDM.replace('dm-', '') : 'geral';
        messageInput.placeholder = `Mensagem ${this.currentView === 'server' ? '#' : '@'}${currentChannel}`;
    }

    init() {
        this.generateSampleMessages();
        this.generateDMList();
        this.bindEvents();
        this.updateFavoritesButton();
        this.updateUserInterface();
    }

    generateSampleMessages() {
        const messagesContainer = document.getElementById('messages-container');
        const sampleMessages = [
            {
                id: 1,
                author: 'Matheus',
                avatar: 'M',
                avatarColor: '#7289da',
                timestamp: '6/8, 2:30 PM',
                content: 'Pessoal, consegui terminar a implementação do sistema de autenticação. Agora só falta integrar com o backend do Fernando'
            },
            {
                id: 2,
                author: 'Fernando',
                avatar: 'F',
                avatarColor: '#43b581',
                timestamp: '6/8, 2:32 PM',
                content: 'Show! Acabei de fazer o deploy da API. Já está rodando no ambiente de dev\nPode testar aí'
            },
            {
                id: 3,
                author: 'Fabio',
                avatar: 'Fb',
                avatarColor: '#f04747',
                timestamp: '6/8, 2:35 PM',
                content: 'Galera, tô com uma dúvida sobre o fluxo de validação de email\nO token deve expirar em quanto tempo mesmo? 24h ou 1h?'
            },
            {
                id: 4,
                author: 'Kauã',
                avatar: 'K',
                avatarColor: '#9b59b6',
                timestamp: '6/8, 2:36 PM',
                content: 'Acho que seria melhor 1h por segurança\nMas deixa eu ver o que tá na documentação...'
            },
            {
                id: 5,
                author: 'Juan',
                avatar: 'J',
                avatarColor: '#e67e22',
                timestamp: '6/8, 2:38 PM',
                content: 'Na verdade, olhando aqui no Jira, o PO definiu 2 horas\nVou mandar o print da task'
            },
            {
                id: 6,
                author: 'Matheus',
                avatar: 'M',
                avatarColor: '#7289da',
                timestamp: '6/8, 2:40 PM',
                content: 'Perfeito! Já ajusto aqui no frontend então\n@Fernando precisa alterar alguma coisa na API?'
            },
            {
                id: 7,
                author: 'Fernando',
                avatar: 'F',
                avatarColor: '#43b581',
                timestamp: '6/8, 2:41 PM',
                content: 'Não, já está configurável. Só preciso ajustar a variável de ambiente\nFaço isso agora'
            },
            {
                id: 8,
                author: 'Fabio',
                avatar: 'Fb',
                avatarColor: '#f04747',
                timestamp: '6/8, 2:43 PM',
                content: 'Ótimo! Enquanto isso vou continuar os testes automatizados\nJá consegui cobrir 80% dos cenários de login'
            },
            {
                id: 9,
                author: 'Kauã',
                avatar: 'K',
                avatarColor: '#9b59b6',
                timestamp: '6/8, 2:45 PM',
                content: 'Excelente trabalho pessoal! 🚀\nAcho que conseguimos entregar essa sprint tranquilamente'
            }
        ];

        messagesContainer.innerHTML = '';
        sampleMessages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
    }

    generateDMList() {
        const dmList = document.getElementById('dm-list');
        const dmConversations = [
            {
                id: 'saved',
                name: this.currentUser ? this.currentUser.name : 'Matheus',
                avatar: this.currentUser ? this.currentUser.avatar : 'M',
                avatarColor: '#7289da',
                status: 'Salvar mensagens para depois',
                isSaved: true
            },
            {
                id: 'fernando',
                name: 'Fernando',
                avatar: 'F',
                avatarColor: '#43b581',
                status: 'Online'
            },
            {
                id: 'fabio',
                name: 'Fabio',
                avatar: 'Fb',
                avatarColor: '#f04747',
                status: 'Ausente'
            },
            {
                id: 'kaua',
                name: 'Kauã',
                avatar: 'K',
                avatarColor: '#9b59b6',
                status: 'Não Perturbe'
            },
            {
                id: 'juan',
                name: 'Juan',
                avatar: 'J',
                avatarColor: '#e67e22',
                status: 'Offline'
            }
        ];

        let dmHTML = '<div class="dm-header"><span>Mensagens Diretas</span></div>';
        
        dmConversations.forEach(dm => {
            const isSavedClass = dm.isSaved ? 'saved-messages' : '';
            dmHTML += `
                <div class="dm-conversation ${isSavedClass}" data-dm-id="${dm.id}">
                    <div class="dm-avatar" style="background: ${dm.avatarColor}">
                        ${dm.avatar}
                    </div>
                    <div class="dm-info">
                        <div class="dm-name">${dm.name}</div>
                        <div class="dm-status">${dm.status}</div>
                    </div>
                </div>
            `;
        });

        dmList.innerHTML = dmHTML;
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.dataset.messageId = message.id;

        const isFavorited = this.favoriteMessages.some(fav => fav.id === message.id);

        messageDiv.innerHTML = `
            <div class="message-avatar" style="background-color: ${message.avatarColor}">
                ${message.avatar}
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.author}</span>
                    <span class="message-timestamp">${message.timestamp}</span>
                </div>
                <div class="message-text">${message.content.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="message-options">
                <button class="message-option favorite-btn ${isFavorited ? 'favorited' : ''}" 
                        title="${isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
                        data-message-id="${message.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                </button>
                <button class="message-option" title="Adicionar Reação">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                </button>
                <button class="message-option" title="Mais">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                </button>
            </div>
        `;

        return messageDiv;
    }

    bindEvents() {
        // Global click handler for all click events
        document.addEventListener('click', (e) => {
            // Handle favorite button clicks
            if (e.target.closest('.favorite-btn')) {
                const button = e.target.closest('.favorite-btn');
                const messageId = parseInt(button.dataset.messageId);
                this.toggleFavorite(messageId, button);
                return; // Stop processing other click events
            }
            
            // Handle remove favorite button clicks
            if (e.target.closest('.remove-favorite')) {
                e.stopPropagation();
                e.preventDefault();
                const button = e.target.closest('.remove-favorite');
                const messageId = parseInt(button.dataset.removeId);
                this.removeFavorite(messageId);
                return; // Stop processing other click events
            }

            // Handle favorites panel close (click outside)
            const favoritesPanel = document.getElementById('favorites-panel');
            const favoritesBtn = document.getElementById('favorites-btn');
            
            if (!favoritesPanel.contains(e.target) && !favoritesBtn.contains(e.target)) {
                favoritesPanel.classList.remove('open');
                favoritesBtn.classList.remove('active');
            }
        });

        // DM button toggle
        const dmButton = document.getElementById('dm-button');
        const serverChannels = document.getElementById('server-channels');
        const dmListElement = document.getElementById('dm-list');

        dmButton.addEventListener('click', () => {
            this.switchToDMView();
        });

        // DM conversation clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dm-conversation')) {
                const dmElement = e.target.closest('.dm-conversation');
                const dmId = dmElement.dataset.dmId;
                this.openDMConversation(dmId);
            }
        });

        // Server icon click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.server-icon:not(.dm-button)')) {
                this.switchToServerView();
            }
        });

        // Favorites panel toggle
        const favoritesBtn = document.getElementById('favorites-btn');
        const favoritesPanel = document.getElementById('favorites-panel');
        const closeFavoritesBtn = document.getElementById('close-favorites');

        favoritesBtn.addEventListener('click', () => {
            favoritesPanel.classList.toggle('open');
            favoritesBtn.classList.toggle('active');
            this.updateFavoritesContent();
        });

        closeFavoritesBtn.addEventListener('click', () => {
            favoritesPanel.classList.remove('open');
            favoritesBtn.classList.remove('active');
        });

        // Message input functionality
        const messageInput = document.getElementById('message-input');
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                this.addNewMessage(e.target.value.trim());
                e.target.value = '';
            }
        });

        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });
    }

    toggleFavorite(messageId, button) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        const messageData = this.extractMessageData(messageElement);
        
        const existingIndex = this.favoriteMessages.findIndex(fav => fav.id === messageId);
        
        if (existingIndex > -1) {
            // Remove from favorites
            this.favoriteMessages.splice(existingIndex, 1);
            button.classList.remove('favorited');
            button.title = 'Adicionar aos favoritos';
            button.querySelector('svg').setAttribute('fill', 'none');
        } else {
            // Add to favorites
            this.favoriteMessages.push(messageData);
            button.classList.add('favorited');
            button.title = 'Remover dos favoritos';
            button.querySelector('svg').setAttribute('fill', 'currentColor');
        }

        this.saveFavorites();
        this.updateFavoritesButton();
        
        // Update favorites panel if it's open
        if (document.getElementById('favorites-panel').classList.contains('open')) {
            this.updateFavoritesContent();
        }
    }

    extractMessageData(messageElement) {
        const avatar = messageElement.querySelector('.message-avatar');
        const author = messageElement.querySelector('.message-author').textContent;
        const timestamp = messageElement.querySelector('.message-timestamp').textContent;
        const content = messageElement.querySelector('.message-text').innerHTML;
        const messageId = parseInt(messageElement.dataset.messageId);

        return {
            id: messageId,
            author: author,
            avatar: avatar.textContent,
            avatarColor: avatar.style.backgroundColor,
            timestamp: timestamp,
            content: content
        };
    }

    updateFavoritesButton() {
        const favoritesBtn = document.getElementById('favorites-btn');
        if (this.favoriteMessages.length > 0) {
            favoritesBtn.style.position = 'relative';
            
            // Remove existing badge
            const existingBadge = favoritesBtn.querySelector('.favorites-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Add badge if there are favorites
            const badge = document.createElement('span');
            badge.className = 'favorites-badge';
            badge.textContent = this.favoriteMessages.length;
            badge.style.cssText = `
                position: absolute;
                top: -2px;
                right: -2px;
                background: #ed4245;
                color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            `;
            favoritesBtn.appendChild(badge);
        } else {
            const badge = favoritesBtn.querySelector('.favorites-badge');
            if (badge) {
                badge.remove();
            }
        }
    }

    updateFavoritesContent() {
        const favoritesContent = document.getElementById('favorites-content');
        
        if (this.favoriteMessages.length === 0) {
            favoritesContent.innerHTML = `
                <div class="empty-favorites">
                    <p>Nenhuma mensagem favorita ainda. Clique na estrela de uma mensagem para vê-la aqui!</p>
                </div>
            `;
            return;
        }

        favoritesContent.innerHTML = '';
        this.favoriteMessages.forEach(message => {
            const favoriteDiv = document.createElement('div');
            favoriteDiv.className = 'favorite-message';
            favoriteDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-author">${message.author}</span>
                    <span class="message-timestamp">${message.timestamp}</span>
                    <button class="remove-favorite" data-remove-id="${message.id}">
                        Remover
                    </button>
                </div>
                <div class="message-text">${message.content}</div>
            `;
            favoritesContent.appendChild(favoriteDiv);
        });
    }

    removeFavorite(messageId) {
        this.favoriteMessages = this.favoriteMessages.filter(fav => fav.id !== messageId);
        this.saveFavorites();
        this.updateFavoritesContent();
        this.updateFavoritesButton();

        // Update the star button in the main chat
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            const favoriteBtn = messageElement.querySelector('.favorite-btn');
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.title = 'Adicionar aos favoritos';
            favoriteBtn.querySelector('svg').setAttribute('fill', 'none');
        }

        // Keep the favorites panel open after removing a message
        const favoritesPanel = document.getElementById('favorites-panel');
        const favoritesBtn = document.getElementById('favorites-btn');
        if (favoritesPanel.classList.contains('open')) {
            favoritesBtn.classList.add('active');
        }
    }

    addNewMessage(content) {
        const newId = Date.now();
        const newMessage = {
            id: newId,
            author: this.currentUser ? this.currentUser.name : 'Você',
            avatar: this.currentUser ? this.currentUser.avatar : 'V',
            avatarColor: '#5865f2',
            timestamp: new Date().toLocaleString('pt-BR', { 
                month: 'numeric', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: false 
            }),
            content: content
        };

        const messagesContainer = document.getElementById('messages-container');
        
        // If we're in DM view, save to DM messages
        if (this.currentView === 'dm' && this.currentDM) {
            if (!this.dmMessages[this.currentDM]) {
                this.dmMessages[this.currentDM] = [];
            }
            this.dmMessages[this.currentDM].push(newMessage);
            this.saveDMMessages();
        }

        const messageElement = this.createMessageElement(newMessage);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    saveFavorites() {
        localStorage.setItem('favoriteMessages', JSON.stringify(this.favoriteMessages));
    }

    saveDMMessages() {
        localStorage.setItem('dmMessages', JSON.stringify(this.dmMessages));
    }

    initializeDMMessages() {
        // Initialize DM messages if they don't exist
        if (!this.dmMessages.fernando) {
            this.dmMessages.fernando = [
                {
                    id: 101,
                    author: 'Fernando',
                    avatar: 'F',
                    avatarColor: '#43b581',
                    timestamp: '8/6, 09:15',
                    content: 'Oi cara, você viu o pull request que eu fiz ontem?\nPreciso que alguém revise antes de fazer o merge.'
                },
                {
                    id: 102,
                    author: 'Você',
                    avatar: 'V',
                    avatarColor: '#5865f2',
                    timestamp: '8/6, 09:18',
                    content: 'Opa! Vou dar uma olhada agora mesmo.\nQual branch mesmo?'
                },
                {
                    id: 103,
                    author: 'Fernando',
                    avatar: 'F',
                    avatarColor: '#43b581',
                    timestamp: '8/6, 09:20',
                    content: 'feature/auth-improvements\nObrigado! 🚀'
                }
            ];
        }
        
        if (!this.dmMessages.fabio) {
            this.dmMessages.fabio = [
                {
                    id: 201,
                    author: 'Fabio',
                    avatar: 'Fb',
                    avatarColor: '#f04747',
                    timestamp: '7/6, 16:30',
                    content: 'Mano, você tem o link da documentação da API?\nPerdido aqui tentando implementar o endpoint de notificações.'
                },
                {
                    id: 202,
                    author: 'Você',
                    avatar: 'V',
                    avatarColor: '#5865f2',
                    timestamp: '7/6, 16:35',
                    content: 'Tenho sim! https://docs.nossa-api.com/notifications\nTem exemplos bem detalhados lá.'
                },
                {
                    id: 203,
                    author: 'Fabio',
                    avatar: 'Fb',
                    avatarColor: '#f04747',
                    timestamp: '7/6, 16:40',
                    content: 'Perfeito! Valeu demais 👍'
                }
            ];
        }
        
        if (!this.dmMessages.kaua) {
            this.dmMessages.kaua = [
                {
                    id: 301,
                    author: 'Você',
                    avatar: 'V',
                    avatarColor: '#5865f2',
                    timestamp: '6/6, 14:20',
                    content: 'Kauã, você pode me ajudar com um bug estranho?\nO componente de upload está crashando só no Safari.'
                },
                {
                    id: 302,
                    author: 'Kauã',
                    avatar: 'K',
                    avatarColor: '#9b59b6',
                    timestamp: '6/6, 14:25',
                    content: 'Claro! Safari sempre dá umas dessas mesmo...\nVocê está usando FileReader?'
                },
                {
                    id: 303,
                    author: 'Você',
                    avatar: 'V',
                    avatarColor: '#5865f2',
                    timestamp: '6/6, 14:27',
                    content: 'Sim, exatamente. Funciona perfeitamente no Chrome e Firefox.'
                },
                {
                    id: 304,
                    author: 'Kauã',
                    avatar: 'K',
                    avatarColor: '#9b59b6',
                    timestamp: '6/6, 14:30',
                    content: 'Provavelmente é problema de MIME type. Deixa eu te mandar um fix que usei antes.'
                }
            ];
        }
        
        if (!this.dmMessages.juan) {
            this.dmMessages.juan = [
                {
                    id: 401,
                    author: 'Juan',
                    avatar: 'J',
                    avatarColor: '#e67e22',
                    timestamp: '5/6, 11:45',
                    content: 'E aí! Como foi o deploy de ontem?\nConseguiu resolver aquele problema de performance?'
                },
                {
                    id: 402,
                    author: 'Você',
                    avatar: 'V',
                    avatarColor: '#5865f2',
                    timestamp: '5/6, 12:10',
                    content: 'Opa! Deu tudo certo sim!\nA otimização das queries reduziu o tempo de resposta em 70%.'
                },
                {
                    id: 403,
                    author: 'Juan',
                    avatar: 'J',
                    avatarColor: '#e67e22',
                    timestamp: '5/6, 12:15',
                    content: 'Que show! 🎉\nO usuário já deve estar sentindo a diferença.'
                }
            ];
        }
        
        this.saveDMMessages();
    }

    switchToDMView() {
        this.currentView = 'dm';
        
        // Update sidebar
        const dmButton = document.getElementById('dm-button');
        const serverIcon = document.querySelector('.server-icon:not(.dm-button)');
        const serverChannels = document.getElementById('server-channels');
        const dmList = document.getElementById('dm-list');

        dmButton.classList.add('active');
        serverIcon.classList.remove('active');
        serverChannels.classList.add('hidden');
        dmList.classList.remove('hidden');

        // If no DM is selected, open saved messages by default
        if (!this.currentDM) {
            this.openDMConversation('saved');
        }
        
        this.updateUserInterface();
    }

    switchToServerView() {
        this.currentView = 'server';
        this.currentDM = null;
        
        // Update sidebar
        const dmButton = document.getElementById('dm-button');
        const serverIcon = document.querySelector('.server-icon:not(.dm-button)');
        const serverChannels = document.getElementById('server-channels');
        const dmList = document.getElementById('dm-list');

        dmButton.classList.remove('active');
        serverIcon.classList.add('active');
        serverChannels.classList.remove('hidden');
        dmList.classList.add('hidden');

        // Clear DM selection
        document.querySelectorAll('.dm-conversation').forEach(dm => {
            dm.classList.remove('active');
        });

        // Update header and load server messages
        this.updateChannelHeader('#', 'geral');
        this.generateSampleMessages();
        this.updateMessageInputPlaceholder('Mensagem #geral');
        this.updateUserInterface();
    }

    openDMConversation(dmId) {
        this.currentDM = dmId;
        
        // Update DM selection
        document.querySelectorAll('.dm-conversation').forEach(dm => {
            dm.classList.remove('active');
        });
        document.querySelector(`[data-dm-id="${dmId}"]`).classList.add('active');

        // Update header based on DM
        if (dmId === 'saved') {
            const userName = this.currentUser ? this.currentUser.name : 'Matheus';
            this.updateChannelHeader('📥', userName);
            this.loadSavedMessages();
            this.updateMessageInputPlaceholder('Anote algo aqui');
        } else {
            const dmName = document.querySelector(`[data-dm-id="${dmId}"] .dm-name`).textContent;
            this.updateChannelHeader('@', dmName);
            this.loadDMMessages(dmId);
            this.updateMessageInputPlaceholder(`Mensagem @${dmName}`);
        }
        
        this.updateUserInterface();
    }

    updateChannelHeader(icon, name) {
        const channelInfo = document.getElementById('channel-info');
        channelInfo.innerHTML = `
            <span class="channel-hash">${icon}</span>
            <span class="channel-name">${name}</span>
        `;
    }

    updateMessageInputPlaceholder(placeholder) {
        const messageInput = document.getElementById('message-input');
        messageInput.placeholder = placeholder;
    }

    loadSavedMessages() {
        const messagesContainer = document.getElementById('messages-container');
        const savedMessages = this.dmMessages['saved'] || [];

        if (savedMessages.length === 0) {
            messagesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #72767d;">
                    <h3>Este é o seu espaço!</h3>
                    <p>Rascunhe mensagens, salve notas importantes ou mantenha links e arquivos à mão. Você também pode usar este espaço para anotar algumas coisas para você mesmo.</p>
                </div>
            `;
        } else {
            messagesContainer.innerHTML = '';
            savedMessages.forEach(message => {
                const messageElement = this.createMessageElement(message);
                messagesContainer.appendChild(messageElement);
            });
        }
    }

    loadDMMessages(dmId) {
        const messagesContainer = document.getElementById('messages-container');
        const dmMessages = this.dmMessages[dmId] || [];

        if (dmMessages.length === 0) {
            messagesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #72767d;">
                    <p>Este é o início do seu histórico de mensagens diretas com este usuário.</p>
                </div>
            `;
        } else {
            messagesContainer.innerHTML = '';
            dmMessages.forEach(message => {
                const messageElement = this.createMessageElement(message);
                messagesContainer.appendChild(messageElement);
            });
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.showLoginScreen();
    }
}

// Initialize the Discord prototype
const discordPrototype = new DiscordPrototype();
