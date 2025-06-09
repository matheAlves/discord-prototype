# Protótipo Discord - Funcionalidade de Mensagens Favoritas

Um protótipo de média fidelidade de uma interface de chat similar ao Discord com uma nova funcionalidade de mensagens favoritas. Este protótipo demonstra como os usuários podem favoritar mensagens e acessá-las através de um painel dedicado de favoritos.

## Funcionalidades

### Funcionalidades Principais
- **Interface de Chat Similar ao Discord**: Estilização autêntica do Discord com barra lateral, lista de canais e área de mensagens
- **Navegação entre Servidores e DMs**: Botão de alternância para alternar entre canais do servidor e mensagens diretas
- **Sistema de Mensagens Diretas**: Conversas individuais com membros da equipe e chat pessoal "Matheus"
- **Hover em Mensagens**: Passe o mouse sobre mensagens para revelar botões de ação (estrela, reação, mais opções)
- **Mensagens Favoritas**: Clique no ícone de estrela para adicionar/remover mensagens dos favoritos
- **Painel de Favoritos**: Acesse mensagens favoritadas através do botão de estrela na barra de ferramentas superior
- **Armazenamento Local**: Favoritos e mensagens DM persistem entre sessões do navegador
- **Atualizações em Tempo Real**: Adicione novas mensagens digitando na entrada de mensagem

## Como Começar
1. Abra `index.html` em um navegador web
2. Passe o mouse sobre qualquer mensagem para ver os botões de ação aparecerem
3. Clique no ícone de estrela para favoritar uma mensagem
4. Clique no botão de estrela na barra de ferramentas superior para ver seus favoritos
5. Use o botão do Discord (DM) para alternar entre servidor e mensagens diretas
6. Clique em qualquer conversa DM para ver mensagens específicas
7. Digite na entrada de mensagem e pressione Enter para adicionar novas mensagens

## Estrutura do Projeto
```
protótipo-discord/
├── index.html                  # Estrutura HTML principal
├── styles.css                  # Estilos CSS com tema Discord
├── script.js                   # Funcionalidade JavaScript
├── README.md                   # Este arquivo
├── .vscode/
│   └── tasks.json             # Configuração de tarefas do VS Code
└── .github/
    └── copilot-instructions.md # Diretrizes de desenvolvimento
```

## Implementação Técnica
- **HTML5**: Marcação semântica com considerações adequadas de acessibilidade
- **CSS3**: CSS moderno com flexbox, transições e barras de rolagem customizadas
- **JavaScript Vanilla**: Sem dependências externas, usa recursos ES6+
- **API LocalStorage**: Para persistir mensagens favoritas e conversas DM entre sessões
- **Gerenciamento de Estado**: Sistema de navegação entre visualizações de servidor e DM
- **Ícones SVG**: Ícones vetoriais responsivos com suporte a hover e estados ativos

## Funcionalidades Avançadas
- **Sistema de Navegação Contextual**: Alternância suave entre canais de servidor e DMs
- **Persistência de Dados**: Todas as conversas DM e favoritos são salvos localmente
- **Interface Responsiva**: Design adaptável com efeitos de hover autênticos do Discord
- **Mensagens em Português Brasileiro**: Conversas realistas entre desenvolvedores brasileiros
- **Estados Visuais**: Indicadores de status online, badges de contagem e feedback visual

## Compatibilidade do Navegador
Este protótipo funciona em todos os navegadores modernos que suportam:
- Recursos JavaScript ES6+
- CSS Flexbox e Grid
- API LocalStorage
- Ícones SVG
- Eventos de mouse e teclado

## Como Executar Localmente
1. Clone ou baixe este repositório
2. Abra um terminal na pasta do projeto
3. Execute um servidor HTTP local:
   ```bash
   python3 -m http.server 8000
   ```
4. Abra seu navegador e vá para `http://localhost:8000`

---

*Este é um protótipo construído para fins de demonstração e não é afiliado à Discord Inc.*
