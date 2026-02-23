# euGestante

Aplicação web moderna para acompanhamento da gestação, desenvolvida com React, TypeScript e Firebase. Oferece funcionalidades completas para gestantes gerenciarem sua saúde durante a gravidez, incluindo controles médicos, agendamentos, medicamentos e notificações.

## Arquitetura

A aplicação segue princípios de arquitetura limpa e separação de responsabilidades:

- **Frontend**: React 18 com TypeScript, utilizando Vite como build tool
- **Estilização**: Styled Components com sistema de design centralizado
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deploy**: Vercel com integração contínua via GitHub

## Stack Tecnológica

### Core
- **React 18.2.0**: Biblioteca UI com hooks e Context API
- **TypeScript 5.2.2**: Tipagem estática e segurança de tipos
- **Vite 5.0.8**: Build tool moderno com HMR e otimizações

### Roteamento e Navegação
- **React Router DOM 6.20.0**: Roteamento client-side com protected routes

### Estilização
- **Styled Components 6.1.1**: CSS-in-JS com theming e responsividade
- Sistema de design baseado em REM (12px base, 75% de 16px padrão)
- Design System com tokens de cores, espaçamento e tipografia

### Autenticação e Banco de Dados
- **Firebase 12.8.0**: 
  - Authentication (Email/Password, Google OAuth)
  - Firestore (NoSQL document database)
  - Security Rules configuradas por coleção

### Mapas e Geocodificação
- **Leaflet 1.9.4**: Biblioteca open-source para mapas interativos
- **React Leaflet 4.2.1**: Wrapper React para Leaflet
- **OpenStreetMap**: Tiles gratuitos via Nominatim API
- **Google Places API**: Autocomplete de endereços (opcional)

### Utilitários
- **React Icons 5.5.0**: Biblioteca de ícones SVG
- **XLSX 0.18.5**: Exportação de dados para Excel
- **Service Workers**: Notificações push e PWA

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/         # Botão com variantes e tamanhos
│   ├── Card/           # Card container
│   ├── Input/          # Input com validação
│   ├── Modal/          # Modal reutilizável
│   ├── Carousel/       # Carrossel responsivo
│   ├── Header/         # Cabeçalho fixo
│   ├── Footer/         # Rodapé
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Login/         # Autenticação
│   ├── Home/          # Dashboard principal
│   ├── MyNotes/       # Anotações e controles
│   └── MyProfile/     # Perfil do usuário
├── services/           # Camada de serviços
│   ├── auth.ts        # Serviços de autenticação
│   ├── appointmentService.ts
│   ├── medicationService.ts
│   └── ...
├── contexts/           # React Contexts
│   └── AuthContext.tsx
├── firebase/           # Configuração Firebase
│   ├── config.ts
│   └── index.ts
├── theme/              # Sistema de design
│   ├── theme.ts       # Tokens de design
│   └── GlobalStyles.ts
├── utils/              # Utilitários
│   ├── logger.ts      # Logging condicional
│   ├── notifications.ts
│   └── ...
└── types/              # Definições TypeScript
```

## Funcionalidades Principais

### Autenticação
- Login com email e senha
- Autenticação OAuth via Google (popup e redirect)
- Gerenciamento de perfil (email, senha, display name)
- Protected routes com verificação de autenticação

### Controles Médicos
- **Controle de Dextro**: Registro de glicemia com múltiplas medições diárias
- **Controle de Pressão Arterial**: Registro de pressão com data
- Exportação para Excel de ambos os controles

### Gestão de Medicamentos
- Cadastro de medicamentos com horários múltiplos
- Sistema de notificações push (Service Worker + Web Notifications API)
- Agendamento automático de notificações diárias
- Suporte para PWA e notificações em background

### Agendamentos
- Criação de exames e consultas
- Integração com Google Places API para autocomplete de endereços
- Visualização de próximos agendamentos
- Filtros por data e tipo

### Mapas e Localização
- Busca de hospitais e maternidades próximos
- Geolocalização do usuário
- Mapas interativos via Leaflet/OpenStreetMap

### Interface
- Design responsivo (mobile-first)
- PWA com manifest.json
- Carrossel de dicas de saúde
- Tema centralizado com suporte a dark mode (preparado)

## Configuração e Instalação

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn
- Conta Firebase com projeto configurado
- Google Places API Key (opcional, para autocomplete)

### Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/Caarlos7x/euGestante.git
cd euGestante
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example.txt .env.local
```

Edite `.env.local` com suas credenciais do Firebase:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key (opcional)
```

4. Execute em desenvolvimento:
```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

O build será gerado em `dist/` com otimizações de produção.

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório GitHub na [Vercel Dashboard](https://vercel.com)
2. Configure todas as variáveis de ambiente no dashboard do Vercel
3. Adicione o domínio do Vercel nas configurações do Firebase:
   - Firebase Console > Authentication > Settings > Authorized domains
   - Adicione: `eu-gestante.vercel.app` e `eu-gestante-*.vercel.app`
4. O deploy será automático a cada push na branch `main`

### Variáveis de Ambiente no Vercel

Configure todas as variáveis com prefixo `VITE_` no dashboard do Vercel:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_GOOGLE_MAPS_API_KEY` (opcional)

## Segurança

### Firestore Security Rules
As regras de segurança garantem que:
- Apenas usuários autenticados podem acessar dados
- Usuários só podem ler/escrever seus próprios dados
- Validação de `userId` em todas as operações

### Autenticação
- Tokens JWT gerenciados pelo Firebase
- Reautenticação obrigatória para mudanças sensíveis (email, senha)
- Proteção contra domínios não autorizados

## Performance

- Code splitting automático via Vite
- Lazy loading de componentes pesados
- Otimização de imagens e assets
- Service Worker para cache e notificações
- Build otimizado com tree-shaking

## Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento (porta 3000)
- `npm run build`: Compila para produção com TypeScript
- `npm run preview`: Preview do build de produção
- `npm run lint`: Executa ESLint

## Padrões de Código

- TypeScript strict mode
- ESLint com regras do React
- Componentes funcionais com hooks
- Separação de concerns (services, components, pages)
- Styled Components com transient props
- Logging condicional (apenas em desenvolvimento)

## Browser Support

- Chrome/Edge (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Mobile browsers (iOS Safari, Chrome Android)

Notificações push requerem HTTPS e suporte a Service Workers.

## Licença

Este projeto é privado e proprietário.

## Links

- Repositório: [GitHub](https://github.com/Caarlos7x/euGestante)
- Deploy: [Vercel](https://eu-gestante.vercel.app)
