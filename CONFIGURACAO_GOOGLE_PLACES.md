# Configuração da Google Places API

Para usar a funcionalidade de busca de endereços (hospitais, clínicas, etc.), você precisa configurar a Google Places API.

## 📋 Passo a Passo

### 1. Criar um Projeto no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a faturação (necessário mesmo para o tier gratuito)

### 2. Habilitar a Places API

1. No Google Cloud Console, vá em **APIs & Services** > **Library**
2. Procure por "Places API"
3. Clique em **Places API** e depois em **Enable** (Habilitar)

### 3. Criar uma API Key

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **API Key**
3. Copie a chave gerada

### 4. Restringir a API Key (Recomendado)

Para segurança, é recomendado restringir a chave:

1. Clique na chave criada para editá-la
2. Em **Application restrictions**, selecione:
   - **HTTP referrers (web sites)** para aplicações web
   - Adicione os domínios permitidos:
     - `localhost:*` (para desenvolvimento)
     - `seu-dominio.com/*` (para produção)
3. Em **API restrictions**, selecione:
   - **Restrict key**
   - Marque apenas **Places API**
4. Clique em **Save**

### 5. Adicionar a Chave ao Projeto

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione a linha:

```env
VITE_GOOGLE_MAPS_API_KEY=sua-chave-api-aqui
```

3. Reinicie o servidor de desenvolvimento

## 💰 Custos

A Google Places API oferece um tier gratuito:

- **$200 de crédito gratuito por mês**
- Isso cobre aproximadamente:
  - 17.000 requisições de Autocomplete
  - 40.000 requisições de Place Details

Para a maioria dos casos de uso, o tier gratuito é suficiente.

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca commite a chave API no código!

- A chave está no arquivo `.env.local` que está no `.gitignore`
- Em produção, configure a chave nas variáveis de ambiente do seu provedor de hospedagem
- Use restrições de API Key para limitar o uso apenas aos domínios permitidos

## 🧪 Testar

Após configurar:

1. Acesse a página Home
2. Clique em "Adicionar" na seção "Próximos Exames / Consultas"
3. No campo "Endereço", comece a digitar um endereço
4. Você deve ver sugestões aparecendo automaticamente

## ❓ Problemas Comuns

### "Google Maps API Key não configurada"

- Verifique se a chave está no arquivo `.env.local`
- Verifique se o arquivo está na raiz do projeto
- Reinicie o servidor de desenvolvimento após adicionar a chave

### "Erro ao buscar endereços"

- Verifique se a Places API está habilitada no Google Cloud Console
- Verifique se a API Key tem permissão para usar a Places API
- Verifique se as restrições de domínio não estão bloqueando o localhost

### "ZERO_RESULTS"

- Isso é normal se não houver resultados para a busca
- Tente com termos mais genéricos ou nomes de lugares conhecidos

## 📚 Documentação

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Places Autocomplete API](https://developers.google.com/maps/documentation/places/web-service/autocomplete)
- [Place Details API](https://developers.google.com/maps/documentation/places/web-service/details)
