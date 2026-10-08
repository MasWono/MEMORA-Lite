document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      showStageMessage(action);
    });
  });
});

function showStageMessage(action) {
  const labels = {
    voice: "Voice akan diaktifkan pada Stage 2.",
    text: "Text akan diaktifkan pada Stage 2.",
    search: "Search Memories akan diaktifkan pada Stage berikutnya.",
    ask: "Ask MEMORA akan diaktifkan pada Stage berikutnya.",
    settings: "Settings akan dibangun pada Stage berikutnya."
  };

  const box = document.getElementById("stage-message");
  if (!box) return;

  box.textContent = labels[action] || "Fitur akan tersedia pada tahap berikutnya.";
  box.classList.add("show");

  clearTimeout(showStageMessage.timer);
  showStageMessage.timer = setTimeout(() => {
    box.classList.remove("show");
  }, 2200);
}
