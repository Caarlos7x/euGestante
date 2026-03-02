# Análise: Vercel React Best Practices no euGestante

Com base na leitura das regras em `.agents/skills/vercel-react-best-practices/rules/*.md`, segue o que **faz sentido aplicar** neste projeto (Vite + React, sem Next.js).

---

## 1. Regras que NÃO se aplicam (ou só parcialmente)

| Regra | Motivo |
|-------|--------|
| **Server / RSC** (serialization, after(), React.cache(), LRU, Server Actions) | Projeto não usa Next.js nem React Server Components. |
| **Suspense boundaries estratégicos** | Sem RSC; Suspense só para lazy loading. |
| **optimizePackageImports (Next.js)** | É config do Next.js; aqui usamos Vite. |

---

## 2. Regras que fazem sentido aplicar

### 2.1 Imutabilidade: `toSorted()` em vez de `sort()`  
**Arquivo de regra:** `js-tosorted-immutable.md`  
**Impacto:** Médio–alto (evita mutação de estado/arrays e bugs em React).

- **Onde:**  
  - `src/services/appointmentService.ts` – ordenação manual no fallback.  
  - `src/services/bloodPressureService.ts` – ordenação de `records`.  
  - `src/services/dextroService.ts` – ordenação de `records`.  
  - `src/components/MedicationCard/MedicationCard.tsx` – ordenação ao adicionar horário.

- **Ação:** Trocar `.sort()` por `.toSorted()` (ou `[...arr].sort()` se precisar de fallback para ambientes antigos).

---

### 2.2 Functional setState  
**Arquivo de regra:** `rerender-functional-setstate.md`  
**Impacto:** Médio (callbacks estáveis, evita stale closure).

- **Onde:**  
  - `BloodPressureControlCard`: `setRecords([...records, ...])`, `setRecords(records.map(...))`, `setRecords(records.filter(...))`.  
  - `DextroControlCard`: mesmos padrões.  
  - `MedicationCard`: `setNewMedicationTimes(newMedicationTimes.filter(...))` e ao adicionar horário.

- **Ação:** Usar forma funcional: `setRecords(prev => [...prev, newRecord])`, `setRecords(prev => prev.map(...))`, `setRecords(prev => prev.filter(...))`, e equivalente para `setNewMedicationTimes`.

---

### 2.3 Bundle: dynamic imports para componentes pesados  
**Arquivo de regra:** `bundle-dynamic-imports.md`  
**Impacto:** Crítico para TTI/LCP (menos JS no carregamento inicial).

- **Onde:**  
  - `HospitalsMap` (Leaflet + react-leaflet).  
  - `AddAppointmentModal` (usa `AddressAutocomplete` com Google Maps API).

- **Ação:** Carregar esses componentes com `React.lazy()` na página `Home` e envolver em `<Suspense>` com fallback (ex.: spinner ou texto “Carregando…”).

---

### 2.4 Barrel imports (react-icons)  
**Arquivo de regra:** `bundle-barrel-imports.md`  
**Impacto:** Crítico em muitos projetos (200–800 ms de custo de import).

- **Situação atual:** Uso de `react-icons/fa` e `react-icons/hi` (subpaths), não do barrel raiz `react-icons`.  
- **Ação (opcional):** O pacote `react-icons` não expõe arquivos por ícone (apenas um barrel por pacote: `react-icons/fa`, `react-icons/hi`). Não existe path `react-icons/fa/FaHeart`; a regra de imports diretos aplica-se a pacotes como `lucide-react` ou `@mui/material`, que têm um arquivo por ícone. Aqui, manter `import { FaHeart } from 'react-icons/fa'` (já é o subpath do pacote, não o barrel raiz).

---

### 2.5 localStorage / sessionStorage  
**Arquivo de regra:** `client-localstorage-schema.md`  
**Impacto:** Médio (evitar erros em privado/quota, versionar esquema).

- **Onde:**  
  - `src/services/auth.ts` – Firebase e testes de storage.  
  - `src/contexts/AuthContext.tsx` – `sessionStorage` para redirect.

- **Ação:** Garantir `try/catch` em todos os acessos a `localStorage`/`sessionStorage`. Se no futuro houver dados próprios (ex.: preferências), usar chaves versionadas (ex.: `prefs:v1`) e armazenar só o necessário.

---

### 2.6 Inicialização uma vez (Service Worker)  
**Arquivo de regra:** `advanced-init-once.md`  
**Impacto:** Baixo–médio (evitar registro duplo em dev/remount).

- **Onde:** `App.tsx` – `useEffect` que chama `registerServiceWorker()`.  
- **Ação:** Usar guarda em nível de módulo (`let didInit = false`) para executar o registro apenas uma vez por carga da aplicação.

---

### 2.7 Renderização condicional explícita  
**Arquivo de regra:** `rendering-conditional-render.md`  
**Impacto:** Baixo (evita renderizar `0` ou `NaN`).

- **Situação atual:** Uso de `{error && <ErrorMessage />}` e `{loading && ...}`. Como `error` é string e `loading` é boolean, não há risco de mostrar `0`.  
- **Ação:** Manter atenção em qualquer lugar que use `{count && ...}` com `count` numérico; preferir `count > 0 ? ... : null`.

---

## 3. O que foi aplicado neste PR/iteração

- [x] **toSorted()** em `appointmentService`, `bloodPressureService`, `dextroService` e `MedicationCard`.
- [x] **Functional setState** em `BloodPressureControlCard`, `DextroControlCard` e `MedicationCard` (setRecords / setNewMedicationTimes).
- [x] **Lazy load** de `HospitalsMap` e `AddAppointmentModal` na `Home` com `React.lazy` + `Suspense`.
- [x] **localStorage/sessionStorage**: `try/catch` em todos os acessos em `auth.ts` e `AuthContext.tsx`; chave versionada da app para redirect: `eugestante:redirect:v1`.
- [x] **Init once**: guarda `swDidInit` para `registerServiceWorker()` em `App.tsx`.
- **react-icons**: o pacote `react-icons` não expõe arquivos por ícone (apenas barrel por pacote: `react-icons/fa`, `react-icons/hi`). Não há path do tipo `react-icons/fa/FaHeart`; imports diretos por ícone não se aplicam aqui. Manter `import { FaHeart } from 'react-icons/fa'`.

---

## 4. Referência das regras lidas

- `server-serialization.md`, `server-after-nonblocking.md`, `server-auth-actions.md`, `server-cache-lru.md`  
- `rerender-*` (memo, derived-state, functional-setstate, move-effect-to-event, simple-expression-in-memo, transitions, use-ref-transient-values)  
- `bundle-barrel-imports.md`, `bundle-dynamic-imports.md`  
- `client-localstorage-schema.md`, `client-swr-dedup.md`  
- `rendering-conditional-render.md`  
- `js-tosorted-immutable.md`  
- `advanced-init-once.md`

O índice completo e detalhes estão em `.agents/skills/vercel-react-best-practices/AGENTS.md` (e nos arquivos em `rules/`).
