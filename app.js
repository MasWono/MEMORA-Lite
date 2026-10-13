document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // MEMORA Lite V1 - Master Plan 07 Oct 2026
  const STORAGE_KEYS = {
    memories: "memora-lite-memories-v1",
    reminders: "memora-lite-reminders-v1"
  };

  const translations = {
    en: {
      voiceTitle:"Voice", voiceSubtitle:"Speak & Save",
      textTitle:"Text", textSubtitle:"Write & Save",
      reminderTitle:"Reminder", reminderSubtitle:"Remember on time",
      askTitle:"Ask MEMORA", askSubtitle:"Ask Your Memories",
      settingsTitle:"Settings", settingsSubtitle:"Language and preferences",
      tagline:"Small notes. Big memories.",
      footerLine:"Your personal memory, always with you.",
      languageLabel:"Language", cancel:"Cancel", save:"Save",
      textHeading:"New memory", textPlaceholder:"Write your memory here...",
      category:"Category", general:"General", work:"Work",
      travel:"Travel", personal:"Personal", material:"Material",
      saveMemory:"Save memory", close:"Close",
      saved:"Memory saved on this device with date, time, and location.",
      emptyText:"Please write something first.",
      voiceHeading:"Voice memory",
      voiceIntro:"Tap Start listening and speak.",
      startListening:"Start listening",
      stopListening:"Stop listening",
      transcriptPlaceholder:"Your speech will appear here...",
      saveTranscript:"Save transcript",
      speechUnsupported:"Speech recognition is not supported in this browser.",
      listening:"Listening…",
      reminderHeading:"New reminder",
      reminderTitleLabel:"Reminder title",
      reminderPlaceholder:"What do you need to remember?",
      reminderDate:"Date and time",
      saveReminder:"Save reminder",
      reminderSaved:"Reminder saved on this device.",
      emptyReminder:"Enter a reminder title and date/time.",
      reminderList:"Reminder list",
      showReminderList:"Reminder list",
      addReminder:"Add reminder",
      noReminders:"No reminders saved yet.",
      dueReminder:"Reminder due",
      askHeading:"Ask your memories",
      askPlaceholder:"Ask or search your memories and reminders...",
      searchButton:"Search",
      resultsHeading:"Search results",
      noResults:"No matching memories or reminders found.",
      allMemories:"All saved memories",
      noMemories:"You have not saved any memories yet.",
      delete:"Delete", confirmDelete:"Delete this item?",
      languageSaved:"Language saved.",
      dateLabel:"Date", timeLabel:"Time",
      voiceSaved:"Voice memory saved on this device with date, time, and location.",
      askNote:"MEMORA searches your local memories and reminders. Online AI is not connected.",
      textNote:"Memories are saved locally on this device.",
      reminderNote:"Reminders are one-time. Mark the work complete when it is actually finished.",
      invalidDate:"Choose a future date and time.",
      savedAt:"Recorded",
      notes:"Notes (optional)",
      interval:"Maintenance interval in days (optional)",
      complete:"Mark complete",
      completed:"Completed",
      upcoming:"Upcoming",
      today:"Today",
      overdue:"Overdue",
      status:"Status",
      created:"Created",
      completedAt:"Actually completed",
      nextDue:"Suggested next maintenance",
      intervalMissing:"I cannot calculate the next date because the maintenance interval is missing.",
      completionMissing:"I cannot calculate the next date because the actual completion date is missing.",
      location:"Location",
      locationUnavailable:"Location unavailable",
      copy:"Copy",
      copied:"Copied.",
      listen:"Listen",
      stopSpeaking:"Stop speaking",
      noSpeech:"Speech playback is not supported in this browser.",
      locationPermission:"Location is saved automatically when permission and GPS are available.",
      reminderFired:"A reminder is due",
      askReminderResults:"Related reminders",
      askMemoryResults:"Related memories",
      noData:"I could not find enough saved information to answer that question.",
      deleteReminder:"Delete reminder",
      deleteMemory:"Delete memory",
      reminderSavedAt:"Reminder created",
      intervalHint:"Used to calculate the next suggested maintenance date after completion.",
      reminderOverdue:"This reminder is overdue. It has not been marked complete.",
      completedMessage:"Completion time recorded.",
      invalidInterval:"Enter a valid positive number of days.",
      noResultsForQuery:"No matching results found.",
      queryHelp:"Try a keyword such as pump, maintenance, or filter.",
      unknownDate:"Date not recorded",
      unknownTime:"Time not recorded",
      permissionInfo:"Browser permissions may limit GPS or notifications, especially when the app is closed."
    },
    id: {
      voiceTitle:"Suara", voiceSubtitle:"Bicara & Simpan",
      textTitle:"Teks", textSubtitle:"Tulis & Simpan",
      reminderTitle:"Pengingat", reminderSubtitle:"Ingat tepat waktu",
      askTitle:"Tanya MEMORA", askSubtitle:"Tanya Memori Anda",
      settingsTitle:"Pengaturan", settingsSubtitle:"Bahasa dan preferensi",
      tagline:"Catatan kecil. Kenangan besar.",
      footerLine:"Memori pribadi Anda, selalu bersama Anda.",
      languageLabel:"Bahasa", cancel:"Batal", save:"Simpan",
      textHeading:"Catatan baru",
      textPlaceholder:"Tulis catatan atau kenangan di sini...",
      category:"Kategori", general:"Umum", work:"Pekerjaan",
      travel:"Perjalanan", personal:"Pribadi", material:"Material",
      saveMemory:"Simpan catatan", close:"Tutup",
      saved:"Catatan tersimpan otomatis di perangkat ini beserta tanggal, waktu, dan lokasi.",
      emptyText:"Silakan tulis catatan terlebih dahulu.",
      voiceHeading:"Catatan suara",
      voiceIntro:"Tekan Mulai mendengarkan lalu berbicaralah.",
      startListening:"Mulai mendengarkan",
      stopListening:"Berhenti mendengarkan",
      transcriptPlaceholder:"Hasil suara akan muncul di sini...",
      saveTranscript:"Simpan hasil suara",
      speechUnsupported:"Pengenalan suara tidak didukung browser ini.",
      listening:"Sedang mendengarkan…",
      reminderHeading:"Pengingat baru",
      reminderTitleLabel:"Judul pengingat",
      reminderPlaceholder:"Apa yang perlu Anda ingat?",
      reminderDate:"Tanggal dan jam",
      saveReminder:"Simpan pengingat",
      reminderSaved:"Pengingat tersimpan di perangkat ini.",
      emptyReminder:"Masukkan judul dan tanggal/jam pengingat.",
      reminderList:"Daftar pengingat",
      showReminderList:"Daftar Pengingat",
      addReminder:"Tambah pengingat",
      noReminders:"Belum ada pengingat.",
      dueReminder:"Pengingat jatuh tempo",
      askHeading:"Tanya memori Anda",
      askPlaceholder:"Tanyakan atau cari catatan dan pengingat...",
      searchButton:"Cari",
      resultsHeading:"Hasil pencarian",
      noResults:"Tidak ditemukan catatan atau pengingat yang cocok.",
      allMemories:"Semua catatan tersimpan",
      noMemories:"Anda belum menyimpan catatan.",
      delete:"Hapus", confirmDelete:"Hapus item ini?",
      languageSaved:"Bahasa disimpan.",
      dateLabel:"Tanggal", timeLabel:"Jam",
      voiceSaved:"Catatan suara tersimpan otomatis beserta tanggal, waktu, dan lokasi.",
      askNote:"MEMORA mencari catatan dan pengingat lokal. AI online belum terhubung.",
      textNote:"Catatan disimpan secara lokal di perangkat ini.",
      reminderNote:"Pengingat bersifat satu kali. Tandai selesai ketika pekerjaan benar-benar selesai.",
      invalidDate:"Pilih tanggal dan jam di masa depan.",
      savedAt:"Dicatat",
      notes:"Catatan (opsional)",
      interval:"Interval perawatan dalam hari (opsional)",
      complete:"Tandai Selesai",
      completed:"Selesai",
      upcoming:"Akan datang",
      today:"Hari ini",
      overdue:"Terlambat",
      status:"Status",
      created:"Dibuat",
      completedAt:"Waktu pekerjaan selesai",
      nextDue:"Saran jadwal perawatan berikutnya",
      intervalMissing:"Saya belum dapat menghitung tanggal berikutnya karena interval perawatan belum tersedia.",
      completionMissing:"Saya belum dapat menghitung tanggal berikutnya karena tanggal pekerjaan selesai belum tersedia.",
      location:"Lokasi",
      locationUnavailable:"Lokasi tidak tersedia",
      copy:"Salin",
      copied:"Berhasil disalin.",
      listen:"Dengarkan",
      stopSpeaking:"Berhenti berbicara",
      noSpeech:"Pembacaan suara tidak didukung browser ini.",
      locationPermission:"Lokasi dicatat secara otomatis saat izin dan GPS tersedia.",
      reminderFired:"Pengingat telah jatuh tempo",
      askReminderResults:"Pengingat terkait",
      askMemoryResults:"Catatan terkait",
      noData:"I cannot find enough saved information to answer that question.",
      deleteReminder:"Hapus pengingat",
      deleteMemory:"Hapus catatan",
      reminderSavedAt:"Reminder dibuat",
      intervalHint:"Digunakan untuk menghitung saran jadwal perawatan berikutnya setelah pekerjaan selesai.",
      reminderOverdue:"Pengingat ini terlambat. Statusnya belum otomatis diubah menjadi selesai.",
      completedMessage:"Waktu penyelesaian telah dicatat.",
      invalidInterval:"Masukkan jumlah hari positif yang benar.",
      noResultsForQuery:"Tidak ditemukan hasil yang cocok.",
      queryHelp:"Coba kata kunci seperti pompa, perawatan, atau filter.",
      unknownDate:"Tanggal belum dicatat",
      unknownTime:"Jam belum dicatat",
      permissionInfo:"Izin browser dapat membatasi GPS atau notifikasi, terutama saat aplikasi ditutup."
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
  let reminderCheckTimer = null;
  let currentSpeech = null;

  function t(key) {
    return translations[language]?.[key] || translations.en[key] || key;
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
    messageTimer = setTimeout(() => stageBox.classList.remove("show"), 3500);
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

    let closeBtn = settingsDialog.querySelector(".memora-settings-close");
    if (!closeBtn) {
      const contentWrapper = settingsDialog.querySelector("div") || settingsDialog;
      closeBtn = make("button", {
        type: "button",
        class: "memora-settings-close",
        "aria-label": t("close"),
        style: "border:0;border-radius:12px;padding:8px 12px;background:#edf2f7;color:#17324d;font-size:18px;cursor:pointer;float:right;margin-bottom:12px;"
      }, "×");
      closeBtn.addEventListener("click", closeSettings);
      contentWrapper.insertBefore(closeBtn, contentWrapper.firstChild);
    }

    if (!settingsDialog.hasAttribute("data-backdrop-listener")) {
      settingsDialog.setAttribute("data-backdrop-listener", "true");
      settingsDialog.addEventListener("click", e => {
        if (e.target === settingsDialog) {
          closeSettings();
        }
      });
    }
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
    stopSpeaking();
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
      role:"dialog","aria-modal":"true","aria-label":title,
      style:"box-sizing:border-box;width:min(100%,600px);max-height:92dvh;overflow:auto;background:#fff;color:#17324d;border-radius:22px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3);font:16px/1.45 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"
    });

    const head = make("div", {
      style:"display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;"
    });
    head.append(make("h2", {style:"margin:0;font-size:23px;line-height:1.2;"}, title));

    const x = make("button", {
      type:"button","aria-label":t("close"),
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
      style:"box-sizing:border-box;width:
