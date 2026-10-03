import { defineConfig, type Connect, type Plugin } from "vite";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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

// Every index.html outside these folders is a page, so new pages need no config change
const notPages = new Set(["node_modules", "dist", "public", "src", "partials", "scripts"]);
const findPages = (dir: string, prefix = ""): Record<string, string> =>
  Object.assign(
    existsSync(resolve(dir, "index.html")) ? { [prefix || "main"]: resolve(dir, "index.html") } : {},
    ...readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !notPages.has(e.name))
      .map((e) => findPages(resolve(dir, e.name), prefix ? `${prefix}-${e.name}` : e.name)),
  );

export default defineConfig({
  base: "/",
  publicDir: "public",
  plugins: [htmlInclude(), cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        ...findPages(__dirname),
        googleHtml: resolve(__dirname, "google7694cf04bb5ce287.html"),
      },
    },
    // Copy public assets to dist
    copyPublicDir: true,
    assetsDir: "assets",
  },
});
