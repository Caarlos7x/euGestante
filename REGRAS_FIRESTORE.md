# 🔒 Regras de Segurança do Firestore

Para que a aplicação funcione corretamente, você precisa configurar as regras de segurança do Firestore no Firebase Console.

## 📋 Como Configurar

### 1. Acessar as Regras do Firestore

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Rules** (Regras)

### 2. Copiar e Colar as Regras

Substitua as regras existentes pelas regras abaixo:

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
    
    // Coleção: appointments
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
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

## 🔍 Explicação das Regras

### Coleções Protegidas

As regras acima protegem as seguintes coleções:

1. **userProfiles**: Perfis de usuários
2. **dextroRecords**: Registros de controle de dextro
3. **bloodPressureRecords**: Registros de pressão arterial
4. **medications**: Medicamentos cadastrados
5. **appointments**: Exames e consultas agendadas

### Permissões

Para cada coleção, as regras permitem:

- **read**: Usuário autenticado pode ler apenas seus próprios documentos
- **create**: Usuário autenticado pode criar documentos apenas com seu próprio `userId`
- **update**: Usuário autenticado pode atualizar apenas seus próprios documentos
- **delete**: Usuário autenticado pode deletar apenas seus próprios documentos

### Segurança

- ✅ Apenas usuários autenticados podem acessar os dados
- ✅ Usuários só podem acessar seus próprios dados (verificado pelo campo `userId`)
- ✅ Todas as outras coleções são bloqueadas por padrão
- ✅ Validação de que o `userId` no documento corresponde ao `uid` do usuário autenticado

## ⚠️ Importante

**NUNCA** use regras permissivas em produção como:

```javascript
// ❌ NÃO FAÇA ISSO EM PRODUÇÃO
allow read, write: if true;
```

Isso permitiria que qualquer pessoa acesse e modifique todos os dados do banco!

## 🧪 Testar as Regras

Após configurar as regras, você pode testá-las:

1. No Firebase Console, vá em **Firestore Database** > **Rules**
2. Clique em **Rules Playground** (Simulador de Regras)
3. Teste diferentes cenários:
   - Usuário autenticado tentando ler seus próprios dados
   - Usuário autenticado tentando ler dados de outro usuário
   - Usuário não autenticado tentando acessar dados

## 📝 Notas

- As regras são aplicadas imediatamente após a publicação
- Mudanças nas regras podem levar alguns segundos para serem propagadas
- Sempre teste as regras antes de usar em produção
- Mantenha backups das regras em um arquivo de controle de versão
