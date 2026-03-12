/* ============================================
   Prefile — Common Utilities
   ============================================ */

const Peekfile = (() => {
  const SITE_NAME = 'Prefile';

  // Supported file types and their config
  const FILE_TYPES = {
    md: { label: 'Markdown', extension: '.md', mime: 'text/markdown' },
    // Future types:
    // img: { label: 'Image', extension: null, mime: null },
    // docx: { label: 'Word Document', extension: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    // html: { label: 'HTML', extension: '.html', mime: 'text/html' },
    // json: { label: 'JSON', extension: '.json', mime: 'application/json' },
  };

  /**
   * Encode string content to URL-safe base64
   */
  function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Decode URL-safe base64 to string
   */
  function decodeBase64(encoded) {
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    // Re-pad
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  /**
   * Get base URL dynamically from the current window location.
   * Works for local dev, GitHub Pages, and any other host/subpath.
   * Strips known viewer subpaths so we always resolve to the site root.
   */
  function getBaseUrl() {
    const knownSubpaths = ['/md/', '/img/', '/docx/', '/html/'];
    let path = window.location.pathname.replace(/\/+$/, '');
    for (const sub of knownSubpaths) {
      const idx = path.lastIndexOf(sub.slice(0, -1));
      if (idx !== -1) {
        path = path.slice(0, idx);
        break;
      }
    }
    return window.location.origin + path;
  }

  /**
   * Build a shareable link
   * @param {string} type - File type (e.g., 'md')
   * @param {'url'|'base64'} mode - Link mode
   * @param {string} value - URL or content
   * @returns {string} Full shareable URL
   */
  function buildLink(type, mode, value) {
    const base = getBaseUrl();
    const param = mode === 'url'
      ? `url=${encodeURIComponent(value)}`
      : `base64=${encodeBase64(value)}`;
    return `${base}/${type}/?${param}`;
  }

  /**
   * Parse current page's query parameters
   * @returns {{ mode: 'url'|'base64'|null, value: string|null }}
   */
  function parseParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('url')) {
      return { mode: 'url', value: params.get('url') };
    }
    if (params.has('base64')) {
      return { mode: 'base64', value: params.get('base64') };
    }
    return { mode: null, value: null };
  }

  /**
   * Fetch content based on parsed params
   * @returns {Promise<string>} The raw content
   */
  async function fetchContent() {
    const { mode, value } = parseParams();

    if (!mode || !value) {
      throw new Error('No content specified. Use ?url= or ?base64= parameter.');
    }

    if (mode === 'base64') {
      return decodeBase64(value);
    }

    // URL mode — fetch the file
    const response = await fetch(value);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  /**
   * Download content as a file
   */
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy text to clipboard
   */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    }
  }

  /**
   * Show a toast notification
   */
  function showToast(message, duration = 2000) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), duration);
  }

  /**
   * Render the standard header
   */
  function renderHeader(showShareButton = false) {
    const base = getBaseUrl();
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
      <a href="${base}/" class="header-logo">
        <span class="logo-icon"><img src="${base}/icon.svg" width="28" height="28" alt="Prefile"></span>
        <span>${SITE_NAME}</span>
      </a>
      <div class="header-actions">
        ${showShareButton ? `<a href="${base}/" class="btn btn-primary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Share your files
        </a>` : ''}
      </div>
    `;
    document.body.prepend(header);
  }

  return {
    SITE_NAME,
    FILE_TYPES,
    encodeBase64,
    decodeBase64,
    getBaseUrl,
    buildLink,
    parseParams,
    fetchContent,
    downloadFile,
    copyToClipboard,
    showToast,
    renderHeader,
  };
})();
