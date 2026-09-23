# Alen Omarbayev — Portfolio SPA

A self-promotional single-page React application built for a university
homework assignment: name, photo, About Me, skills, and a privacy-safe
contact section.

Built with React + Vite, deployed with GitHub Pages.

**GitHub repository:** https://github.com/alen-omarbayev/react-autumn
**Live app:** https://alen-omarbayev.github.io/react-autumn/

## Components

- `Navbar` — sticky nav with anchor links
- `Hero` — name, role, photo, short intro, "Contact Me" / "View My GitHub" buttons
- `About` — KBTU / Computing Technology & Software bio, LG Kazakhstan role
- `Skills` — skill chips (React, JavaScript, TypeScript, Python, C++, Swift, SQL, Git)
- `Contact` — GitHub, LinkedIn, Instagram, and a safe location — no phone,
  address, or personal email
- `Footer`

## Run locally

```bash
npm install
npm run dev
```

Opens on http://localhost:5173 by default.

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

```bash
npm install       # first time only
npm run deploy
```

`npm run deploy` builds the app (via the `predeploy` script) and pushes the
`dist/` folder to the `gh-pages` branch of this repo using the `gh-pages`
npm package. GitHub Pages is configured (Settings → Pages) to serve from
that branch. The first time you deploy, check Settings → Pages — GitHub
usually auto-detects the new `gh-pages` branch, but if it still shows
"None," set Source to the `gh-pages` branch, `/ (root)`, and save.

### If you rename the repository

Update exactly two places to match the new repo name:

- `vite.config.js` → `base: '/your-new-repo-name/'`
- `package.json` → `"homepage": "https://alen-omarbayev.github.io/your-new-repo-name/"`

## Notes

- The current avatar (`src/assets/avatar-placeholder.svg`) is a placeholder
  initials graphic, not a real photo. Swap it for a professional picture by
  replacing the import in `src/components/Hero.jsx`.
- The Contact section uses placeholder LinkedIn/Instagram links — replace
  them in `src/components/Contact.jsx` with your real profiles. No phone
  number, home address, or personal email is included anywhere.
