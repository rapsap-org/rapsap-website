// rapsap. shared behaviour: header menu + current-page state.

// ---- mobile menu ----------------------------------------------------------
const menu = document.querySelector(".mobile-menu");
const menuButton = menu?.querySelector("button");
const mobileNav = document.getElementById("mobile-navigation");

const setMenu = (open) => {
  if (!menu || !menuButton || !mobileNav) return;
  menu.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  mobileNav.hidden = !open;
};

menuButton?.addEventListener("click", () => {
  setMenu(!menu.classList.contains("is-open"));
});
mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("click", (event) => {
  if (menu && !menu.contains(event.target)) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.classList.contains("is-open")) {
    setMenu(false);
    menuButton?.focus();
  }
});
window.matchMedia("(min-width: 1121px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

// ---- current page ---------------------------------------------------------
const path = location.pathname.replace(/\/index\.html$/, "/");
document.querySelectorAll(".desktop-nav a, .mobile-menu nav a, .footer-nav a, .legal-nav a").forEach((link) => {
  const url = new URL(link.href, location.href);
  if (url.origin === location.origin && !url.hash && url.pathname === path && path !== "/") {
    link.setAttribute("aria-current", "page");
  }
});

// Logo / "back to top" on the homepage scroll instead of reloading.
if (path === "/") {
  document.querySelectorAll('a[href="/"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
