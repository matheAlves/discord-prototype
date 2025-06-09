<!-- Use este arquivo para fornecer instruções customizadas específicas do workspace para o Copilot. Para mais detalhes, visite https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Protótipo Discord - Funcionalidade de Mensagens Favoritas

Este é um protótipo de interface de chat similar ao Discord focado na implementação de uma funcionalidade de mensagens favoritas. O projeto demonstra:

## Funcionalidades Principais
- **Mensagens Favoritas**: Usuários podem favoritar mensagens passando o mouse sobre elas e clicando no ícone de estrela
- **Painel de Favoritos**: Painel deslizante acessível através da barra de ferramentas superior que mostra todas as mensagens favoritadas
- **Sistema de Mensagens Diretas**: Navegação completa entre canais de servidor e conversas DM individuais
- **Chat Pessoal "Matheus"**: Funcionalidade de mensagens salvas que aparece no topo da lista de DMs
- **Armazenamento Local**: Favoritos e mensagens DM são persistidos usando localStorage do navegador
- **Interface Similar ao Discord**: Estilização autêntica do Discord com interações realistas

## Funcionalidades de Interface
- **Efeitos de Hover Aprimorados**: Barras verticais brancas em ícones de servidor com alturas diferentes para hover (24px) e ativo (48px)
- **Espaçamento de Mensagens Otimizado**: Maior espaçamento entre mensagens para melhor legibilidade
- **Barra de Usuário**: Avatar "M", nome "Matheus" e indicador de status online na parte inferior da barra lateral
- **Ícone Discord Autêntico**: Botão DM usa o ícone oficial do Discord extraído do Figma
- **Conversas DM Realistas**: Mensagens de placeholder em português brasileiro entre desenvolvedores

## Estrutura do Projeto
- `index.html` - Estrutura HTML principal com layout similar ao Discord
- `styles.css` - CSS com tema Discord incluindo efeitos de hover e animações
- `script.js` - Funcionalidade JavaScript para sistema de favoritos e navegação DM

## Diretrizes de Desenvolvimento
- Manter a linguagem visual de design do Discord (cores, espaçamento, tipografia)
- Manter interações de hover suaves e responsivas
- Garantir acessibilidade com labels ARIA adequados e navegação por teclado
- Usar HTML semântico e JavaScript limpo e manutenível
- Preservar a experiência autêntica do usuário Discord ao adicionar novas funcionalidades
- Todo o conteúdo deve estar em português brasileiro
- Usar conversas realistas entre desenvolvedores brasileiros para demonstração

## Detalhes Técnicos
- **Sem Dependências Externas**: Usa apenas HTML5, CSS3 e JavaScript vanilla
- **ES6+ Features**: Aproveitamento de recursos modernos do JavaScript
- **Flexbox Layout**: Layout responsivo usando CSS Flexbox
- **LocalStorage**: Persistência de dados no navegador
- **SVG Icons**: Ícones vetoriais escaláveis com suporte a estados
- **Gerenciamento de Estado**: Sistema de navegação entre visualizações

## Funcionalidades Implementadas
✅ Sistema completo de mensagens favoritas
✅ Painel deslizante de favoritos com funcionalidade de remoção
✅ Navegação entre servidor e DMs
✅ Chat pessoal "Matheus" para notas e lembretes
✅ Conversas DM com conteúdo em português brasileiro
✅ Efeitos de hover autênticos do Discord
✅ Barra de usuário com status online
✅ Espaçamento otimizado de mensagens
✅ Ícone oficial do Discord para botão DM
✅ Persistência de dados com localStorage
