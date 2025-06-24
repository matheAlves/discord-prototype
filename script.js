// Discord Prototype - Favorite Messages Feature
class DiscordPrototype {
    constructor() {
        this.favoriteMessages = JSON.parse(localStorage.getItem('favoriteMessages')) || [];
        this.currentView = 'server'; // 'server' or 'dm'
        this.currentDM = null; // null for server, or dm id for DMs
        this.dmMessages = JSON.parse(localStorage.getItem('dmMessages')) || {};
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.bossMessageSent = JSON.parse(localStorage.getItem('bossMessageSent')) || false;
        this.typingTimeout = null;
        this.bossMessageTimeout = null;
        this.loginEventsBound = false;
        this.mainEventsBound = false;
        this.isMobile = window.innerWidth <= 768;
        this.sidebarOpen = false;
        this.draggedElement = null;
        this.draggedIndex = null;
        this.reorderFeedbackTimeout = null;
        this.favoritesTooltipShown = JSON.parse(localStorage.getItem('favoritesTooltipShown')) || false;
        
        if (this.currentUser) {
            this.showDiscordInterface();
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        this.cleanup(); // Clean up any existing state
        this.resetUIToDefaults(); // Reset UI elements to default state
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('discord-container').classList.add('hidden');
        if (!this.loginEventsBound) {
            this.bindLoginEvents();
        }
    }

    resetUIToDefaults() {
        // Reset UI elements to default server view state
        const dmButton = document.getElementById('dm-button');
        const serverIcon = document.querySelector('.server-icon:not(.dm-button)');
        const serverChannels = document.getElementById('server-channels');
        const dmList = document.getElementById('dm-list');

        // Set server view as active
        if (dmButton) dmButton.classList.remove('active');
        if (serverIcon) serverIcon.classList.add('active');
        if (serverChannels) serverChannels.classList.remove('hidden');
        if (dmList) dmList.classList.add('hidden');

        // Clear DM conversation selections
        document.querySelectorAll('.dm-conversation').forEach(dm => {
            dm.classList.remove('active');
        });

        // Reset channel header to default
        const channelInfo = document.getElementById('channel-info');
        if (channelInfo) {
            channelInfo.innerHTML = `
                <span class="channel-hash">#</span>
                <span class="channel-name">geral</span>
            `;
        }

        // Reset mobile navigation title
        const mobileNavTitle = document.getElementById('mobile-nav-title');
        if (mobileNavTitle) {
            mobileNavTitle.textContent = '#geral';
        }
    }

    showDiscordInterface() {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('discord-container').classList.remove('hidden');
        this.initializeDMMessages();
        this.init();
        
        // Show typing indicator and boss message after login (only if not sent before)
        if (!this.bossMessageSent) {
            this.typingTimeout = setTimeout(() => {
                this.showBossTyping();
            }, 2000);
        }
    }

    bindLoginEvents() {
        this.loginEventsBound = true;
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
        if (!this.mainEventsBound) {
            this.bindEvents();
        }
        this.updateFavoritesButton();
        this.updateUserInterface();
        this.updateMobileNavigation();
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
                        title="${isFavorited ? 'Remover das mensagens favoritas' : 'Adicionar às mensagens favoritas'}"
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
        this.mainEventsBound = true;
        
        // Single global click handler for all click events
        document.addEventListener('click', (e) => {
            // Handle favorite button clicks
            if (e.target.closest('.favorite-btn')) {
                const button = e.target.closest('.favorite-btn');
                const messageId = parseInt(button.dataset.messageId);
                this.toggleFavorite(messageId, button);
                return;
            }
            
            // Handle remove favorite button clicks
            if (e.target.closest('.remove-favorite')) {
                e.stopPropagation();
                e.preventDefault();
                const button = e.target.closest('.remove-favorite');
                const messageId = parseInt(button.dataset.removeId);
                this.showRemoveFavoriteConfirmation(messageId);
                return;
            }

            // Handle DM conversation clicks
            if (e.target.closest('.dm-conversation')) {
                const dmElement = e.target.closest('.dm-conversation');
                const dmId = dmElement.dataset.dmId;
                this.openDMConversation(dmId);
                return;
            }

            // Handle server icon clicks (but not DM button)
            if (e.target.closest('.server-icon:not(.dm-button)')) {
                this.switchToServerView();
                return;
            }

            // Handle favorites panel close (click outside)
            const favoritesPanel = document.getElementById('favorites-panel');
            const favoritesBtn = document.getElementById('favorites-btn');
            
            if (!favoritesPanel.contains(e.target) && !favoritesBtn.contains(e.target)) {
                favoritesPanel.classList.remove('open');
                favoritesBtn.classList.remove('active');
            }
        });

        // DM button toggle (specific button, not using delegation)
        const dmButton = document.getElementById('dm-button');
        dmButton.addEventListener('click', () => {
            this.switchToDMView();
        });

        // Favorites panel toggle
        const favoritesBtn = document.getElementById('favorites-btn');
        const favoritesPanel = document.getElementById('favorites-panel');
        const closeFavoritesBtn = document.getElementById('close-favorites');

        favoritesBtn.addEventListener('click', () => {
            favoritesPanel.classList.toggle('open');
            favoritesBtn.classList.toggle('active');
            this.updateFavoritesContent();
            
            // Show tooltip on first open if there are favorites and tooltip hasn't been shown
            if (favoritesPanel.classList.contains('open') && 
                !this.favoritesTooltipShown && 
                this.favoriteMessages.length > 1) {
                this.showDragTooltip();
            }
        });

        closeFavoritesBtn.addEventListener('click', () => {
            favoritesPanel.classList.remove('open');
            favoritesBtn.classList.remove('active');
        });

        // Message input functionality
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        
        const sendMessage = () => {
            const message = messageInput.value.trim();
            if (message) {
                this.addNewMessage(message);
                messageInput.value = '';
            }
        };
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        sendButton.addEventListener('click', () => {
            sendMessage();
        });

        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });

        // Mobile navigation
        this.bindMobileEvents();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    bindMobileEvents() {
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const mobileFavoritesBtn = document.getElementById('mobile-favorites-btn');
        const sidebar = document.getElementById('sidebar');

        // Mobile navigation toggle
        mobileNavToggle.addEventListener('click', () => {
            this.toggleMobileSidebar();
        });

        // Mobile overlay click to close sidebar
        mobileOverlay.addEventListener('click', () => {
            this.closeMobileSidebar();
        });

        // Mobile favorites button
        mobileFavoritesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const favoritesPanel = document.getElementById('favorites-panel');
            const favoritesBtn = document.getElementById('favorites-btn');
            
            favoritesPanel.classList.toggle('open');
            favoritesBtn.classList.toggle('active');
            this.updateFavoritesContent();
            
            // Show tooltip on first open if there are favorites and tooltip hasn't been shown
            if (favoritesPanel.classList.contains('open') && 
                !this.favoritesTooltipShown && 
                this.favoriteMessages.length > 1) {
                this.showDragTooltip();
            }
            
            // Close mobile sidebar when opening favorites
            this.closeMobileSidebar();
        });

        // Close mobile sidebar when clicking on DM conversations
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dm-conversation') && this.isMobile) {
                this.closeMobileSidebar();
            }
        });

        // Handle mobile favorites panel close (click outside)
        document.addEventListener('click', (e) => {
            if (this.isMobile) {
                const favoritesPanel = document.getElementById('favorites-panel');
                const favoritesBtn = document.getElementById('favorites-btn');
                const mobileFavoritesBtn = document.getElementById('mobile-favorites-btn');
                const closeFavoritesBtn = document.getElementById('close-favorites');
                
                // Check if click is outside favorites panel and not on trigger buttons
                if (!favoritesPanel.contains(e.target) && 
                    !favoritesBtn.contains(e.target) && 
                    !mobileFavoritesBtn.contains(e.target) &&
                    !closeFavoritesBtn.contains(e.target) &&
                    favoritesPanel.classList.contains('open')) {
                    favoritesPanel.classList.remove('open');
                    favoritesBtn.classList.remove('active');
                }
            }
        });
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        
        this.sidebarOpen = !this.sidebarOpen;
        
        if (this.sidebarOpen) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
        } else {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        
        this.sidebarOpen = false;
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        
        // On mobile, if in DM view and a conversation is pre-selected,
        // show that conversation when sidebar closes
        if (this.isMobile && this.currentView === 'dm' && this.currentDM) {
            this.showPreselectedDMConversation();
        }
    }

    // Method to show the pre-selected DM conversation
    showPreselectedDMConversation() {
        if (this.currentDM === 'saved') {
            const userName = this.currentUser ? this.currentUser.name : 'Matheus';
            this.updateChannelHeader('📥', userName);
            this.loadSavedMessages();
            this.updateMessageInputPlaceholder('Anote algo aqui');
        } else if (this.currentDM) {
            const dmName = document.querySelector(`[data-dm-id="${this.currentDM}"] .dm-name`).textContent;
            this.updateChannelHeader('@', dmName);
            this.loadDMMessages(this.currentDM);
            this.updateMessageInputPlaceholder(`Mensagem @${dmName}`);
        }
        
        this.updateUserInterface();
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // If switching from mobile to desktop, close mobile sidebar
        if (wasMobile && !this.isMobile) {
            this.closeMobileSidebar();
        }
        
        // Update mobile navigation visibility
        this.updateMobileNavigation();
    }

    updateMobileNavigation() {
        const mobileNav = document.getElementById('mobile-nav');
        
        if (this.isMobile) {
            mobileNav.style.display = 'flex';
            this.updateMobileNavTitle();
            this.updateMobileFavoritesButton();
        } else {
            mobileNav.style.display = 'none';
        }
    }

    updateMobileNavTitle() {
        const mobileNavTitle = document.getElementById('mobile-nav-title');
        
        if (this.currentView === 'server') {
            mobileNavTitle.textContent = '#geral';
        } else if (this.currentView === 'dm' && !this.currentDM) {
            // When in DM view but no specific conversation selected
            mobileNavTitle.textContent = '💬 Mensagens Diretas';
        } else if (this.currentDM === 'saved') {
            const userName = this.currentUser ? this.currentUser.name : 'Matheus';
            mobileNavTitle.textContent = `📥 ${userName}`;
        } else if (this.currentDM) {
            const dmName = document.querySelector(`[data-dm-id="${this.currentDM}"] .dm-name`)?.textContent || 'DM';
            mobileNavTitle.textContent = `@ ${dmName}`;
        }
    }

    updateMobileFavoritesButton() {
        const mobileFavoritesBtn = document.getElementById('mobile-favorites-btn');
        
        // Remove existing badge
        const existingBadge = mobileFavoritesBtn.querySelector('.favorites-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add badge if there are favorites
        if (this.favoriteMessages.length > 0) {
            mobileFavoritesBtn.style.position = 'relative';
            mobileFavoritesBtn.classList.add('has-favorites');
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
            mobileFavoritesBtn.appendChild(badge);
        } else {
            mobileFavoritesBtn.classList.remove('has-favorites');
        }
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
            // Add to favorites - trigger flying star animation
            this.favoriteMessages.push(messageData);
            button.classList.add('favorited');
            button.title = 'Remover dos favoritos';
            button.querySelector('svg').setAttribute('fill', 'currentColor');
            
            // Trigger the flying star animation
            this.animateFlyingStar(button);
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
            favoritesBtn.classList.add('has-favorites');
            
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
            favoritesBtn.classList.remove('has-favorites');
            const badge = favoritesBtn.querySelector('.favorites-badge');
            if (badge) {
                badge.remove();
            }
        }
        
        // Update mobile favorites button too
        if (this.isMobile) {
            this.updateMobileFavoritesButton();
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
        this.favoriteMessages.forEach((message, index) => {
            const favoriteDiv = document.createElement('div');
            favoriteDiv.className = 'favorite-message';
            favoriteDiv.draggable = true;
            favoriteDiv.dataset.messageId = message.id;
            favoriteDiv.dataset.originalIndex = index;
            favoriteDiv.innerHTML = `
                <div class="drag-handle" title="Arrastar para reordenar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="6" r="2"></circle>
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="5" cy="18" r="2"></circle>
                        <circle cx="12" cy="6" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="12" cy="18" r="2"></circle>
                        <circle cx="19" cy="6" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                        <circle cx="19" cy="18" r="2"></circle>
                    </svg>
                </div>
                <div class="favorite-content">
                    <div class="message-header">
                        <span class="message-author">${message.author}</span>
                        <span class="message-timestamp">${message.timestamp}</span>
                        <button class="remove-favorite" data-remove-id="${message.id}">
                            Remover
                        </button>
                    </div>
                    <div class="message-text">${message.content}</div>
                </div>
            `;
            favoritesContent.appendChild(favoriteDiv);
        });

        // Add drag and drop event listeners
        this.bindDragDropEvents();
    }

    bindDragDropEvents() {
        const favoriteMessages = document.querySelectorAll('.favorite-message[draggable="true"]');
        
        favoriteMessages.forEach(message => {
            message.addEventListener('dragstart', this.handleDragStart.bind(this));
            message.addEventListener('dragover', this.handleDragOver.bind(this));
            message.addEventListener('drop', this.handleDrop.bind(this));
            message.addEventListener('dragend', this.handleDragEnd.bind(this));
            message.addEventListener('dragenter', this.handleDragEnter.bind(this));
            message.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    handleDragStart(e) {
        this.draggedElement = e.currentTarget;
        this.draggedIndex = parseInt(e.currentTarget.dataset.originalIndex);
        
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
        
        // Enhanced visual feedback
        document.body.classList.add('drag-active');
        
        // Add drop zones indicators
        document.querySelectorAll('.favorite-message:not(.dragging)').forEach(msg => {
            msg.classList.add('drop-zone');
        });
        
        // Create a custom drag image that's slightly transparent
        setTimeout(() => {
            e.currentTarget.style.opacity = '0.6';
            e.currentTarget.style.transform = 'rotate(3deg) scale(1.05)';
        }, 0);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Only add drag-over effect if not already present and not the dragged element
        if (e.currentTarget !== this.draggedElement && !e.currentTarget.classList.contains('drag-over')) {
            // Remove drag-over from all other elements first
            document.querySelectorAll('.favorite-message.drag-over').forEach(el => {
                if (el !== e.currentTarget) {
                    el.classList.remove('drag-over');
                    el.style.transform = '';
                }
            });
            
            // Add to current target
            e.currentTarget.classList.add('drag-over');
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
        }
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.currentTarget !== this.draggedElement) {
            // Remove from others and add to current
            document.querySelectorAll('.favorite-message.drag-over').forEach(el => {
                if (el !== e.currentTarget) {
                    el.classList.remove('drag-over');
                    el.style.transform = '';
                }
            });
            
            e.currentTarget.classList.add('drag-over');
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.transition = 'all 0.2s ease';
        }
    }

    handleDragLeave(e) {
        // Only remove if we're actually leaving the element (not entering a child)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            e.currentTarget.classList.remove('drag-over');
            e.currentTarget.style.transform = '';
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (this.draggedElement && e.currentTarget !== this.draggedElement) {
            const dropIndex = parseInt(e.currentTarget.dataset.originalIndex);
            this.reorderFavorites(this.draggedIndex, dropIndex);
        }
    }

    handleDragEnd(e) {
        e.currentTarget.style.opacity = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.transition = '';
        e.currentTarget.classList.remove('dragging');
        
        // Remove global drag state
        document.body.classList.remove('drag-active');
        
        // Remove drag-over class and drop zone indicators from all elements
        document.querySelectorAll('.favorite-message').forEach(el => {
            el.classList.remove('drag-over', 'drop-zone');
            el.style.transform = '';
            el.style.transition = '';
        });
        
        this.draggedElement = null;
        this.draggedIndex = null;
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.favorite-message:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    reorderFavorites(fromIndex, toIndex) {
        // Create a new array with the reordered items
        const newFavorites = [...this.favoriteMessages];
        const [movedItem] = newFavorites.splice(fromIndex, 1);
        newFavorites.splice(toIndex, 0, movedItem);
        
        // Update the favorites array
        this.favoriteMessages = newFavorites;
        this.saveFavorites();
        
        // Refresh the favorites content with the new order
        this.updateFavoritesContent();
        
        // Add subtle animation to show order change
        setTimeout(() => {
            const favoriteMessages = document.querySelectorAll('.favorite-message');
            favoriteMessages.forEach((msg, index) => {
                msg.style.animation = 'reorderPulse 0.5s ease';
                setTimeout(() => {
                    msg.style.animation = '';
                }, 500);
            });
        }, 100);
        
        // Show feedback that the reorder was successful
        this.showReorderFeedback();
    }

    showReorderFeedback() {
        const favoritesHeader = document.querySelector('.favorites-header h3');
        if (!favoritesHeader) return;
        
        const originalText = 'Mensagens Favoritas'; // Use consistent text
        
        // Clear any existing timeout to prevent conflicts
        if (this.reorderFeedbackTimeout) {
            clearTimeout(this.reorderFeedbackTimeout);
        }
        
        // Add visual feedback with animation
        favoritesHeader.textContent = '✓ Ordem atualizada!';
        favoritesHeader.style.color = '#43b581';
        favoritesHeader.style.transform = 'scale(1.05)';
        favoritesHeader.style.transition = 'all 0.2s ease';
        
        // Reset after animation
        this.reorderFeedbackTimeout = setTimeout(() => {
            favoritesHeader.style.transform = 'scale(1)';
            setTimeout(() => {
                favoritesHeader.textContent = originalText;
                favoritesHeader.style.color = '';
                favoritesHeader.style.transform = '';
                favoritesHeader.style.transition = '';
            }, 200);
        }, 1300);
    }

    animateFlyingStar(sourceButton) {
        console.log('Flying star animation started'); // Debug log
        
        // Get the source button position
        const sourceRect = sourceButton.getBoundingClientRect();
        console.log('Source rect:', sourceRect); // Debug log
        
        // Get the target favorites button (check both desktop and mobile)
        let targetButton = document.getElementById('favorites-btn');
        if (this.isMobile || !targetButton || getComputedStyle(targetButton).display === 'none') {
            targetButton = document.getElementById('mobile-favorites-btn');
        }
        
        if (!targetButton) {
            console.log('No target button found'); // Debug log
            return;
        }
        
        const targetRect = targetButton.getBoundingClientRect();
        console.log('Target rect:', targetRect); // Debug log
        
        // Create the flying star element
        const flyingStar = document.createElement('div');
        flyingStar.className = 'flying-star';
        flyingStar.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
            </svg>
        `;
        
        // Calculate start position (center of source button)
        const startX = sourceRect.left + sourceRect.width / 2 - 8;
        const startY = sourceRect.top + sourceRect.height / 2 - 8;
        
        // Calculate end position (center of target button)
        const endX = targetRect.left + targetRect.width / 2 - 8;
        const endY = targetRect.top + targetRect.height / 2 - 8;
        
        // Position the flying star at the source button location
        flyingStar.style.position = 'fixed';
        flyingStar.style.left = startX + 'px';
        flyingStar.style.top = startY + 'px';
        flyingStar.style.zIndex = '9999';
        flyingStar.style.pointerEvents = 'none';
        
        // Add to body
        document.body.appendChild(flyingStar);
        console.log('Flying star element added to body'); // Debug log
        
        // Force a reflow to ensure the element is rendered
        flyingStar.offsetHeight;
        
        // Trigger the animation to the target
        setTimeout(() => {
            flyingStar.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            flyingStar.style.left = endX + 'px';
            flyingStar.style.top = endY + 'px';
            flyingStar.style.transform = 'scale(0.8)';
            flyingStar.style.opacity = '0.9';
            console.log('Animation triggered'); // Debug log
        }, 10);
        
        // Add pulse animation to the target button
        targetButton.classList.add('favorites-button-pulse');
        
        // Clean up after animation
        setTimeout(() => {
            if (flyingStar.parentNode) {
                flyingStar.parentNode.removeChild(flyingStar);
                console.log('Flying star cleaned up'); // Debug log
            }
            targetButton.classList.remove('favorites-button-pulse');
        }, 650);
    }

    showRemoveFavoriteConfirmation(messageId) {
        // Find the message details
        const message = this.favoriteMessages.find(fav => fav.id === messageId);
        if (!message) return;

        // Create confirmation dialog
        const confirmationOverlay = document.createElement('div');
        confirmationOverlay.className = 'confirmation-overlay';
        
        const confirmationDialog = document.createElement('div');
        confirmationDialog.className = 'confirmation-dialog';
        
        confirmationDialog.innerHTML = `
            <div class="confirmation-header">
                <h3>Remover mensagem favorita</h3>
            </div>
            <div class="confirmation-content">
                <p>Tem certeza de que deseja remover esta mensagem dos seus favoritos?</p>
                <div class="message-preview">
                    <div class="preview-author">${message.author}</div>
                    <div class="preview-text">${message.content}</div>
                </div>
            </div>
            <div class="confirmation-actions">
                <button class="confirmation-btn cancel-btn" id="cancel-remove">Cancelar</button>
                <button class="confirmation-btn confirm-btn" id="confirm-remove">Remover</button>
            </div>
        `;
        
        confirmationOverlay.appendChild(confirmationDialog);
        document.body.appendChild(confirmationOverlay);
        
        // Add event listeners
        const cancelBtn = confirmationDialog.querySelector('#cancel-remove');
        const confirmBtn = confirmationDialog.querySelector('#confirm-remove');
        
        const removeDialog = () => {
            document.body.removeChild(confirmationOverlay);
        };
        
        cancelBtn.addEventListener('click', removeDialog);
        
        confirmBtn.addEventListener('click', () => {
            this.removeFavorite(messageId);
            removeDialog();
        });
        
        // Close on overlay click
        confirmationOverlay.addEventListener('click', (e) => {
            if (e.target === confirmationOverlay) {
                removeDialog();
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                removeDialog();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Focus on cancel button by default
        setTimeout(() => cancelBtn.focus(), 100);
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

        // On mobile, pre-select saved messages in background but keep DM list visible
        if (this.isMobile) {
            // Pre-select saved messages conversation in the background without closing sidebar
            this.openDMConversationMobile('saved', false);
            
            // Override the header and content to show DM list placeholder
            this.updateChannelHeader('💬', 'Mensagens Diretas');
            this.showDMListPlaceholder();
            
            // Keep sidebar open to show DM list
            // Don't close mobile sidebar here
        } else {
            // On desktop, auto-select saved messages if no DM is selected
            if (!this.currentDM) {
                this.openDMConversation('saved');
            }
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
        
        // Close mobile sidebar if open
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
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
        
        // Close mobile sidebar when a specific DM is selected
        // Only close if this was triggered by user interaction (not automatic pre-selection)
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
    }

    // New method for opening DM conversation on mobile without closing sidebar
    openDMConversationMobile(dmId, closeSidebar = true) {
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
        
        // Only close mobile sidebar if explicitly requested
        if (this.isMobile && closeSidebar) {
            this.closeMobileSidebar();
        }
    }

    updateChannelHeader(icon, name) {
        const channelInfo = document.getElementById('channel-info');
        channelInfo.innerHTML = `
            <span class="channel-hash">${icon}</span>
            <span class="channel-name">${name}</span>
        `;
        
        // Update mobile navigation title
        if (this.isMobile) {
            this.updateMobileNavTitle();
        }
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

    showBossTyping() {
        // Only show if we're in the main server channel and boss message hasn't been sent
        if (this.currentView === 'server' && !this.bossMessageSent) {
            this.showTypingIndicator();
            
            // After 5 seconds, remove typing indicator and add boss message
            this.bossMessageTimeout = setTimeout(() => {
                this.hideTypingIndicator();
                this.addBossMessage();
            }, 5000);
        }
    }

    showTypingIndicator() {
        // Remove any existing typing indicator first
        this.hideTypingIndicator();
        
        const messagesContainer = document.getElementById('messages-container');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        
        typingIndicator.innerHTML = `
            <div class="typing-content">
                <div class="typing-avatar" style="background-color: #e74c3c;">JB</div>
                <div class="typing-text">
                    <strong>John Boss</strong> está digitando...
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addBossMessage() {
        // Double-check to prevent duplicate messages
        if (this.bossMessageSent) {
            return;
        }
        
        const bossMessage = {
            id: Date.now(),
            author: 'John Boss',
            avatar: 'JB',
            avatarColor: '#e74c3c',
            timestamp: new Date().toLocaleString('pt-BR', { 
                month: 'numeric', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: false 
            }),
            content: `Oi ${this.currentUser.name}! Preciso que você revise o relatório de vendas do último trimestre até o final da semana.\n\nTambém temos uma reunião importante na segunda-feira às 14h para discutir as metas do próximo mês. Por favor, prepare uma apresentação com os KPIs atuais.\n\nObrigado! 📊`
        };

        const messagesContainer = document.getElementById('messages-container');
        const messageElement = this.createMessageElement(bossMessage);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Set the flag to prevent future duplicates
        this.bossMessageSent = true;
        localStorage.setItem('bossMessageSent', JSON.stringify(this.bossMessageSent));
    }

    cleanup() {
        // Clear any existing timeouts
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
        if (this.bossMessageTimeout) {
            clearTimeout(this.bossMessageTimeout);
            this.bossMessageTimeout = null;
        }
        
        // Remove typing indicator if it exists
        this.hideTypingIndicator();
    }

    logout() {
        this.cleanup();
        
        // Preserve saved messages before clearing data
        const savedMessages = this.dmMessages['saved'] || [];
        
        // Clear localStorage data except saved messages
        localStorage.removeItem('currentUser');
        localStorage.removeItem('bossMessageSent');
        localStorage.removeItem('favoriteMessages');
        
        // Reset all instance variables to their initial state
        this.currentUser = null;
        this.bossMessageSent = false;
        this.favoriteMessages = [];
        this.dmMessages = {
            'saved': savedMessages  // Preserve only saved messages
        };
        this.currentView = 'server'; // Reset to default server view
        this.currentDM = null; // Reset DM selection
        
        // Update localStorage with preserved saved messages
        this.saveDMMessages();
        
        this.showLoginScreen();
    }

    showDMListPlaceholder() {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #72767d;">
                <h3>💬 Mensagens Diretas</h3>
                <p>Selecione uma conversa na lista lateral para começar a conversar.</p>
                <p style="margin-top: 20px; font-size: 14px;">Você pode:</p>
                <ul style="list-style: none; padding: 0; margin-top: 10px;">
                    <li>📥 Acessar suas mensagens salvas</li>
                    <li>💬 Conversar com membros da equipe</li>
                    <li>⭐ Favoritar mensagens importantes</li>
                </ul>
            </div>
        `;
    }

    showDragTooltip() {
        // Only show if there are multiple favorites to reorder
        if (this.favoriteMessages.length < 2) return;
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'drag-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 6v5h5v-5h-5zm-2 0H6v5h5V6zm2 7v5h5v-5h-5zm-2 0H6v5h5v-5z"/>
                    </svg>
                </div>
                <div class="tooltip-text">
                    <strong>Dica:</strong> Você pode reordenar as mensagens clicando e arrastando nelas
                </div>
                <button class="tooltip-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Position tooltip
        const favoritesContent = document.getElementById('favorites-content');
        if (favoritesContent) {
            favoritesContent.insertBefore(tooltip, favoritesContent.firstChild);
            
            // Add animation
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 100);
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.classList.add('hide');
                    setTimeout(() => {
                        if (tooltip.parentNode) {
                            tooltip.remove();
                        }
                    }, 300);
                }
            }, 8000);
            
            // Mark as shown
            this.favoritesTooltipShown = true;
            localStorage.setItem('favoritesTooltipShown', 'true');
        }
    }

    // Add method to reset tooltip for testing/demo purposes
    resetTooltip() {
        this.favoritesTooltipShown = false;
        localStorage.removeItem('favoritesTooltipShown');
    }
}

// Initialize the Discord prototype
const discordPrototype = new DiscordPrototype();
