// rapsap. stores page: live text filter over the store cards.
const search = document.querySelector("[data-store-search]");
const cards = [...document.querySelectorAll(".scard")];
const count = document.querySelector(".store-count");
const empty = document.querySelector("[data-store-empty]");

search?.addEventListener("input", () => {
  const term = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const hit = !term || (card.dataset.store ?? card.textContent).toLowerCase().includes(term);
    card.hidden = !hit;
    if (hit) visible += 1;
  });
  if (count) count.textContent = `showing ${visible} of ${cards.length} stores`;
  if (empty) empty.hidden = visible !== 0;
});
