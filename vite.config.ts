import { defineConfig, type Connect, type Plugin } from "vite";
import { existsSync, readFileSync } from "node:fs";
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

// Serve /about like /about/ locally, as Vercel does (Vite only looks for about.html)
const cleanUrls = (): Plugin => {
  const rewrite =
    (root: string): Connect.NextHandleFunction =>
    (req, _res, next) => {
      const [path, query = ""] = (req.url ?? "").split("?");
      if (path !== "/" && !path.endsWith("/") && !path.includes(".") && existsSync(resolve(root, `.${path}/index.html`)))
        req.url = `${path}/${query && `?${query}`}`;
      next();
    };
  return {
    name: "clean-urls",
    configureServer: (server) => void server.middlewares.use(rewrite(__dirname)),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite(resolve(__dirname, "dist"))),
  };
};

export default defineConfig({
  base: "/",
  publicDir: "public",
  plugins: [htmlInclude(), cleanUrls()],
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
        aaharank: resolve(__dirname, "aaharank/index.html"),
        googleHtml: resolve(__dirname, "google7694cf04bb5ce287.html"),
      },
    },
    // Copy public assets to dist
    copyPublicDir: true,
    assetsDir: "assets",
  },
});
