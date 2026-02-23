# ⚠️ IMPORTANTE: Atualizar Regras do Firestore

O erro "Missing or insufficient permissions" ocorre porque as regras do Firestore precisam ser atualizadas para incluir a coleção `appointments`.

## 🔧 Como Corrigir

### 1. Acesse o Firebase Console

1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Rules** (Regras)

### 2. Copie e Cole as Regras Completas

Copie TODO o conteúdo do arquivo `REGRAS_FIRESTORE_ATUALIZADAS.txt` e cole no editor de regras do Firebase Console.

**OU** copie as regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function para verificar se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function para verificar se o usuário é o dono do documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Coleção: userProfiles
    match /userProfiles/{profileId} {
      allow read: if isOwner(profileId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Coleção: dextroRecords
    match /dextroRecords/{recordId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Coleção: bloodPressureRecords
    match /bloodPressureRecords/{recordId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Coleção: medications
    match /medications/{medicationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Coleção: appointments (NOVA - ADICIONAR ESTA SEÇÃO)
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Negar acesso a todas as outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Publicar as Regras

1. Após colar as regras, clique em **Publish** (Publicar)
2. Aguarde a confirmação de que as regras foram publicadas
3. As regras são aplicadas imediatamente (pode levar alguns segundos)

### 4. Verificar se Funcionou

1. Recarregue a página da aplicação
2. O erro "Missing or insufficient permissions" deve desaparecer
3. Você deve conseguir ver e adicionar exames/consultas

## 📝 Nota Importante

A regra de `read` para `appointments` usa:
```javascript
allow read: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid);
```

Isso permite:
- Queries que filtram por `userId` (quando `resource == null` durante a query)
- Leitura de documentos específicos quando o `userId` corresponde ao usuário autenticado

## ❓ Se Ainda Não Funcionar

1. Verifique se você está autenticado (faça login novamente)
2. Verifique se as regras foram publicadas corretamente (sem erros de sintaxe)
3. Aguarde alguns segundos para as regras serem propagadas
4. Limpe o cache do navegador e recarregue a página
