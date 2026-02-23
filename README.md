# euGestante - Aplicação Frontend

Aplicação React + TypeScript para acompanhamento da gestação.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Styled Components** - CSS-in-JS
- **React Router** - Navegação
- **Firebase** - Autenticação e Firestore
- **React Icons** - Ícones
- **Leaflet** - Mapas (OpenStreetMap)
- **XLSX** - Exportação para Excel

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Firebase configurada
- Google Maps API Key (opcional, para busca de endereços)

## 🔧 Instalação

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

Edite o arquivo `.env.local` com suas credenciais do Firebase (veja `CONFIGURACAO_FIREBASE.md`).

4. Execute o projeto:
```bash
npm run dev
```

## 🚀 Deploy na Vercel

Veja o guia completo em: [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

### Resumo rápido:

1. Conecte o repositório na [Vercel Dashboard](https://vercel.com)
2. Configure as variáveis de ambiente (veja `env.example.txt`)
3. Faça o deploy!

## 📚 Documentação

- [Configuração Firebase](./CONFIGURACAO_FIREBASE.md)
- [Configuração Google Places API](./CONFIGURACAO_GOOGLE_PLACES.md)
- [Regras Firestore](./REGRAS_FIRESTORE.md)
- [Deploy Vercel](./DEPLOY_VERCEL.md)

## 🎯 Funcionalidades

- ✅ Autenticação (Email/Password e Google)
- ✅ Controle de Dextro
- ✅ Controle de Pressão Arterial
- ✅ Gestão de Medicamentos com Notificações
- ✅ Agendamento de Exames/Consultas
- ✅ Busca de Hospitais Próximos
- ✅ Dicas de Saúde para Gestação
- ✅ Perfil do Usuário
- ✅ PWA (Progressive Web App)
- ✅ Notificações Push

## 🛠️ Scripts

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📝 Licença

Este projeto é privado.

## 🔗 Links

- [Repositório](https://github.com/Caarlos7x/euGestante)
- [Deploy](https://eu-gestante.vercel.app)
