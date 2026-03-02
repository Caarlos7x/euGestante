# Web Interface Guidelines — Auditoria euGestante

Revisão conforme [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Formato `file:line`.

---

## index.html

index.html:11 - viewport com `maximum-scale=1.0, user-scalable=no` desativa zoom (anti-pattern acessibilidade)

---

## src/theme/GlobalStyles.ts

src/theme/GlobalStyles.ts:90 - `transition: all` → listar propriedades explicitamente
src/theme/GlobalStyles.ts:99 - input/textarea/select `outline: none` — OK (existe *:focus-visible com outline)

---

## src/components/Button/Button.tsx

src/components/Button/Button.tsx:19 - `transition: all` → listar propriedades (transform, box-shadow, background-color, border-color, etc.)

---

## src/components/Input/Input.tsx

src/components/Input/Input.tsx:46 - `transition: all` → listar propriedades
src/components/Input/Input.tsx:124-127 - Label sem `htmlFor`; input sem `id` — label não associada ao controle

---

## src/components/Modal/Modal.tsx

src/components/Modal/Modal.tsx:121-128 - ModalBody sem `overscroll-behavior: contain` (evitar scroll do fundo em modal)

---

## src/components/AddAppointmentModal/AddAppointmentModal.tsx

src/components/AddAppointmentModal/AddAppointmentModal.tsx:65 - TypeButton `transition: all` → listar propriedades

---

## src/pages/Login/Login.tsx

src/pages/Login/Login.tsx - viewport zoom; transition:all; label/input; loading "…"; modal overscroll; SignUp toggle → button — **corrigido**

---

## src/pages/Home/Home.tsx

src/pages/Home/Home.tsx:206 - "Carregando dicas..." → "Carregando dicas…"
src/pages/Home/Home.tsx:284 - "Carregando mapa..." → "Carregando mapa…"
src/pages/Home/Home.tsx:291 - "Carregando..." → "Carregando…"

---

## src/components/Header/Header.tsx

src/components/Header/Header.tsx:145-147 - LogoImage tem width, height e alt ✓
src/components/Header/Header.tsx:164-171 - DropdownMenu trigger não é só ícone (tem UserName) — aria-expanded no trigger ✓
src/components/Header/Header.tsx:169 - Ação destrutiva "Sair" sem confirmação — considerar modal de confirmação ou undo

---

## src/components/Footer/Footer.tsx

src/components/Footer/Footer.tsx:140-143 - FooterLink usa Link do react-router ✓

---

## src/components/Carousel/Carousel.tsx

src/components/Carousel/Carousel.tsx:263,271 - ArrowButton tem aria-label ✓
src/components/Carousel/Carousel.tsx:301 - Dot tem aria-label ✓

---

## src/components/DropdownMenu/DropdownMenu.tsx

src/components/DropdownMenu/DropdownMenu.tsx:184-188 - MenuItemButton &:focus outline: none — substituído por *:focus-visible global ✓

---

## Resumo

- **Anti-patterns:** viewport zoom desabilitado; vários `transition: all`.
- **Forms:** associar label ao input (htmlFor/id); placeholders com "…"; loading com "…".
- **Modal:** overscroll-behavior: contain.
- **Navegação:** trocar `<a href="#">` + onClick por Link/button no Login.
- **Opcional:** confirmação em "Sair"; aria-hidden em ícone decorativo; Intl para datas onde houver formatação fixa.
