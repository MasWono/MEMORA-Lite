Document.addEventListener("DOMContentLoaded", () => {
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
      style:"box-sizing:border-box;width:100%;min-height:110px;border:1px solid #cbd5e1;border-radius:12px;padding:12px;font:inherit;background:#fff;color:#17324d;resize:vertical;"
    });
  }

  function styledSelect(attrs = {}) {
    return make("select", {
      ...attrs,
      style:"box-sizing:border-box;width:100%;min-height:44px;border:1px solid #cbd5e1;border-radius:12px;padding:10px 12px;font:inherit;background:#fff;color:#17324d;"
    });
  }

  function actionButton(label, primary = true) {
    return make("button", {
      type: "button",
      style: "border:0;border-radius:12px;padding:12px 16px;min-height:44px;font:inherit;font-weight:700;cursor:pointer;background:" +
        (primary ? "#0878ed" : "#edf2f7") +
        ";color:" + (primary ? "#fff" : "#17324d") + ";"
    }, label);
  }

  function noteLine(text) {
    return make("p", {
      style:"margin:0;color:#526579;font-size:14px;"
    }, text);
  }

  function getLocation() {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          capturedAt: new Date().toISOString()
        }),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  async function captureMetadata() {
    const recordedAt = new Date().toISOString();
    const location = await getLocation();
    return {
      recordedAt,
      displayTime: stamp(new Date(recordedAt)),
      location: location || null
    };
  }

  function locationText(location) {
    if (!location) return t("locationUnavailable");
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }

  function addMetadataLines(container, item) {
    const created = item.recordedAt || item.createdAt;
    if (created) {
      container.append(noteLine(`${t("created")}: ${stamp(new Date(created))}`));
    }
    container.append(noteLine(`${t("location")}: ${locationText(item.location)}`));
  }

  async function saveMemory(text, category, source = "text") {
    const trimmed = text.trim();
    if (!trimmed) {
      showMessage(t("emptyText"));
      return false;
    }

    const metadata = await captureMetadata();
    const memories = readList(STORAGE_KEYS.memories);

    memories.unshift({
      id: uid(),
      text: trimmed,
      category: category || "general",
      source,
      createdAt: metadata.recordedAt,
      recordedAt: metadata.recordedAt,
      displayTime: metadata.displayTime,
      location: metadata.location
    });

    return writeList(STORAGE_KEYS.memories, memories);
  }

  function openText() {
    const content = openFeature(t("textHeading"));
    content.append(noteLine(t("textNote")));
    content.append(noteLine(t("locationPermission")));

    const categoryId = "memora-text-category";
    content.append(fieldLabel(t("category"), categoryId));

    const category = styledSelect({id:categoryId});
    [["general",t("general")],["work",t("work")],["travel",t("travel")],
      ["personal",t("personal")],["material",t("material")]]
      .forEach(([value,label]) => category.append(make("option",{value},label)));
    content.append(category);

    const textId = "memora-text-content";
    content.append(fieldLabel(t("textHeading"), textId));
    const textarea = styledTextarea({
      id:textId,placeholder:t("textPlaceholder")
    });
    content.append(textarea);

    const actions = make("div", {
      style:"display:flex;gap:10px;flex-wrap:wrap;"
    });
    const save = actionButton(t("saveMemory"));
    const cancel = actionButton(t("close"),false);
    actions.append(save,cancel);
    content.append(actions);

    save.addEventListener("click", async () => {
      save.disabled = true;
      save.textContent = language === "id" ? "Menyimpan..." : "Saving...";
      const ok = await saveMemory(textarea.value, category.value, "text");
      if (ok) {
        closeFeature();
        showMessage(t("saved"));
      } else {
        save.disabled = false;
        save.textContent = t("saveMemory");
      }
    });

    cancel.addEventListener("click", closeFeature);
    textarea.focus();
  }

  function openVoice() {
    const content = openFeature(t("voiceHeading"));
    content.append(noteLine(t("voiceIntro")));
    content.append(noteLine(t("locationPermission")));

    const transcript = styledTextarea({
      id:"memora-voice-transcript",
      placeholder:t("transcriptPlaceholder")
    });
    content.append(transcript);

    const status = noteLine("");
    content.append(status);

    const actions = make("div", {
      style:"display:flex;gap:10px;flex-wrap:wrap;"
    });
    const start = actionButton(t("startListening"));
    const save = actionButton(t("saveTranscript"),false);
    const close = actionButton(t("close"),false);
    actions.append(start,save,close);
    content.append(actions);

    close.addEventListener("click", closeFeature);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      start.disabled = true;
      start.style.opacity = ".5";
      status.textContent = t("speechUnsupported");
    } else {
      recognition = new SpeechRecognition();
      recognition.lang = language === "id" ? "id-ID" : "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        listening = true;
        start.textContent = t("stopListening");
        status.textContent = t("listening");
      };

      recognition.onresult = event => {
        let finalText = "";
        for (let i = 0; i < event.results.length; i++) {
          finalText += event.results[i][0].transcript + " ";
        }
        transcript.value = finalText.trim();
      };

      recognition.onerror = event => {
        status.textContent = event.error === "not-allowed"
          ? (language === "id"
            ? "Izin mikrofon ditolak. Izinkan mikrofon pada browser."
            : "Microphone permission denied. Allow microphone access.")
          : `${language === "id" ? "Pengenalan suara berhenti: " : "Speech recognition stopped: "}${event.error}`;
      };

      recognition.onend = () => {
        listening = false;
        start.textContent = t("startListening");
      };

      start.addEventListener("click", () => {
        if (listening) {
          try { recognition.stop(); } catch (_) {}
        } else {
          try {
            recognition.lang = language === "id" ? "id-ID" : "en-US";
            recognition.start();
          } catch (_) {
            status.textContent = language === "id"
              ? "Tidak dapat memulai mikrofon. Coba lagi."
              : "Could not start microphone. Try again.";
          }
        }
      });
    }

    save.addEventListener("click", async () => {
      save.disabled = true;
      const ok = await saveMemory(transcript.value, "general", "voice");
      if (ok) {
        closeFeature();
        showMessage(t("voiceSaved"));
      } else {
        save.disabled = false;
      }
    });
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    currentSpeech = null;
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
      showMessage(t("noSpeech"));
      return;
    }
    stopSpeaking();
    currentSpeech = new SpeechSynthesisUtterance(text);
    currentSpeech.lang = language === "id" ? "id-ID" : "en-US";
    window.speechSynthesis.speak(currentSpeech);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showMessage(t("copied"));
    } catch (_) {
      const temp = styledTextarea({value:text});
      document.body.append(temp);
      temp.select();
      const ok = document.execCommand("copy");
      temp.remove();
      showMessage(ok ? t("copied") : "Copy failed");
    }
  }

  function reminderStatus(reminder) {
    if (reminder.done || reminder.completedAt) return t("completed");
    const when = new Date(reminder.when).getTime();
    const now = Date.now();
    if (when < now) return t("overdue");
    if (new Date(reminder.when).toDateString() === new Date().toDateString()) return t("today");
    return t("upcoming");
  }

  function reminderDescription(reminder) {
    const parts = [
      reminder.title,
      `${t("dateLabel")}: ${stamp(new Date(reminder.when))}`,
      `${t("status")}: ${reminderStatus(reminder)}`
    ];

    if (reminder.notes) parts.push(`${t("notes")}: ${reminder.notes}`);
    if (reminder.intervalDays) {
      parts.push(`${t("interval")}: ${reminder.intervalDays}`);
    }
    if (reminder.recordedAt || reminder.createdAt) {
      parts.push(`${t("reminderSavedAt")}: ${stamp(new Date(reminder.recordedAt || reminder.createdAt))}`);
    }
    if (reminder.completedAt) {
      parts.push(`${t("completedAt")}: ${stamp(new Date(reminder.completedAt))}`);
    }
    parts.push(`${t("location")}: ${locationText(reminder.location)}`);
    return parts.join(". ");
  }

  function openReminder() {
    renderReminderForm();
  }

  function renderReminderForm() {
    const content = openFeature(t("reminderHeading"));
    content.append(noteLine(t("reminderNote")));
    content.append(noteLine(t("locationPermission")));

    const titleId = "memora-reminder-title";
    content.append(fieldLabel(t("reminderTitleLabel"), titleId));
    const title = styledInput({
      id:titleId,type:"text",
      placeholder:t("reminderPlaceholder"),maxLength:180
    });
    content.append(title);

    const dateId = "memora-reminder-date";
    content.append(fieldLabel(t("reminderDate"), dateId));
    const date = styledInput({id:dateId,type:"datetime-local"});
    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    date.min = now.toISOString().slice(0,16);
    content.append(date);

    const notesId = "memora-reminder-notes";
    content.append(fieldLabel(t("notes"), notesId));
    const notes = styledTextarea({id:notesId});
    notes.style.minHeight = "70px";
    content.append(notes);

    const intervalId = "memora-reminder-interval";
    content.append(fieldLabel(t("interval"), intervalId));
    const interval = styledInput({
      id:intervalId,type:"number",min:"1",step:"1",inputMode:"numeric",
      placeholder:language === "id" ? "Contoh: 30" : "Example: 30"
    });
    content.append(interval);
    content.append(noteLine(t("intervalHint")));

    const save = actionButton(t("saveReminder"));
    const list = actionButton(t("showReminderList"),false);
    content.append(save,list);

    list.addEventListener("click", renderReminderList);

    save.addEventListener("click", async () => {
      if (!title.value.trim() || !date.value) {
        showMessage(t("emptyReminder"));
        return;
      }

      const when = new Date(date.value);
      if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        showMessage(t("invalidDate"));
        return;
      }

      let intervalDays = null;
      if (interval.value.trim()) {
        intervalDays = Number(interval.value);
        if (!Number.isInteger(intervalDays) || intervalDays < 1) {
          showMessage(t("invalidInterval"));
          return;
        }
      }

      save.disabled = true;
      save.textContent = language === "id" ? "Menyimpan..." : "Saving...";

      const metadata = await captureMetadata();
      const reminders = readList(STORAGE_KEYS.reminders);
      reminders.unshift({
        id: uid(),
        title: title.value.trim(),
        notes: notes.value.trim(),
        when: when.toISOString(),
        intervalDays,
        createdAt: metadata.recordedAt,
        recordedAt: metadata.recordedAt,
        displayTime: metadata.displayTime,
        location: metadata.location,
        done: false,
        completedAt: null,
        completedLocation: null,
        notifiedAt: null
      });

      if (writeList(STORAGE_KEYS.reminders, reminders)) {
        closeFeature();
        showMessage(t("reminderSaved"));
        scheduleReminderChecks();
      } else {
        save.disabled = false;
        save.textContent = t("saveReminder");
      }
    });
  }

  function renderReminderList() {
    const content = openFeature(t("reminderList"));
    const add = actionButton(t("addReminder"));
    add.addEventListener("click", renderReminderForm);
    content.append(add);

    const reminders = readList(STORAGE_KEYS.reminders)
      .sort((a,b) => new Date(a.when) - new Date(b.when));

    if (!reminders.length) {
      content.append(noteLine(t("noReminders")));
      return;
    }

    reminders.forEach(reminder => {
      const card = make("article", {
        style:"border:1px solid #e2e8f0;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;"
      });

      card.append(make("strong", {
        style:"font-size:17px;overflow-wrap:anywhere;"
      }, reminder.title));

      card.append(noteLine(`${t("dateLabel")}: ${stamp(new Date(reminder.when))}`));
      card.append(noteLine(`${t("status")}: ${reminderStatus(reminder)}`));

      if (reminder.notes) card.append(noteLine(`${t("notes")}: ${reminder.notes}`));
      if (reminder.intervalDays) {
        card.append(noteLine(`${t("interval")}: ${reminder.intervalDays}`));
      }
      addMetadataLines(card, reminder);

      if (reminder.completedAt) {
        card.append(noteLine(`${t("completedAt")}: ${stamp(new Date(reminder.completedAt))}`));
      } else if (new Date(reminder.when).getTime() < Date.now()) {
        card.append(noteLine(t("reminderOverdue")));
      }

      const actions = make("div", {
        style:"display:flex;gap:8px;flex-wrap:wrap;"
      });

      const listen = actionButton(t("listen"),false);
      const copy = actionButton(t("copy"),false);
      listen.addEventListener("click", () => speak(reminderDescription(reminder)));
      copy.addEventListener("click", () => copyText(reminderDescription(reminder)));
      actions.append(listen, copy);

      if (!reminder.done && !reminder.completedAt) {
        const complete = actionButton(t("complete"));
        complete.addEventListener("click", async () => {
          complete.disabled = true;
          const metadata = await captureMetadata();
          const all = readList(STORAGE_KEYS.reminders);
          const target = all.find(r => r.id === reminder.id);
          if (!target) return;

          target.done = true;
          target.completedAt = metadata.recordedAt;
          target.completedLocation = metadata.location;
          target.completionDisplayTime = metadata.displayTime;

          if (writeList(STORAGE_KEYS.reminders, all)) {
            showMessage(t("completedMessage"));
            renderReminderList();
          } else {
            complete.disabled = false;
          }
        });
        actions.append(complete);
      }

      const remove = actionButton(t("delete"),false);
      remove.addEventListener("click", () => {
        if (!window.confirm(t("confirmDelete"))) return;
        const all = readList(STORAGE_KEYS.reminders).filter(r => r.id !== reminder.id);
        if (writeList(STORAGE_KEYS.reminders, all)) renderReminderList();
      });
      actions.append(remove);

      card.append(actions);
      content.append(card);
    });
  }

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase(language === "id" ? "id-ID" : "en-US")
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^\p{L}\p{N}\s-]/gu," ")
      .replace(/\s+/g," ").trim();
  }

  function queryTerms(query) {
    const stop = new Set([
      "kapan","apa","saya","kita","yang","dan","di","ke","dari","untuk",
      "lagi","akan","harus","berapa","tolong","cari","tampilkan","lihat",
      "the","when","what","where","how","do","we","i","my","our","is",
      "are","was","were","to","for","of","on","in","a","an","please",
      "show","find","next","again","should","can","could","me"
    ]);
    return normalizeText(query).split(" ")
      .filter(word => word.length > 1 && !stop.has(word));
  }

  function scoreItem(item, terms) {
    const text = normalizeText([
      item.text, item.title, item.notes, item.category, item.source
    ].join(" "));
    return terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
  }

  function addSearchResult(container, title, description, item, type) {
    const card = make("article", {
      style:"border:1px solid #e2e8f0;border-radius:12px;padding:12px;"
    });
    card.append(make("strong", {}, title));
    card.append(make("p", {
      style:"margin:8px 0;white-space:pre-wrap;overflow-wrap:anywhere;"
    }, description));

    const actions = make("div", {
      style:"display:flex;gap:8px;flex-wrap:wrap;"
    });
    const listen = actionButton(t("listen"),false);
    const copy = actionButton(t("copy"),false);

    listen.addEventListener("click", () => speak(`${title}. ${description}`));
    copy.addEventListener("click", () => copyText(`${title}\n${description}`));
