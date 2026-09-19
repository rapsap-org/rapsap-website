// rapsap. store finder: live text filter over the store cards.
const search = document.getElementById("store-query");
const cards = [...document.querySelectorAll(".store-card")];
const count = document.querySelector(".store-count");
const grid = document.querySelector(".store-grid");

const empty = document.createElement("p");
empty.className = "empty-state";
empty.textContent = "No listed location matches that search yet.";
empty.hidden = true;
grid?.after(empty);

search?.addEventListener("input", () => {
  const term = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const match = !term || card.textContent.toLowerCase().includes(term);
    card.hidden = !match;
    if (match) visible += 1;
  });
  if (count) count.textContent = `showing ${visible} of ${cards.length} locations`;
  empty.hidden = visible !== 0;
});
