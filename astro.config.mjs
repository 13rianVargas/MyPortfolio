// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://13rian-vargas.vercel.app",

  // Fully static. The contact form posts straight to FormSubmit from the
  // browser: routing it through a server function looked better on paper, but
  // FormSubmit sits behind Cloudflare and answers datacenter IPs with a 403
  // challenge, so the endpoint could never deliver from Vercel. Web3Forms
  // refuses server-side calls on its free tier for the same class of reason.
  output: "static",

  integrations: [sitemap()],

  devToolbar: { enabled: false },

  // NOTE: no `i18n` block on purpose. Translation is client-side (see
  // src/i18n/), there are no localized routes, and the previous config
  // (locales ["es","en"], defaultLocale "es") contradicted ui.ts
  // (4 languages, defaultLang "en") while being unused.
});
