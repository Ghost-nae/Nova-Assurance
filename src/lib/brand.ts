// @polsia:user-owned — brand identity. Edit freely. `site.ts` re-exports
// siteName/siteDescription; `manifest.ts` + `opengraph-image.tsx` read `brandVisual`.

export const siteName = 'TraceKestrel Assurance';
export const siteDescription =
  'Catch broken customer journeys before customers do. Managed WhatsApp and CRM workflow assurance for agencies in South Africa.';

// PWA + social-share colors. HEX only (CSS variables aren't readable here) — set
// them to match the theme you define in src/app/brand-theme.css. The starter
// values are achromatic placeholders, not a palette.
export const brandVisual = {
  /** PWA browser-UI / status-bar color — usually your background or primary. */
  themeColor: '#143d38',
  /** PWA splash + install background. */
  backgroundColor: '#eaf3eb',
  /** Social-share (OG/Twitter) image. */
  og: {
    background: '#143d38',
    foreground: '#f4f3e9',
    /** Second line under the site name; '' hides it. */
    tagline: 'Catch broken customer journeys before customers do.',
    /** Optional https PNG/JPEG background photo; '' keeps the plain-color card. */
    image: '',
  },
} as const;
