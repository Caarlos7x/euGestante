# UI/UX Pro Max – uso no euGestante

Este guia adapta o fluxo da skill [ui-ux-pro-max](https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max) para o projeto **euGestante** (app de acompanhamento da gestação).

---

## 1. Onde está a skill

- A skill está registrada em `skills-lock.json` (fonte: `nextlevelbuilder/ui-ux-pro-max-skill`).
- O conteúdo da skill (incluindo o script Python) fica em `.agents/skills/ui-ux-pro-max/`; os scripts podem estar em outro caminho dependendo de como o `npx skills add` instalou (por exemplo uma pasta `skills/` na raiz do projeto ou em diretório global).

**Se o script não existir no projeto**, instale a skill na raiz do repositório:

```bash
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
```

Isso costuma criar algo como `skills/ui-ux-pro-max/` com `scripts/search.py` e `data/`.

**Pré-requisito:** Python 3 instalado.

No Windows, depois de instalar pelo site ou pelo winget, o comando `python` pode abrir a Microsoft Store em vez do Python instalado. Use uma das opções abaixo.

**Opção A – Usar o caminho completo do Python (funciona na hora)**

Se o Python 3.12 está em `%LOCALAPPDATA%\Programs\Python\Python312\`:

```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system -p "euGestante" -f markdown
```

**Opção B – Desativar o atalho da Microsoft Store (para `python` funcionar sempre)**

1. Abra **Configurações** (Win + I) → **Apps** → **Apps avançados** → **Aliases de execução de aplicativos**.
2. Desative **python.exe** e **python3.exe** (deixar OFF).
3. Feche e abra de novo o terminal. O comando `python` passará a usar o Python instalado.

Depois disso:

```powershell
python --version
# ou
python3 --version
```

Se não tiver Python: [Windows – winget install Python.Python.3.12](https://docs.python.org/3/using/windows.html).

**Opção C – "python não é reconhecido" depois de desativar os aliases**

Se você desativou os aliases e mesmo assim o terminal diz que `python` não é reconhecido, o Python não está no PATH. Na raiz do projeto existe o script `add-python-to-path.ps1`. Rode **uma vez**:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\add-python-to-path.ps1
```

Depois **feche e abra um novo terminal** (ou reinicie o Cursor) e teste: `python --version`.

---

## 2. Análise para o euGestante

| Campo           | Valor para o euGestante |
|----------------|-------------------------|
| **Tipo de produto** | App mobile-first / dashboard (acompanhamento gestação) |
| **Setor**       | Saúde (healthcare, maternal) |
| **Palavras-chave** | gestação, maternal, saúde, limpo, profissional, confiável, acolhedor |
| **Stack**       | **React** (Vite + React + styled-components) |

---

## 3. Etapa 2 – Gerar sistema de design (obrigatório)

Sempre comece com `--design-system` para obter padrão, estilo, cores, tipografia e antipadrões.

**Na raiz do projeto** (onde existir a pasta `skills/` ou o caminho do script):

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system -p "euGestante"
```

Ou, se o script estiver em `.agents/skills/ui-ux-pro-max/` (e houver `scripts/search.py`):

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system -p "euGestante"
```

**Em português (se a skill aceitar):**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "saúde gestação maternal acompanhamento app" --design-system -p "euGestante"
```

**Saída em Markdown** (para documentação):

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app" --design-system -p "euGestante" -f markdown
```

---

## 4. Etapa 2b – Persistir sistema de design (opcional)

Para salvar o sistema em `design-system/MASTER.md` e usar em outras sessões:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system --persist -p "euGestante"
```

Isso cria:

- `design-system/MASTER.md` – regras globais de design
- `design-system/pages/` – para overrides por página

**Override por página** (ex.: home, perfil, notas):

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy dashboard" --design-system --persist -p "euGestante" --page "home"
```

Uso ao implementar uma tela: ler `design-system/MASTER.md` e, se existir, `design-system/pages/<nome-da-pagina>.md`, e priorizar as regras da página.

---

## 5. Etapa 3 – Buscas complementares (quando precisar)

| Objetivo              | Domínio       | Exemplo de comando |
|-----------------------|--------------|------------------------------------|
| Acessibilidade        | `ux`         | `--domain ux "accessibility touch mobile"` |
| Animações e loading   | `ux`         | `--domain ux "animation loading"` |
| Cores para saúde      | `color`      | `--domain color "healthcare wellness"` |
| Tipografia            | `typography` | `--domain typography "clean readable professional"` |
| Estrutura de telas    | `landing`    | `--domain landing "hero dashboard"` |

Exemplo:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "accessibility touch mobile" --domain ux
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare wellness" --domain color
```

---

## 6. Etapa 4 – Diretrizes da stack React

O euGestante usa **React** (Vite + styled-components), não Next.js. Use o stack `react`:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "dashboard form layout responsive" --stack react
```

Stacks disponíveis: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`.

---

## 7. Resumo rápido – comandos para copiar e colar

**1) Sistema de design (obrigatório):**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system -p "euGestante" -f markdown
```

**2) Persistir para uso contínuo:**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system --persist -p "euGestante"
```

**3) UX (acessibilidade + mobile):**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "accessibility touch mobile" --domain ux
```

**4) Stack React:**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "form layout responsive" --stack react
```

---

## 8. Referência da skill

- **Página da skill:** [skills.sh – ui-ux-pro-max](https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max)
- **Instalação:** `npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max`
- **SKILL.md local:** `.agents/skills/ui-ux-pro-max/SKILL.md`

Prioridades da skill: (1) Acessibilidade, (2) Toque e interação, (3) Performance, (4) Layout responsivo, (5) Tipografia e cor, (6) Animação, (7) Estilo, (8) Gráficos/dados.
