# Análise: better-auth-best-practices vs euGestante

## Conclusão principal

**O projeto euGestante usa Firebase Authentication (e Firestore), não Better Auth.**

A skill [better-auth-best-practices](https://skills.sh/better-auth/skills/better-auth-best-practices) é um guia para integração da biblioteca **Better Auth** ([better-auth.com](https://better-auth.com/docs)) — um framework de autenticação em TypeScript com API própria (`createAuth`, `createAuthClient`, `BETTER_AUTH_SECRET`, adapters Prisma/Drizzle, etc.).  

Como o euGestante não utiliza Better Auth, **as recomendações específicas da skill (variáveis de ambiente Better Auth, CLI, session store, plugins, hooks) não se aplicam** ao projeto. Ou seja: não faz sentido “seguir todas as recomendações” da skill no código atual, porque elas são para outro stack.

---

## O que o projeto usa hoje

| Aspecto | euGestante |
|--------|------------|
| **Auth** | Firebase Auth (`firebase/auth`) |
| **Config** | `src/firebase/config.ts` — variáveis `VITE_FIREBASE_*` |
| **Serviço** | `src/services/auth.ts` — `authService` (signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, etc.) |
| **Estado** | `src/contexts/AuthContext.tsx` — `AuthProvider` + `useAuth()` |
| **Persistência** | Firebase `browserLocalPersistence` |
| **Perfil** | Firestore via `profileService` |

Nenhum uso de `better-auth`, `createAuth`, `createAuthClient` ou `BETTER_AUTH_*` no código.

---

## Boas práticas equivalentes (espírito da skill) vs projeto

Comparação em termos de “boas práticas de autenticação” em geral, e como o projeto se sai com **Firebase**.

| Boas práticas (geral) | Projeto (Firebase) |
|------------------------|---------------------|
| **Credenciais em variáveis de ambiente** | ✅ Uso de `VITE_FIREBASE_*` em `.env.local`; `env.example.txt` documenta. |
| **Não commitar secrets** | ✅ `.env.local` tipicamente no `.gitignore`; exemplo sem valores reais. |
| **Verificação de config antes de usar auth** | ✅ `isFirebaseConfigured()` e `checkFirebaseConfig()` antes de chamadas. |
| **Tratamento de erros com mensagens amigáveis** | ✅ `getAuthErrorMessage()` mapeia códigos do Firebase para mensagens em português. |
| **Persistência de sessão explícita** | ✅ `setPersistence(auth, browserLocalPersistence)` em `config.ts`. |
| **Chave de redirect versionada** | ✅ `eugestante:redirect:v1` em `sessionStorage` com try/catch. |
| **Proteção de rotas** | ✅ `ProtectedRoute` e uso de `user`/`loading` no contexto. |
| **Reautenticação antes de trocar email/senha** | ✅ `reauthenticateWithCredential` em `updateUserService`. |
| **Uso de storage com try/catch** | ✅ Uso de `sessionStorage`/`localStorage` com try/catch onde aplicável. |

Nada disso vem da skill Better Auth; são práticas que o projeto já segue no contexto Firebase.

---

## Quando a skill seria aplicável

A skill **better-auth-best-practices** seria aplicável se o projeto:

- Migrasse para **Better Auth** (substituindo Firebase Auth por Better Auth no backend e usando o client Better Auth no front), ou
- Adotasse Better Auth em um **novo serviço/API** (por exemplo, um backend Node com Better Auth) e mantivesse o app atual apenas como cliente desse backend.

Enquanto a autenticação for 100% Firebase Auth + Firestore, as recomendações da skill continuam sendo **para outro produto** e não há como “seguir todas” no euGestante sem mudar de stack.

---

## Resumo

- **Skill:** guia para projetos que usam a biblioteca **Better Auth**.
- **Projeto:** usa **Firebase Authentication** (e Firestore).
- **Conclusão:** as recomendações da skill não se aplicam ao código atual; o projeto já segue boas práticas compatíveis com o uso de Firebase (env, verificação de config, tratamento de erros, persistência, proteção de rotas, reautenticação).

Se no futuro você considerar migrar para Better Auth (por exemplo, em um backend próprio), aí sim a skill e a [documentação Better Auth](https://better-auth.com/docs) passam a ser a referência direta.
