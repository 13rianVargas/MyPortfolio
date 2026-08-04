// @ts-check
import { defineConfig, envField } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://13rian-vargas.vercel.app",

  // Static by default. Only src/pages/api/contact.ts opts out via
  // `export const prerender = false`, so it runs as a Vercel function and can
  // hold WEB3FORMS_KEY server-side instead of shipping it to the browser.
  output: "static",
  adapter: vercel(),

  integrations: [sitemap()],

  // access: "secret" means Astro reads this at RUNTIME on the server and never
  // inlines the value into any bundle — client or server. Set the same name in
  // Vercel (Settings -> Environment Variables), with no PUBLIC_ prefix.
  //
  // Keeping the destination address here rather than in the markup is the whole
  // point: previously it sat in the client JS as a plain string.
  env: {
    schema: {
      CONTACT_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  devToolbar: { enabled: false },

  // NOTE: no `i18n` block on purpose. Translation is client-side (see
  // src/i18n/), there are no localized routes, and the previous config
  // (locales ["es","en"], defaultLocale "es") contradicted ui.ts
  // (4 languages, defaultLang "en") while being unused.
});
