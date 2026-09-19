import { defineConfig, type Plugin } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Lets every page share one header / footer / CTA:  <!-- @include partials/header.html -->
const htmlInclude = (): Plugin => ({
  name: "html-include",
  transformIndexHtml: {
    order: "pre",
    handler: (html) =>
      html.replace(/<!--\s*@include\s+(\S+)\s*-->/g, (_, file: string) => readFileSync(resolve(__dirname, file), "utf8")),
  },
  handleHotUpdate({ file, server }) {
    if (file.includes("/partials/")) server.ws.send({ type: "full-reload" });
  },
});

export default defineConfig({
  base: "/",
  publicDir: "public",
  plugins: [htmlInclude()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        partners: resolve(__dirname, "partners/index.html"),
        stores: resolve(__dirname, "stores/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        privacy: resolve(__dirname, "privacy-policy/index.html"),
        terms: resolve(__dirname, "terms-conditions/index.html"),
        shipping: resolve(__dirname, "shipping-policy/index.html"),
        refund: resolve(__dirname, "refund-policy/index.html"),
        googleHtml: resolve(__dirname, "google7694cf04bb5ce287.html"),
      },
    },
    // Copy public assets to dist
    copyPublicDir: true,
    assetsDir: "assets",
  },
});
