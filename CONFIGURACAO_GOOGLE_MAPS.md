# 🗺️ Configuração do Google Maps

Para que o mapa de hospitais e maternidades funcione corretamente, você precisa configurar a chave da API do Google Maps.

## 📋 Passo a Passo

### 1. Criar projeto no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Crie um novo projeto ou selecione um projeto existente
4. Aguarde alguns segundos para o projeto ser criado

### 2. Ativar as APIs necessárias

1. No menu lateral, vá em **APIs & Services** > **Library**
2. Procure e ative as seguintes APIs:
   - **Maps JavaScript API** - Para exibir o mapa
   - **Places API** - Para buscar hospitais e maternidades próximos

### 3. Criar uma chave de API (API Key)

1. No menu lateral, vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **API Key**
3. Uma chave será gerada automaticamente
4. **IMPORTANTE**: Clique em **RESTRICT KEY** para configurar restrições de segurança:
   - **Application restrictions**: Selecione **HTTP referrers (web sites)**
   - Adicione os domínios permitidos:
     - `localhost:*` (para desenvolvimento)
     - Seu domínio de produção (ex: `https://meuapp.com/*`)
   - **API restrictions**: Selecione **Restrict key**
   - Marque apenas: **Maps JavaScript API** e **Places API**
5. Clique em **SAVE**

### 4. Configurar no projeto

1. Na raiz do projeto, abra ou crie o arquivo `.env.local`
2. Adicione a seguinte linha:

```env
VITE_GOOGLE_MAPS_API_KEY=sua-chave-de-api-aqui
```

**Substitua** `sua-chave-de-api-aqui` pela chave que você copiou do Google Cloud Console.

### 5. Exemplo de arquivo `.env.local`

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvw
VITE_FIREBASE_AUTH_DOMAIN=meu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meu-projeto
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_STORAGE_BUCKET=meu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### 6. Reiniciar o servidor

Após adicionar a chave no arquivo `.env.local`, **reinicie o servidor de desenvolvimento**:

```bash
# Pare o servidor (Ctrl + C) e inicie novamente
npm run dev
```

### 7. Verificar se está funcionando

1. Acesse a página Home (`/home`)
2. Role até a seção "Hospitais e Maternidades Próximos"
3. O mapa deve carregar e mostrar sua localização
4. Os hospitais e maternidades próximos devem aparecer como marcadores vermelhos no mapa

## ⚠️ Importante

- **Nunca** commite o arquivo `.env.local` no Git (ele já está no `.gitignore`)
- Mantenha sua chave de API segura e não a compartilhe publicamente
- Configure as restrições de API para evitar uso não autorizado
- O Google Maps tem limites de uso gratuitos. Consulte a [documentação de preços](https://cloud.google.com/maps-platform/pricing)

## 🔗 Links Úteis

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentação do Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Documentação do Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Preços do Google Maps Platform](https://cloud.google.com/maps-platform/pricing)
