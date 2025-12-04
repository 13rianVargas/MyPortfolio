// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
    i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
  }
});
