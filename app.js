document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const translations = {
    en: {
      voiceTitle:"Voice", voiceSubtitle:"Speak & Save", textTitle:"Text", textSubtitle:"Write & Save",
      reminderTitle:"Reminder", reminderSubtitle:"Remember on time", askTitle:"Ask MEMORA", askSubtitle:"Ask Your Memories",
      settingsTitle:"Settings", settingsSubtitle:"Language and preferences", tagline:"Small notes. Big memories.",
      footerLine:"Your personal memory, always with you.", languageLabel:"Language", cancel:"Cancel", save:"Save",
      textHeading:"New memory", textPlaceholder:"Write your memory here...", category:"Category",
      general:"General", work:"Work", travel:"Travel", personal:"Personal", material:"Material",
      saveMemory:"Save memory", close:"Close", saved:"Memory saved on this device.", emptyText:"Please write something first.",
      voiceHeading:"Voice memory", voiceIntro:"Tap Start listening and speak. Your browser must support speech recognition.",
      startListening:"Start listening", stopListening:"Stop listening", transcriptPlaceholder:"Your speech will appear here...",
      saveTranscript:"Save transcript", speechUnsupported:"Voice recognition is not supported in this browser. Try a recent version of Chrome.",
      listening:"Listening…", reminderHeading:"New reminder", reminderTitleLabel:"Reminder title",
      reminderPlaceholder:"What do you need to remember?", reminderDate:"Date and time", saveReminder:"Save reminder",
      reminderSaved:"Reminder saved on this device.", emptyReminder:"Please enter a reminder title and date/time.",
      reminderList:"Saved reminders", noReminders:"No reminders saved yet.", dueReminder:"Reminder due",
      askHeading:"Ask your memories", askPlaceholder:"Search your saved memories…",
      searchButton:"Search", resultsHeading:"Matching memories", noResults:"No matching memories found on this device.",
      allMemories:"All saved memories", noMemories:"You have not saved any memories yet.",
      delete:"Delete", confirmDelete:"Delete this item?", languageSaved:"Language saved.",
      dateLabel:"Date", timeLabel:"Time", voiceSaved:"Voice memory saved on this device.",
      askNote:"MEMORA Lite searches memories stored on this device. Online AI answers are not connected yet.",
      textNote:"Memories are saved locally in this browser on this device.",
      reminderPermission:"If you want alerts while the app is closed, notification support and permission may be required.",
      invalidDate:"Choose a future date and time.", deleteAll:"Delete", savedAt:"Saved",
      messages:{}
    },
    id: {
      voiceTitle:"Suara", voiceSubtitle:"Bicara & Simpan", textTitle:"Teks", textSubtitle:"Tulis & Simpan",
      reminderTitle:"Pengingat", reminderSubtitle:"Ingat tepat waktu", askTitle:"Tanya MEMORA", askSubtitle:"Tanya Memori Anda",
      settingsTitle:"Pengaturan", settingsSubtitle:"Bahasa dan preferensi", tagline:"Catatan kecil. Kenangan besar.",
      footerLine:"Memori pribadi Anda, selalu bersama Anda.", languageLabel:"Bahasa", cancel:"Batal", save:"Simpan",
      textHeading:"Catatan baru", textPlaceholder:"Tulis kenangan atau catatan di sini...", category:"Kategori",
      general:"Umum", work:"Pekerjaan", travel:"Perjalanan", personal:"Pribadi", material:"Material",
      saveMemory:"Simpan catatan", close:"Tutup", saved:"Catatan tersimpan di perangkat ini.", emptyText:"Silakan tulis catatan terlebih dahulu.",
      voiceHeading:"Catatan suara", voiceIntro:"Tekan Mulai mendengarkan lalu berbicaralah. Browser harus mendukung pengenalan suara.",
      startListening:"Mulai mendengarkan", stopListening:"Berhenti mendengarkan", transcriptPlaceholder:"Hasil suara akan muncul di sini...",
      saveTranscript:"Simpan hasil suara", speechUnsupported:"Pengenalan suara tidak didukung browser ini. Coba versi Chrome terbaru.",
      listening:"Sedang mendengarkan…", reminderHeading:"Pengingat baru", reminderTitleLabel:"Judul pengingat",
      reminderPlaceholder:"Apa yang perlu Anda ingat?", reminderDate:"Tanggal dan waktu", saveReminder:"Simpan pengingat",
      reminderSaved:"Pengingat tersimpan di perangkat ini.", emptyReminder:"Masukkan judul dan tanggal/waktu pengingat.",
      reminderList:"Daftar pengingat", noReminders:"Belum ada pengingat.", dueReminder:"Pengingat jatuh tempo",
      askHeading:"Tanya memori Anda", askPlaceholder:"Cari catatan yang tersimpan…",
      searchButton:"Cari", resultsHeading:"Catatan yang cocok", noResults:"Tidak ada catatan yang cocok di perangkat ini.",
      allMemories:"Semua catatan tersimpan", noMemories:"Anda belum menyimpan catatan.",
      delete:"Hapus", confirmDelete:"Hapus item ini?", languageSaved:"Bahasa disimpan.",
      dateLabel:"Tanggal", timeLabel:"Jam", voiceSaved:"Catatan suara tersimpan di perangkat ini.",
      askNote:"MEMORA Lite mencari catatan yang tersimpan di perangkat ini. Jawaban AI online belum terhubung.",
      textNote:"Catatan disimpan secara lokal di browser pada perangkat ini.",
      reminderPermission:"Untuk menerima pemberitahuan saat aplikasi tertutup, dukungan notifikasi dan izin mungkin diperlukan.",
      invalidDate:"Pilih tanggal dan waktu di masa depan.", deleteAll:"Hapus", savedAt:"Disimpan",
      messages:{}
    }
  };

  let language = localStorage.getItem("memora-language") || "en";
  if (!translations[language]) language = "en";

  const stageBox = document.getElementById("stage-message");
  const settingsDialog = document.getElementById("settings-dialog");
  const languageSelect = document.getElementById("language-select");
  let messageTimer;
  let recognition = null;
  let listening = false;

  const STORAGE_KEYS = {
    memories: "memora-lite-memories-v1",
    reminders: "memora-lite-reminders-v1"
  };

  function t(key) {
    return (translations[language] && translations[language][key]) ||
      translations.en[key] || key;
  }

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function writeList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (_) {
      showMessage(language === "id"
        ? "Penyimpanan gagal. Periksa ruang penyimpanan browser."
        : "Could not save. Check browser storage space.");
      return false;
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function stamp(date = new Date()) {
    return date.toLocaleString(language === "id" ? "id-ID" : "en-GB", {
      year:"numeric", month:"short", day:"2-digit",
      hour:"2-digit", minute:"2-digit"
    });
  }

  function showMessage(message) {
    if (!stageBox) {
      window.alert(message);
      return;
    }
    stageBox.textContent = message;
    stageBox.classList.add("show");
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => stageBox.classList.remove("show"), 3000);
  }

  function applyLanguage() {
    const words = translations[language] || translations.en;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (words[key]) el.textContent = words[key];
    });

    document.querySelectorAll("[data-action]").forEach(button => {
      const label = button.querySelector("strong")?.textContent || button.dataset.action;
      button.setAttribute("aria-label", label);
    });

    if (languageSelect) languageSelect.value = language;
  }

  function openSettings() {
    if (!settingsDialog || !languageSelect) return;
    languageSelect.value = language;
    settingsDialog.classList.add("open");
    settingsDialog.setAttribute("aria-hidden", "false");
  }

  function closeSettings() {
    if (!settingsDialog) return;
    settingsDialog.classList.remove("open");
    settingsDialog.setAttribute("aria-hidden", "true");
  }

  function closeFeature() {
    document.getElementById("memora-feature-overlay")?.remove();

    if (recognition && listening) {
      try { recognition.stop(); } catch (_) {}
    }

    listening = false;
    document.removeEventListener("keydown", featureEscape);
  }

  function make(tag, attrs = {}, textContent = null) {
    const el = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class") el.className = value;
      else if (key === "style") el.setAttribute("style", value);
      else if (key.startsWith("aria-") || key === "role") el.setAttribute(key, value);
      else if (key in el) el[key] = value;
      else el.setAttribute(key, value);
    });

    if (textContent !== null) el.textContent = textContent;
    return el;
  }

  function openFeature(title) {
    closeFeature();

    const overlay = make("div", {
      id:"memora-feature-overlay",
      style:"position:fixed;inset:0;z-index:9999;background:rgba(5,24,48,.62);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;"
    });

    const panel = make("section", {
      role:"dialog",
      "aria-modal":"true",
      "aria-label":title,
      style:"box-sizing:border-box;width:min(100%,560px);max-height:92dvh;overflow:auto;background:#fff;color:#17324d;border-radius:22px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3);font:16px/1.45 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"
    });

    const head = make("div", {
      style:"display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;"
    });

    head.append(make("h2", {
      style:"margin:0;font-size:23px;line-height:1.2;"
    }, title));

    const x = make("button", {
      type:"button",
      "aria-label":t("close"),
      style:"border:0;border-radius:12px;padding:8px 12px;background:#edf2f7;color:#17324d;font-size:18px;cursor:pointer;"
    }, "×");

    x.addEventListener("click", closeFeature);
    head.append(x);
    panel.append(head);

    const content = make("div", {
      style:"display:flex;flex-direction:column;gap:12px;"
    });

    panel.append(content);
    overlay.append(panel);

    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeFeature();
    });

    document.addEventListener("keydown", featureEscape);
    document.body.append(overlay);

    return content;
  }

  function featureEscape(event) {
    if (event.key === "Escape") closeFeature();
  }

  function fieldLabel(text, forId) {
    return make("label", {
      htmlFor:forId,
      style:"font-weight:700;display:block;margin-bottom:4px;"
    }, text);
  }

  function styledInput(attrs = {}) {
    return make("input", {
      ...attrs,
      style:"box-sizing:border-box;width:100%;min-height:44px;border:1px solid #cbd5e1;border-radius:12px;padding:10px 12px;font:inherit;background:#fff;color:#17324d;"
    });
  }

  function styledTextarea(attrs = {}) {
    return make("textarea", {
      ...attrs,
      style:"box-sizing:border-box;width:100%;min-height:150px;border:1px solid #cbd5e1;border-radius:12px;padding:12px;font:inherit;background:#fff;color:#17324d;resize:vertical;"
    });
  }

  function styledSelect(attrs = {}) {
    return make("select", {
      ...attrs,
      style:"box-sizing:border-box;width:100%;min-height:44px;border:1px solid #cbd5e1;border-radius:12px;padding:10px 12px;font:inherit;background:#fff;color:#17324d;"
    });
  }

  function
