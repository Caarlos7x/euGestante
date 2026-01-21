# euGestante backend (Vercel + Firebase)

## Requisitos
- Node 18
- Projeto Firebase com Auth e Firestore ativos

## Variaveis de ambiente (Vercel)
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

## Endpoints
- GET /api/health
- GET/POST /api/profile
- GET/POST /api/records?type=peso|glicemia|pressao
- GET/POST /api/consultas
- GET/POST /api/exames
- GET/POST /api/alertas
- GET/POST /api/lembretes

## Autenticacao
Envie o token do Firebase Auth no header:
Authorization: Bearer <idToken>

## Observacoes
- Login com Google e Apple fica no frontend usando Firebase Auth.
- O backend valida o token e salva os dados no Firestore.
