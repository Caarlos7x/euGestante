# 🔥 Configuração do Firebase

Para que a aplicação funcione corretamente, você precisa configurar as credenciais do Firebase.

## 📋 Passo a Passo

### 1. Obter as credenciais do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Project Settings** (ícone de engrenagem)
4. Na aba **General**, role até **Your apps**
5. Se você já tem um app web, clique nele. Caso contrário, clique em **Add app** > **Web** (ícone `</>`)
6. Copie as credenciais mostradas no objeto `firebaseConfig`

### 2. Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo chamado `.env.local` com o seguinte conteúdo:

```env
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_APP_ID=seu-app-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
```

**Substitua os valores** pelos valores reais do seu projeto Firebase.

### 3. Exemplo de arquivo `.env.local`

```env
VITE_FIREBASE_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvw
VITE_FIREBASE_AUTH_DOMAIN=meu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meu-projeto
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_STORAGE_BUCKET=meu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
```

### 4. Habilitar Authentication no Firebase

1. No Firebase Console, vá em **Authentication**
2. Clique em **Get started**
3. Na aba **Sign-in method**, habilite:
   - **Email/Password**
   - **Google** (adicione o email de suporte do OAuth se necessário)

### 5. Configurar domínios autorizados

1. Em **Authentication** > **Settings** > **Authorized domains**
2. Adicione os domínios onde sua aplicação será executada:
   - `localhost` (já vem por padrão)
   - Seu domínio de produção (ex: `meuapp.com`)

### 6. Configurar Regras de Segurança do Firestore

**IMPORTANTE**: Você precisa configurar as regras de segurança do Firestore para que a aplicação funcione corretamente.

1. No Firebase Console, vá em **Firestore Database** > **Rules**
2. Copie e cole as regras do arquivo `REGRAS_FIRESTORE.md`
3. Clique em **Publish** para publicar as regras

**Sem essas regras, você receberá erros de "permissão negada" ao tentar salvar ou editar dados.**

Consulte o arquivo `REGRAS_FIRESTORE.md` para instruções detalhadas.

### 7. Reiniciar o servidor

Após criar o arquivo `.env.local`, **reinicie o servidor de desenvolvimento**:

```bash
# Pare o servidor (Ctrl+C) e execute novamente:
npm run dev
```

## ⚠️ Importante

- O arquivo `.env.local` está no `.gitignore` e **não será commitado** no Git
- **Nunca** compartilhe suas credenciais do Firebase publicamente
- Use credenciais diferentes para desenvolvimento e produção

## 🔍 Verificando se está funcionando

Após configurar, você deve ver no console do navegador:
- ✅ Sem avisos sobre variáveis de ambiente faltando
- ✅ Sem erros de "invalid-api-key"
- ✅ A tela de login deve funcionar normalmente

## 🆘 Problemas comuns

### Erro: "invalid-api-key"
- Verifique se copiou a API key corretamente
- Certifique-se de que não há espaços extras no arquivo `.env.local`
- Reinicie o servidor após criar/editar o arquivo

### Variáveis não estão sendo lidas
- Certifique-se de que o arquivo se chama exatamente `.env.local` (com o ponto no início)
- O arquivo deve estar na **raiz do projeto** (mesmo nível do `package.json`)
- Reinicie o servidor

### Firebase não inicializa
- Verifique se todas as variáveis estão preenchidas
- Verifique se não há caracteres especiais ou quebras de linha incorretas no arquivo
