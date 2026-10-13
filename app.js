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

  function actionButton(label, primary = true) {
    return make("button", {
      type:"button",
      style:`border:0;border-radius:12px;padding:12px 16px;min-height:44px;font:inherit;font-weight:700;cursor:pointer;background:${primary ? "#0878ed" : "#edf2f7"};color:${primary ? "#fff" : "#17324d"};`
    }, label);
  }

  function noteLine(text) {
    return make("p", {
      style:"margin:0;color:#526579;font-size:14px;"
    }, text);
  }

  function saveMemory(text, category, source = "text") {
    const trimmed = text.trim();

    if (!trimmed) {
      showMessage(t("emptyText"));
      return false;
    }

    const memories = readList(STORAGE_KEYS.memories);
    memories.unshift({
      id:uid(),
      text:trimmed,
      category:category || "general",
      source,
      createdAt:new Date().toISOString(),
      displayTime:stamp()
    });

    if (!writeList(STORAGE_KEYS.memories, memories)) return false;
    return true;
  }

  function openText() {
    const content = openFeature(t("textHeading"));
    content.append(noteLine(t("textNote")));

    const categoryId = "memora-text-category";
    content.append(fieldLabel(t("category"), categoryId));

    const category = styledSelect({id:categoryId});

    [
      ["general",t("general")],
      ["work",t("work")],
      ["travel",t("travel")],
      ["personal",t("personal")],
      ["material",t("material")]
    ].forEach(([value,label]) => {
      category.append(make("option",{value},label));
    });

    content.append(category);

    const textId = "memora-text-content";
    content.append(fieldLabel(t("textHeading"), textId));

    const textarea = styledTextarea({
      id:textId,
      placeholder:t("textPlaceholder")
    });

    content.append(textarea);

    const actions = make("div", {
      style:"display:flex;gap:10px;flex-wrap:wrap;"
    });

    const save = actionButton(t("saveMemory"));
    const cancel = actionButton(t("close"),false);

    save.addEventListener("click", () => {
      if (saveMemory(textarea.value, category.value, "text")) {
        closeFeature();
        showMessage(t("saved"));
      }
    });

    cancel.addEventListener("click", closeFeature);

    actions.append(save,cancel);
    content.append(actions);
    textarea.focus();
  }

  function openVoice() {
    const content = openFeature(t("voiceHeading"));
    content.append(noteLine(t("voiceIntro")));

    const transcriptId = "memora-voice-transcript";

    const transcript = styledTextarea({
      id:transcriptId,
      placeholder:t("transcriptPlaceholder")
    });

    content.append(transcript);

    const status = make("p", {
      style:"margin:0;color:#526579;font-size:14px;"
    });

    content.append(status);

    const actions = make("div", {
      style:"display:flex;gap:10px;flex-wrap:wrap;"
    });

    const start = actionButton(t("startListening"));
    const save = actionButton(t("saveTranscript"),false);
    const close = actionButton(t("close"),false);

    actions.append(start,save,close);
    content.append(actions);

    close.addEventListener("click",closeFeature);

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

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
          finalText += event.results[i][0].transcript +
            (event.results[i].isFinal ? " " : "");
        }

        transcript.value = finalText.trim();
      };

      recognition.onerror = event => {
        status.textContent = event.error === "not-allowed"
          ? (
              language === "id"
                ? "Izin mikrofon ditolak. Izinkan mikrofon pada browser."
                : "Microphone permission denied. Allow microphone access in your browser."
            )
          : (
              language === "id"
                ? "Pengenalan suara berhenti: "
                : "Speech recognition stopped: "
            ) + event.error;
      };

      recognition.onend = () => {
        listening = false;
        start.textContent = t("startListening");
      };

      start.addEventListener("click", () => {
        if (listening) {
          try {
            recognition.stop();
          } catch (_) {}
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

    save.addEventListener("click", () => {
      if (saveMemory(transcript.value, "general", "voice")) {
        closeFeature();
        showMessage(t("voiceSaved"));
      }
    });
  }

  function openReminder() {
    const content = openFeature(t("reminderHeading"));

    const titleId = "memora-reminder-title";
    content.append(fieldLabel(t("reminderTitleLabel"), titleId));

    const title = styledInput({
      id:titleId,
      type:"text",
      placeholder:t("reminderPlaceholder"),
      maxLength:180
    });

    content.append(title);

    const dateId = "memora-reminder-date";
    content.append(fieldLabel(t("reminderDate"), dateId));

    const date = styledInput({
      id:dateId,
      type:"datetime-local"
    });

    const now = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    );

    date.min = now.toISOString().slice(0,16);
    content.append(date);
    content.append(noteLine(t("reminderPermission")));

    const save = actionButton(t("saveReminder"));
    content.append(save);

    save.addEventListener("click", () => {
      if (!title.value.trim() || !date.value) {
        showMessage(t("emptyReminder"));
        return;
      }

      const when = new Date(date.value);

      if (
        Number.isNaN(when.getTime()) ||
        when.getTime() <= Date.now()
      ) {
        showMessage(t("invalidDate"));
        return;
      }

      const reminders = readList(STORAGE_KEYS.reminders);

      reminders.unshift({
        id:uid(),
        title:title.value.trim(),
        when:when.toISOString(),
        createdAt:new Date().toISOString(),
        done:false
      });

      if (writeList(STORAGE_KEYS.reminders,reminders)) {
        closeFeature();
        showMessage(t("reminderSaved"));
        scheduleReminderChecks();
      }
    });

    const listTitle = make("h3", {
      style:"margin:10px 0 0;font-size:18px;"
    },t("reminderList"));

    content.append(listTitle);
    renderReminders(content);
  }

  function renderReminders(container) {
    const reminders = readList(STORAGE_KEYS.reminders)
      .filter(r => !r.done)
      .sort((a,b) => new Date(a.when) - new Date(b.when));

    if (!reminders.length) {
      container.append(noteLine(t("noReminders")));
      return;
    }

    reminders.forEach(reminder => {
      const row = make("div", {
        style:"display:flex;align-items:flex-start;justify-content:space-between;gap:10px;border:1px solid #e2e8f0;border-radius:12px;padding:10px;"
      });

      const details = make("div", {
        style:"min-width:0;flex:1;"
      });

      details.append(make("strong",{},reminder.title));

      details.append(make("div", {
        style:"font-size:13px;color:#526579;margin-top:3px;"
      },stamp(new Date(reminder.when))));

      const remove = actionButton(t("delete"),false);
      remove.style.minHeight = "36px";
      remove.style.padding = "7px 10px";

      remove.addEventListener("click", () => {
        if (!window.confirm(t("confirmDelete"))) return;

        writeList(
          STORAGE_KEYS.reminders,
          readList(STORAGE_KEYS.reminders)
            .filter(r => r.id !== reminder.id)
        );

        openReminder();
      });

      row.append(details,remove);
      container.append(row);
    });
  }

  function openAsk() {
    const content = openFeature(t("askHeading"));
    content.append(noteLine(t("askNote")));

    const queryId = "memora-ask-query";
    const query = styledInput({
      id:queryId,
      type:"search",
      placeholder:t("askPlaceholder")
    });

    content.append(query);

    const search = actionButton(t("searchButton"));
    content.append(search);

    const resultArea = make("div", {
      style:"display:flex;flex-direction:column;gap:10px;"
    });

    content.append(resultArea);

    function runSearch() {
      resultArea.replaceChildren();

      const q = query.value.trim().toLocaleLowerCase(
        language === "id" ? "id-ID" : "en-US"
      );

      const memories = readList(STORAGE_KEYS.memories);

      const matches = q
        ? memories.filter(memory =>
            (memory.text + " " + memory.category + " " + memory.displayTime)
              .toLocaleLowerCase(language === "id" ? "id-ID" : "en-US")
              .includes(q)
          )
        : memories;

      resultArea.append(
        make("h3", {
          style:"margin:8px 0 0;font-size:18px;"
        }, q ? t("resultsHeading") : t("allMemories"))
      );

      if (!matches.length) {
        resultArea.append(
          noteLine(q ? t("noResults") : t("noMemories"))
        );
        return;
      }

      matches.slice(0,50).forEach(memory => {
        const card = make("article", {
          style:"border:1px solid #e2e8f0;border-radius:12px;padding:12px;"
        });

        card.append(
          make("div", {
            style:"white-space:pre-wrap;overflow-wrap:anywhere;"
          }, memory.text)
        );

        card.append(
          make("div", {
            style:"font-size:13px;color:#526579;margin-top:8px;"
          }, `${memory.category || t("general")} · ${memory.displayTime || stamp(new Date(memory.createdAt))}`)
        );

        const remove = actionButton(t("delete"),false);
        remove.style.marginTop = "8px";
        remove.style.padding = "7px 10px";
        remove.style.minHeight = "36px";

        remove.addEventListener("click", () => {
          if (!window.confirm(t("confirmDelete"))) return;

          writeList(
            STORAGE_KEYS.memories,
            readList(STORAGE_KEYS.memories)
              .filter(item => item.id !== memory.id)
          );

          runSearch();
        });

        card.append(remove);
        resultArea.append(card);
      });
    }

    search.addEventListener("click",runSearch);

    query.addEventListener("keydown",event => {
      if (event.key === "Enter") runSearch();
    });

    runSearch();
  }

  let reminderCheckTimer = null;

  function scheduleReminderChecks() {
    if (reminderCheckTimer) {
      clearInterval(reminderCheckTimer);
    }

    reminderCheckTimer = setInterval(() => {
      const now = Date.now();
      const reminders = readList(STORAGE_KEYS.reminders);
      let changed = false;

      reminders.forEach(reminder => {
        if (
          !reminder.done &&
          new Date(reminder.when).getTime() <= now
        ) {
          reminder.done = true;
          changed = true;

          const msg = `${t("dueReminder")}: ${reminder.title}`;

          showMessage(msg);

          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification("MEMORA Lite", {
                body:msg
              });
            } catch (_) {}
          } else if (document.visibilityState === "visible") {
            window.alert(msg);
          }
        }
      });

      if (changed) {
        writeList(STORAGE_KEYS.reminders,reminders);
      }
    },15000);
  }

  // Main menu actions
  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click",() => {
      const action = button.dataset.action;

      if (action === "settings") {
        openSettings();
        return;
      }

      if (action === "voice") {
        openVoice();
        return;
      }

      if (action === "text") {
        openText();
        return;
      }

      if (action === "reminder") {
        openReminder();
        return;
      }

      if (action === "ask") {
        openAsk();
        return;
      }
    });
  });

  // Settings: save selected language
  document.getElementById("settings-save")?.addEventListener("click",() => {
    language = languageSelect?.value === "id" ? "id" : "en";

    localStorage.setItem("memora-language",language);

    applyLanguage();
    closeSettings();
    showMessage(t("languageSaved"));
  });

  document.getElementById("settings-cancel")
    ?.addEventListener("click",closeSettings);

  settingsDialog?.addEventListener("click",event => {
    if (event.target === settingsDialog) {
      closeSettings();
    }
  });

  document.addEventListener("keydown",event => {
    if (event.key === "Escape") {
      closeSettings();
    }
  });

  // Initialize MEMORA Lite
  applyLanguage();
  scheduleReminderChecks();
});
