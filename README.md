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

Prefile is a **zero-backend file preview tool** that runs entirely in the browser. Paste content or point to any public URL — Prefile generates a shareable link that renders a beautiful preview on the other end. No server, no database, no signup.

Host it once on GitHub Pages and use it forever as your personal file-sharing utility.

## Why Prefile?

Sending a raw Markdown file over Slack or email is ugly. Pasting it into a pastebin loses formatting. Setting up a dedicated preview server is overkill.

Prefile solves this by encoding your content directly into the URL (base64) or pointing to an existing raw file — so the link itself _is_ the content. Anyone who opens it gets a clean, rendered preview instantly.

**Perfect for:**
- Sharing formatted docs, changelogs, or proposals with people who don't have access to your repo
- Previewing a README or wiki page before publishing
- Sending a formatted Markdown document via chat or email without any attachment
- Quickly rendering any raw file from GitHub, a CDN, or a public API

## How It Works

```
┌──────────────┐        shareable link         ┌─────────────────┐
│  Your file   │  ──────────────────────────►  │  Prefile viewer │
│  (or paste)  │   /{type}/?url=…  or           │  (browser-only) │
└──────────────┘   /{type}/?base64=…            └─────────────────┘
```

1. **Paste** your content into the generator, or provide a **public URL** to any raw file
2. Prefile generates a shareable link — either a `?base64=` encoded link or a `?url=` pointer
3. Anyone who opens the link gets a fully rendered, read-only preview

No data is stored anywhere. Everything happens in the browser.

## URL Scheme

```
/{type}/?url=https://example.com/file.md
/{type}/?base64=SGVsbG8gV29ybGQ...
```

### Examples

```bash
# Preview a raw GitHub README
/md/?url=https://raw.githubusercontent.com/user/repo/main/README.md

# Preview inline content (base64-encoded)
/md/?base64=IyBIZWxsbyBXb3JsZAoKVGhpcyBpcyBhIHRlc3Qu

# Preview any public Markdown file
/md/?url=https://example.com/llm.txt
```

### Supported types

| Type | Path | Status |
|------|------|--------|
| Markdown | `/md/` | ✅ Available |
| Images | `/img/` | 🔜 Planned |
| DOCX | `/docx/` | 🔜 Planned |
| HTML | `/html/` | 🔜 Planned |

## Features

- **URL mode** — Point to any publicly accessible raw file
- **Base64 mode** — Encode content directly into the link — no file hosting needed
- **Download** — Let viewers download the original source file
- **Copy source** — Copy the raw content to clipboard with one click
- **Share** — Copy the shareable preview link instantly
- **Proxy images** — Toggle in the Markdown viewer to route images through a CORS proxy when blocked
- **No backend** — 100% client-side, zero config, works on GitHub Pages
- **Auto base URL detection** — Works on any host or subpath without configuration

## CORS & Proxy Support

Some servers block direct browser requests due to missing `Access-Control-Allow-Origin` headers. Prefile handles this in two ways:

**For file fetching** — the link generator produces two additional proxy variants alongside the direct link:

| Proxy | URL | Notes |
|-------|-----|-------|
| codetabs | `api.codetabs.com/v1/proxy` | Returns raw text content, free, no key |
| allorigins | `api.allorigins.win/raw` | Alternative fallback, free, no key |

**For images** — the Markdown viewer has a **"Proxy images"** toggle in the toolbar. When enabled, all `<img>` tags are routed through [`wsrv.nl`](https://wsrv.nl) — a purpose-built image proxy/CDN that returns proper binary data, completely free.

> Proxies are always **opt-in**. The direct link is generated first; proxy variants are offered as alternatives.

## Local Development

```bash
# Any static file server works
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:3000` (or whatever port is shown).

## Deploy to GitHub Pages

1. Fork or clone this repository
2. Push to a GitHub repository
3. Go to **Settings → Pages → Source: Deploy from a branch** → select `main`, root `/`
4. Your instance will be live at `https://<user>.github.io/<repo>/`

> The base URL is detected automatically from `window.location` — no configuration needed, even for subpath deployments.

## Project Structure

```
prefile/
├── index.html        # Landing page & link generator
├── icon.svg          # App icon
├── css/
│   └── style.css     # Shared styles (dark theme, indigo accent)
├── js/
│   └── common.js     # Shared utilities (URL building, fetch, header)
└── md/
    └── index.html    # Markdown viewer
```

## License

MIT
