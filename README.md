# Planta Imóveis — site em Next.js para o GitHub Pages

Site de imobiliária com hero cinematográfico (Three.js + GSAP), vitrine de imóveis guiada pela rolagem, serviços, etapas, formulário de orçamento que abre o WhatsApp, contato e redes sociais. Exportado como site estático para o GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie este projeto para a branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Site Planta Imóveis"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
   git push -u origin main
   ```
2. No repositório, abra **Settings → Pages** e em **Build and deployment → Source** escolha **GitHub Actions**.
3. Pronto. A cada push na `main`, o workflow `.github/workflows/deploy.yml` gera o site e publica em
   `https://SEU-USUARIO.github.io/NOME-DO-REPO/`. Acompanhe na aba **Actions**.

O caminho do site (`/NOME-DO-REPO`) e o endereço usado no SEO são configurados automaticamente pelo workflow. Funciona também com repositório `SEU-USUARIO.github.io` e com domínio próprio (Settings → Pages → Custom domain).

## Rodar no computador

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gera o site estático na pasta out/
npm run preview    # serve a pasta out/
```

## Configuração (.env)

| Variável | Para que serve |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Endereço do site. No GitHub Pages é preenchido automaticamente |
| `NEXT_PUBLIC_SEO_TITLE` | Título no Google e na aba do navegador |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | Descrição no Google e ao compartilhar o link |
| `NEXT_PUBLIC_PHONE` | Telefone com 55 + DDD, só números. Usado para ligar, no WhatsApp e no formulário |

O `.env` tem só dados públicos e vai junto para o GitHub, porque o build do Pages usa esse arquivo. Não coloque senhas nele.

## Onde editar

- **Textos do site:** `lib/content.ts`
- **Dados da empresa (nome, e-mail, endereço, horários, CRECI, redes sociais):** `lib/site.ts`
- **Imóveis:** `data/listings.ts`
- **Fotos:** `public/assets` (hero) e `public/assets/imoveis` (vitrine)
- **Cores, fontes e espaçamentos:** `app/globals.css`
- **Animação do hero:** `lib/hero.ts`
- **Animações das seções:** `components/ScrollFx.tsx` e `components/Listings.tsx`

## Formulário de orçamento

O GitHub Pages só hospeda arquivos estáticos, sem servidor. Por isso o formulário valida os dados no navegador e abre o WhatsApp do número do `.env` com a mensagem pronta.

## Créditos

Fotos: [Unsplash](https://unsplash.com/license). Fonte: Archivo (servida localmente via `@fontsource-variable/archivo`).
