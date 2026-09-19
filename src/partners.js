// rapsap. partner enquiry: no backend yet, so the form composes a mail to
// care@rapsap.com and an enquiry is never silently dropped.
const form = document.querySelector("[data-enquiry]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const body = [...data.entries()].map(([key, value]) => `${key}: ${value}`).join("\n");
  const subject = `partner enquiry — ${data.get("enquiry type") || "general"}`;
  location.href = `mailto:care@rapsap.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
