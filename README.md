# euGestante

Aplicação web e mobile para acompanhamento da gestação, desenvolvida com React, TypeScript e seguindo as melhores práticas de System Design.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Styled Components** - CSS-in-JS para estilização
- **React Router** - Roteamento para aplicações React
- **Firebase** - Autenticação e backend (Auth + Firestore)
- **Firebase Admin** - Backend serverless na Vercel

## 📁 Estrutura do Projeto

```
euGestante/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── ProtectedRoute/
│   ├── contexts/         # Contexts React (Auth)
│   │   └── AuthContext.tsx
│   ├── firebase/         # Configuração do Firebase
│   │   ├── config.ts
│   │   └── index.ts
│   ├── pages/           # Páginas da aplicação
│   │   ├── Login/
│   │   └── Dashboard/
│   ├── services/        # Serviços (API, Auth)
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── theme/           # Sistema de design e tema global
│   │   ├── theme.ts
│   │   ├── GlobalStyles.ts
│   │   └── index.ts
│   ├── types/           # Definições de tipos TypeScript
│   ├── utils/           # Funções utilitárias
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Ponto de entrada
├── public/              # Arquivos estáticos
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── env.example.txt      # Exemplo de variáveis de ambiente
```

## 🎨 Sistema de Design

O projeto utiliza um sistema de design centralizado com tema global, garantindo:

- **Consistência visual** em toda a aplicação
- **Responsividade** para mobile e desktop
- **Acessibilidade** com foco em UX
- **Manutenibilidade** através de tokens de design

### Tema

O tema inclui:
- Cores primárias e secundárias
- Tipografia com hierarquia clara
- Espaçamentos padronizados
- Breakpoints responsivos
- Sombras e bordas arredondadas
- Transições suaves

## 🛠️ Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com as credenciais do Firebase:

```bash
# Copie o arquivo de exemplo
cp env.example.txt .env.local
```

Preencha as variáveis com suas credenciais do Firebase Console:
- Acesse [Firebase Console](https://console.firebase.google.com/)
- Vá em Project Settings > General > Your apps
- Copie as credenciais para o arquivo `.env.local`

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_APP_ID=seu-app-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse `http://localhost:3000`

## 📱 Responsividade

A aplicação é totalmente responsiva, com breakpoints configurados para:
- Mobile: 0px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## 🎯 Funcionalidades

### Autenticação

- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Login com Google (popup em desktop, redirect em mobile)
- ✅ Persistência de sessão
- ✅ Proteção de rotas
- ✅ Gerenciamento de estado de autenticação

### Tela de Login

- Validação de formulário em tempo real
- Feedback visual de erros
- Design responsivo
- Suporte para login com Google
- Alternância entre login e cadastro

### Dashboard

- Exibição de informações do perfil
- Integração com API backend
- Logout seguro

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🔒 Boas Práticas Implementadas

- ✅ TypeScript para type safety
- ✅ Componentes reutilizáveis
- ✅ Sistema de design centralizado
- ✅ Responsividade mobile-first
- ✅ Validação de formulários
- ✅ Acessibilidade (ARIA labels, focus states)
- ✅ Estrutura de pastas organizada
- ✅ Path aliases configurados
- ✅ Autenticação com Firebase
- ✅ Context API para gerenciamento de estado
- ✅ Rotas protegidas
- ✅ Tratamento de erros
- ✅ Mensagens de erro amigáveis

## 🔐 Autenticação e Backend

### Firebase Authentication

O projeto utiliza Firebase Authentication para:
- Login com email/senha
- Login com Google (OAuth)
- Gerenciamento de sessão
- Tokens JWT para autenticação na API

### API Backend

O backend está hospedado na Vercel e utiliza:
- Firebase Admin SDK para validação de tokens
- Firestore para armazenamento de dados
- Serverless Functions para endpoints da API

### Endpoints Disponíveis

- `GET /api/health` - Health check
- `GET/POST /api/profile` - Perfil do usuário
- `GET/POST /api/records?type=peso|glicemia|pressao` - Registros de saúde
- `GET/POST /api/consultas` - Consultas médicas
- `GET/POST /api/exames` - Exames médicos
- `GET/POST /api/alertas` - Alertas por semana
- `GET/POST /api/lembretes` - Lembretes

Todos os endpoints (exceto `/api/health`) requerem autenticação via Bearer token no header `Authorization`.

## 📄 Licença

Este projeto é privado e proprietário.
