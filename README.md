<div align="center">
  <img src="./icon.svg" alt="Prefile Icon" width="80" height="80" />

  # Prefile

  **Share & preview files with a single link — no backend required.**

  [![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](LICENSE)
  [![Static](https://img.shields.io/badge/backend-client--side-8b5cf6.svg)](#)
  [![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-6366f1.svg)](https://pages.github.com/)
  [![Markdown](https://img.shields.io/badge/format-Markdown-8b5cf6.svg)](#supported-types)

</div>

---

Prefile is a lightweight, static-only file previewer that runs entirely in the browser. Host it on GitHub Pages and share rendered previews of Markdown files (more formats coming soon) via URL or base64-encoded content.

## URL Scheme

```
/{type}/?url=https://example.com/file.md
/{type}/?base64=SGVsbG8gV29ybGQ...
```

### Supported types

| Type | Path | Status |
|------|------|--------|
| Markdown | `/md/` | ✅ Available |
| Images | `/img/` | 🔜 Planned |
| DOCX | `/docx/` | 🔜 Planned |
| HTML | `/html/` | 🔜 Planned |

## Features

- **URL mode** — Provide a public URL to any raw file
- **Base64 mode** — Encode content directly into the link (no hosting needed)
- **Download** — Download the original source file
- **Copy source** — Copy the raw content to clipboard
- **Share** — Copy the shareable preview link
- **No backend** — 100% client-side, works on GitHub Pages

## Local Development

```bash
# Any static file server works
npx serve .
# or
python3 -m http.server 8080
```

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push this folder as the repo root
3. Go to **Settings → Pages → Source: Deploy from a branch** (main, root)
4. Your site will be live at `https://<user>.github.io/<repo>/`

> **Note:** The base URL is detected automatically from `window.location` — no configuration needed for subpath deployments.

## License

MIT
