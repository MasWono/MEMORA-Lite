document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    en: {
      voiceTitle:"Voice", voiceSubtitle:"Speak & Save", textTitle:"Text", textSubtitle:"Write & Save",
      reminderTitle:"Reminder", reminderSubtitle:"Remember on time", askTitle:"Ask MEMORA", askSubtitle:"Ask Your Memories",
      settingsTitle:"Settings", settingsSubtitle:"Language and preferences", tagline:"Small notes. Big memories.",
      footerLine:"Your personal memory, always with you.", languageLabel:"Language", cancel:"Cancel", save:"Save",
      messages:{voice:"Voice will be available in Stage 2.",text:"Text will be available in Stage 2.",reminder:"Reminder will be available in a later stage.",ask:"Ask MEMORA will be available in a later stage."}
    },
    id: {
      voiceTitle:"Suara", voiceSubtitle:"Bicara & Simpan", textTitle:"Teks", textSubtitle:"Tulis & Simpan",
      reminderTitle:"Pengingat", reminderSubtitle:"Ingat tepat waktu", askTitle:"Tanya MEMORA", askSubtitle:"Tanya Memori Anda",
      settingsTitle:"Pengaturan", settingsSubtitle:"Bahasa dan preferensi", tagline:"Catatan kecil. Kenangan besar.",
      footerLine:"Memori pribadi Anda, selalu bersama Anda.", languageLabel:"Bahasa", cancel:"Batal", save:"Simpan",
      messages:{voice:"Fitur Suara tersedia pada Stage 2.",text:"Fitur Teks tersedia pada Stage 2.",reminder:"Fitur Pengingat tersedia pada tahap berikutnya.",ask:"Tanya MEMORA tersedia pada tahap berikutnya."}
    }
  };
  let language = localStorage.getItem("memora-language") || "en";
  const stageBox = document.getElementById("stage-message");
  const dialog = document.getElementById("settings-dialog");
  const languageSelect = document.getElementById("language-select");
  let messageTimer;

  function applyLanguage() {
    const words = translations[language] || translations.en;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (words[key]) el.textContent = words[key];
    });
    document.querySelectorAll("[data-action]").forEach(button => {
      button.setAttribute("aria-label", button.querySelector("strong")?.textContent || button.dataset.action);
    });
  }

  function showMessage(message) {
    if (!stageBox) return;
    stageBox.textContent = message;
    stageBox.classList.add("show");
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => stageBox.classList.remove("show"), 2400);
  }

  function openSettings() {
    if (!dialog || !languageSelect) return;
    languageSelect.value = language;
    dialog.classList.add("open");
    dialog.setAttribute("aria-hidden", "false");
  }
  function closeSettings() {
    if (!dialog) return;
    dialog.classList.remove("open");
    dialog.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "settings") { openSettings(); return; }
      const words = translations[language] || translations.en;
      showMessage(words.messages[action] || (language === "id" ? "Fitur tersedia pada tahap berikutnya." : "This feature will be available in a later stage."));
    });
  });
  document.getElementById("settings-save")?.addEventListener("click", () => {
    language = languageSelect.value === "id" ? "id" : "en";
    localStorage.setItem("memora-language", language);
    applyLanguage();
    closeSettings();
    showMessage(language === "id" ? "Bahasa disimpan." : "Language saved.");
  });
  document.getElementById("settings-cancel")?.addEventListener("click", closeSettings);
  dialog?.addEventListener("click", event => { if (event.target === dialog) closeSettings(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeSettings(); });
  applyLanguage();
});
