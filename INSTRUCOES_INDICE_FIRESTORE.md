# 🔧 Criar Índice no Firestore

O Firestore precisa de um índice composto para fazer queries com `where` e múltiplos `orderBy`.

## 🚀 Solução Rápida (Recomendada)

O próprio erro fornece um link direto para criar o índice. Clique no link que aparece no console:

```
https://console.firebase.google.com/v1/r/project/eugestante/firestore/indexes?create_composite=...
```

Isso abrirá o Firebase Console com o índice pré-configurado. Basta clicar em **Create Index** (Criar Índice).

## 📋 Solução Manual

Se preferir criar manualmente:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Firestore Database** > **Indexes** (Índices)
4. Clique em **Create Index** (Criar Índice)
5. Configure:
   - **Collection ID**: `appointments`
   - **Fields to index**:
     - `userId` - Ascending
     - `date` - Ascending
     - `time` - Ascending
6. Clique em **Create** (Criar)

## ⏱️ Tempo de Criação

- O índice pode levar alguns minutos para ser criado
- Você receberá um email quando estiver pronto
- Enquanto isso, a aplicação funcionará com ordenação manual (já implementada)

## ✅ Verificar se Está Pronto

1. No Firebase Console, vá em **Firestore Database** > **Indexes**
2. Procure pelo índice da coleção `appointments`
3. Quando o status estiver como **Enabled** (Habilitado), está pronto

## 💡 Nota

A aplicação já está preparada para funcionar sem o índice (fazendo ordenação manual), mas o índice melhora a performance para grandes volumes de dados.
