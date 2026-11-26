# dayplus.app

Source of the Day+ website: home, blog, Privacy Policy, Terms of Use and Support.
Built with [Astro](https://astro.build) as a fully static site.

- `npm install` once, then `npm run dev` (live preview) or `npm run build` + `npm run preview`.
- Settings in one place: `src/config.ts` (App Store link, seasonal pill, blog strip).
- Design tokens (colours, spacing, type, desktop grid): `src/styles/tokens.css`.
- Phone images: `tools/make-phones.py` builds `src/assets/phones/` from the app's raw screens.
- The legal pages in `public/privacy/`, `public/terms/`, `public/support/` keep their paths.
- Blog articles: one file each in `src/content/blog/` (see `ARTICLE-GUIDE.md`, in Indonesian).
  Future-dated articles stay hidden until their date; `.github/workflows/deploy.yml` rebuilds every morning.
