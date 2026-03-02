# Próximos passos com Python funcionando

Agora que `python` funciona no terminal (depois de rodar a linha do PATH), você pode:

---

## 1. Rodar a busca do UI/UX Pro Max (se tiver a pasta `skills/`)

Se em algum momento você rodou na raiz do projeto:

```powershell
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
```

e isso criou a pasta **`skills/ui-ux-pro-max/`** (com `scripts/search.py`), então **no mesmo terminal** onde o `python` está funcionando rode:

```powershell
python skills/ui-ux-pro-max/scripts/search.py "healthcare pregnancy maternal wellness app dashboard" --design-system -p "euGestante" -f markdown
```

Se aparecer erro de arquivo não encontrado, a pasta `skills/` com o script não existe no projeto. Nesse caso, instale a skill na raiz do projeto:

```powershell
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
```

Depois rode de novo o comando `python skills/...` acima.

---

## 2. Usar o sistema de design que já está no projeto

Foi gerado um **design system** manualmente em:

**`design-system/MASTER.md`**

Ele já está alinhado à skill UI/UX Pro Max e ao euGestante (healthcare, gestação, acessibilidade, React). Use esse arquivo como referência ao implementar ou revisar telas.

---

## 3. Em terminais novos no Cursor

Se você **não** recarregar o PATH, em um terminal novo o `python` pode não ser encontrado. Duas opções:

- **Sempre que abrir um novo terminal**, rodar primeiro:
  ```powershell
  $env:Path = [Environment]::GetEnvironmentVariable("Path","User") + ";" + [Environment]::GetEnvironmentVariable("Path","Machine")
  ```
- **Ou** fechar o Cursor por completo e abrir de novo; aí todo terminal novo já terá o `python` no PATH.

---

## 4. Resumo

| O que você quer | O que fazer |
|-----------------|-------------|
| Rodar a busca da skill | Instalar a skill com `npx skills add` (se ainda não tiver a pasta `skills/`), depois rodar o comando `python skills/...` no terminal onde o Python funciona. |
| Consultar regras de design | Abrir **`design-system/MASTER.md`**. |
| Usar `python` em todo terminal | Fechar o Cursor e abrir de novo, ou rodar a linha do PATH em cada terminal novo. |
