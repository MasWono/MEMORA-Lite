
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

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
      saved:"Memory saved on this device.",
      emptyText:"Please write something first.",
      voiceHeading:"Voice memory",
      voiceIntro:"Tap Start listening and speak.",
      startListening:"Start listening", stopListening:"Stop listening",
      transcriptPlaceholder:"Your speech will appear here...",
      saveTranscript:"Save transcript",
      speechUnsupported:"Speech recognition is not supported in this browser. Try a recent version of Chrome.",
      listening:"Listening…", reminderHeading:"New reminder",
      reminderTitleLabel:"Reminder title",
      reminderPlaceholder:"What do you need to remember?",
      reminderDate:"Date and time", saveReminder:"Save reminder",
      reminderSaved:"Reminder saved on this device.",
      emptyReminder:"Enter a reminder title and date/time.",
      reminderList:"Saved reminders", noReminders:"No reminders saved yet.",
      dueReminder:"Reminder due", askHeading:"Ask your memories",
      askPlaceholder:"Search your saved memories…",
      searchButton:"Search", resultsHeading:"Matching memories",
      noResults:"No matching memories found.",
      allMemories:"All saved memories",
      noMemories:"You have not saved any memories yet.",
      delete:"Delete", confirmDelete:"Delete this item?",
      languageSaved:"Language saved.",
      voiceSaved:"Voice memory saved on this device.",
      askNote:"Search your saved memories. Online AI answers are not connected yet.",
      textNote:"Memories are saved locally in this browser on this device.",
      reminderPermission:"Reminders are checked while this page is open. Background alerts are not guaranteed.",
      invalidDate:"Choose a future date and time.",
      copy:"Copy", copied:"Copied to clipboard.",
      copyFailed:"Could not copy. Please select and copy the text manually.",
      speak:"Read aloud", stopSpeaking:"Stop reading",
      dateLabel:"Date", timeLabel:"Time", messages:{}
    },

    id: {
      voiceTitle:"Suara", voiceSubtitle:"Bicara & Simpan",
      textTitle:"Teks", textSubtitle:"Tulis & Simpan",
      reminderTitle:"Pengingat", reminderSubtitle:"Ingat tepat waktu",
      askTitle:"Tanya MEMORA", askSubtitle:"Tanya Memori Anda",
      settingsTitle:"Pengaturan",
      settingsSubtitle:"Bahasa dan preferensi",
      tagline:"Catatan kecil. Kenangan besar.",
      footerLine:"Memori pribadi Anda, selalu bersama Anda.",
      languageLabel:"Bahasa", cancel:"Batal", save:"Simpan",
      textHeading:"Catatan baru",
      textPlaceholder:"Tulis kenangan atau catatan di sini...",
      category:"Kategori", general:"Umum", work:"Pekerjaan",
      travel:"Perjalanan", personal:"Pribadi", material:"Material",
      saveMemory:"Simpan catatan", close:"Tutup",
      saved:"Catatan tersimpan di perangkat ini.",
      emptyText:"Silakan tulis catatan terlebih dahulu.",
      voiceHeading:"Catatan suara",
      voiceIntro:"Tekan Mulai mendengarkan lalu berbicaralah.",
      startListening:"Mulai mendengarkan",
      stopListening:"Berhenti mendengarkan",
      transcriptPlaceholder:"Hasil suara akan muncul di sini...",
      saveTranscript:"Simpan hasil suara",
      speechUnsupported:"Pengenalan suara tidak didukung browser ini. Coba Chrome versi terbaru.",
      listening:"Sedang mendengarkan…",
      reminderHeading:"Pengingat baru",
      reminderTitleLabel:"Judul pengingat",
      reminderPlaceholder:"Apa yang perlu Anda ingat?",
      reminderDate:"Tanggal dan waktu",
      saveReminder:"Simpan pengingat",
      reminderSaved:"Pengingat tersimpan di perangkat ini.",
      emptyReminder:"Masukkan judul dan tanggal/waktu pengingat.",
      reminderList:"Daftar pengingat",
      noReminders:"Belum ada pengingat.",
      dueReminder:"Pengingat jatuh tempo",
      askHeading:"Tanya memori Anda",
      askPlaceholder:"Cari catatan yang tersimpan…",
      searchButton:"Cari",
      resultsHeading:"Catatan yang cocok",
      noResults:"Tidak ditemukan catatan yang cocok.",
      allMemories:"Semua catatan tersimpan",
      noMemories:"Anda belum menyimpan catatan.",
      delete:"Hapus", confirmDelete:"Hapus item ini?",
      languageSaved:"Bahasa disimpan.",
      voiceSaved:"Catatan suara tersimpan di perangkat ini.",
      askNote:"Cari catatan yang tersimpan. Jawaban AI online belum terhubung.",
      textNote:"Catatan disimpan secara lokal di browser pada perangkat ini.",
      reminderPermission:"Pengingat diperiksa saat halaman ini terbuka. Notifikasi saat halaman tertutup belum dijamin.",
      invalidDate:"Pilih tanggal dan waktu di masa depan.",
      copy:"Salin", copied:"Teks berhasil disalin.",
      copyFailed:"Tidak dapat menyalin. Silakan pilih dan salin teks secara manual.",
      speak:"Bacakan", stopSpeaking:"Hentikan bacaan",
      dateLabel:"Tanggal", timeLabel:"Jam", messages:{}
    }
  };

  let language = localStorage.getItem("memora-language") || "en";
  if (!translations[language]) language = "en";

  const stageBox = document.getElementById("stage-message");
  const settingsDialog = document.getElementById("settings-dialog");
  const languageSelect = document.getElementById("language-select");

  const STORAGE_KEYS = {
    memories: "memora-lite-memories-v1",
    reminders: "memora-lite-reminders-v1"
  };

  let messageTimer;
  let recognition = null;
  let listening = false;
  let reminderCheckTimer = null;
  let activeOverlay = null;

  function t(key) {
    return translations[language][key] ||
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
    return Date.now().toString(36) +
      Math.random().toString(36).slice(2, 9);
  }

  function stamp(date = new Date()) {
    return date.toLocaleString(language === "id" ? "id-ID" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
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
    messageTimer = setTimeout(() => {
      stageBox.classList.remove("show");
    }, 3000);
  }

  function applyLanguage() {
    const words = translations[language];
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (words[key]) el.textContent = words[key];
    });

    document.querySelectorAll("[data-action]").forEach(button => {
      button.setAttribute(
        "aria-label",
        button.querySelector("strong")?.textContent ||
          button.dataset.action
      );
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
    if (recognition && listening) {
      try {
        recognition.stop();
      } catch (_) {}
    }

    listening = false;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (activeOverlay) {
      activeOverlay.remove();
      activeOverlay = null;
    }

    document.removeEventListener("keydown", featureEscape);
  }

  function featureEscape(event) {
    if (event.key === "Escape") closeFeature();
  }

  function make(tag, attrs = {}, textContent = null) {
    const el = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class") el.className = value;
      else if (key === "style") el.setAttribute("style", value);
      else if (key.startsWith("aria-") || key === "role") {
        el.setAttribute(key, value);
      } else if (key in el) el[key] = value;
      else el.setAttribute(key, value);
    });

    if (textContent !== null) el.textContent = textContent;
    return el;
  }

  function openFeature(title) {
    closeFeature();

    const overlay = make("div", {
      id: "memora-feature-overlay",
      style: "position:fixed;inset:0;z-index:9999;background:rgba(5,24,48,.62);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;"
    });

    const panel = make("section", {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      style: "box-sizing:border-box;width:min(100%,560px);max-height:92dvh;overflow:auto;background:#fff;color:#17324d;border-radius:22px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3);font:16px/1.45 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"
    });

    const head = make("div", {
      style: "display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;"
    });

    head.append(make("h2", {
      style: "margin:0;font-size:23px;line-height:1.2;"
    }, title));

    const close = make("button", {
      type: "button",
      "aria-label": t("close"),
      style: "border:0;border-radius:12px;padding:8px 12px;background:#edf2f7;color:#17324d;font-size:18px;cursor:pointer;"
    }, "×");

    close.addEventListener("click", closeFeature);
    head.append(close);
    panel.append(head);

    const content = make("div", {
      style: "display:flex;flex-direction:column;gap:12px;"
    });

    panel.append(content);
    overlay.append(panel);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeFeature();
    });

    document.body.append(overlay);
    activeOverlay = overlay;

    document.addEventListener("keydown", featureEscape);

    return content;
  }

  function fieldLabel(text, forId) {
    return make("label", {
      htmlFor: forId,
      style: "font-weight:700;display:block;margin-bottom:4px;"
    }, text);
  }

  function styledInput(attrs = {}) {
    return make("input", {
      ...attrs,
      style: "box-sizing:border-box;width:100%;min-height:44px;border:1px solid #cbd5e1;border-radius:12px;padding:10px 12px;font:inherit;background:#fff;color:#17324d;"
    });
  }

  function styledTextarea(attrs = {}) {
    return make("textarea", {
      ...attrs,
      style: "box-sizing:border-box;width:100%;min-height:150px;border:1px solid #cbd5e1;border-radius:12px;padding:12px;font:inherit;background:#fff;color:#17324d;resize:vertical;"
    });
  }

  function styledSelect(attrs = {}) {
    return make("select", {
      ...attrs,
      style: "box-sizing:border-box;width:100%;min-height:44px;border:1px solid #cbd5e1;border-radius:12px;padding:10px 12px;font:inherit;background:#fff;color:#17324d;"
    });
  }

  function actionButton(label, primary = true) {
    return make("button", {
      type: "button",
      style: `border:0;border-radius:12px;padding:12px 16px;min-height:44px;font:inherit;font-weight:700;cursor:pointer;background:${primary ? "#0878ed" : "#edf2f7"};color:${primary ? "#fff" : "#17324d"};`
    }, label);
  }

  function noteLine(text) {
    return make("p", {
      style: "margin:0;color:#526579;font-size:14px;"
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
      id: uid(),
      text: trimmed,
      category: category || "general",
      source,
      createdAt: new Date().toISOString(),
      displayTime: stamp()
    });

    return writeList(STORAGE_KEYS.memories, memories);
  }

  function openText() {
    const content = openFeature(t("textHeading"));
    content.append(noteLine(t("textNote")));

    const categoryId = "memora-text-category";
    content.append(fieldLabel(t("category"), categoryId));

    const category = styledSelect({ id: categoryId });

    [
      ["general", t("general")],
      ["work", t("work")],
      ["travel", t("travel")],
      ["personal", t("personal")],
      ["material", t("material")]
    ].forEach(([value, label]) => {
      category.append(make("option", { value }, label));
    });

    content.append(category);

    const textId = "memora-text-content";
    content.append(fieldLabel(t("textHeading"), textId));

    const textarea = styledTextarea({
      id: textId,
      placeholder: t("textPlaceholder")
    });

    content.append(textarea);

    const actions = make("div", {
      style: "display:flex;gap:10px;flex-wrap:wrap;"
    });

    const save = actionButton(t("saveMemory"));
    const cancel = actionButton(t("close"), false);

    save.addEventListener("click", () => {
      if (saveMemory(textarea.value, category.value, "text")) {
        closeFeature();
        showMessage(t("saved"));
      }
    });

    cancel.addEventListener("click", closeFeature);

    actions.append(save, cancel);
    content.append(actions);
    textarea.focus();
  }

  function openVoice() {
    const content = openFeature(t("voiceHeading"));
    content.append(noteLine(t("voiceIntro")));

    const transcript = styledTextarea({
      id: "memora-voice-transcript",
      placeholder: t("transcriptPlaceholder")
    });

    content.append(transcript);

    const status = make("p", {
      style: "margin:0;color:#526579;font-size:14px;"
    });

    content.append(status);

    const actions = make("div", {
      style: "display:flex;gap:10px;flex-wrap:wrap;"
    });

    const start = actionButton(t("startListening"));
    const save = actionButton(t("saveTranscript"), false);
    const close = actionButton(t("close"), false);

    actions.append(start, save, close);
    content.append(actions);
    close.addEventListener("click", closeFeature);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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
        let text = "";

        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript +
            (event.results[i].isFinal ? " " : "");
        }

        transcript.value = text.trim();
      };

      recognition.onerror = event => {
        status.textContent = event.error === "not-allowed"
          ? (language === "id"
            ? "Izin mikrofon ditolak. Izinkan mikrofon pada browser."
            : "Microphone permission denied. Allow microphone access.")
          : (language === "id"
            ? "Pengenalan suara berhenti: "
            : "Speech recognition stopped: ") + event.error;
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
      id: titleId,
      type: "text",
      placeholder: t("reminderPlaceholder"),
      maxLength: 180
    });

    content.append(title);

    const dateId = "memora-reminder-date";
    content.append(fieldLabel(t("reminderDate"), dateId));

    const date = styledInput({
      id: dateId,
      type: "datetime-local"
    });

    const now = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    );

    date.min = now.toISOString().slice(0, 16);
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

      if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        showMessage(t("invalidDate"));
        return;
      }

      const reminders = readList(STORAGE_KEYS.reminders);

      reminders.unshift({
        id: uid(),
        title: title.value.trim(),
        when: when.toISOString(),
        createdAt: new Date().toISOString(),
        done: false
      });

      if (writeList(STORAGE_KEYS.reminders, reminders)) {
        closeFeature();
        showMessage(t("reminderSaved"));
      }
    });

    content.append(make("h3", {
      style: "margin:10px 0 0;font-size:18px;"
    }, t("reminderList")));

    renderReminders(content);
  }

  function renderReminders(container) {
    const reminders = readList(STORAGE_KEYS.reminders)
      .filter(reminder => !reminder.done)
      .sort((a, b) => new Date(a.when) - new Date(b.when));

    if (!reminders.length) {
      container.append(noteLine(t("noReminders")));
      return;
    }

    reminders.forEach(reminder => {
      const row = make("div", {
        style: "display:flex;align-items:flex-start;justify-content:space-between;gap:10px;border:1px solid #e2e8f0;border-radius:12px;padding:10px;"
      });

      const details = make("div", {
        style: "min-width:0;flex:1;"
      });

      details.append(make("strong", {}, reminder.title));

      details.append(make("div", {
        style: "font-size:13px;color:#526579;margin-top:3px;"
      }, stamp(new Date(reminder.when))));

      const remove = actionButton(t("delete"), false);
      remove.style.minHeight = "36px";
      remove.style.padding = "7px 10px";

      remove.addEventListener("click", () => {
        if (!window.confirm(t("confirmDelete"))) return;

        writeList(
          STORAGE_KEYS.reminders,
          readList(STORAGE_KEYS.reminders)
            .filter(item => item.id !== reminder.id)
        );

        closeFeature();
        openReminder();
      });

      row.append(details, remove);
      container.append(row);
    });
  }

  function normalize(value) {
    return value
      .toLocaleLowerCase(language === "id" ? "id-ID" : "en-US")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showMessage(t("copied")))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const input = make("textarea", {
      readonly: true,
      style: "position:fixed;left:-9999px;top:0;"
    });

    input.value = text;
    document.body.append(input);
    input.select();

    let success = false;

    try {
      success = document.execCommand("copy");
    } catch (_) {}

    input.remove();
    showMessage(success ? t("copied") : t("copyFailed"));
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) {
      showMessage(language === "id"
        ? "Suara tidak didukung browser ini."
        : "Speech playback is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "id" ? "id-ID" : "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function openAsk() {
    const content = openFeature(t("askHeading"));
    content.append(noteLine(t("askNote")));

    const query = styledInput({
      id: "memora-ask-query",
      type: "search",
      placeholder: t("askPlaceholder")
    });

    content.append(query);

    const search = actionButton(t("searchButton"));
    content.append(search);

    const resultArea = make("div", {
      style: "display:flex;flex-direction:column;gap:10px;"
    });

    content.append(resultArea);

    const stopWords = new Set(
      language === "id"
        ? [
            "apa","siapa","kapan","dimana","mana","mengapa",
            "kenapa","bagaimana","berapa","apakah","saya","aku",
            "anda","kamu","yang","di","ke","dari","pada","untuk",
            "dengan","dan","atau","ini","itu","ada","adalah",
            "tolong","cari","tunjukkan","ingatkan","tentang",
            "catatan","memori","saat","hari","jam","tanggal"
          ]
        : [
            "what","who","when","where","why","how","which",
            "whose","whom","is","are","was","were","do","does",
            "did","the","a","an","i","me","my","you","your",
            "we","our","and","or","to","from","at","in","on",
            "for","with","about","please","find","show","tell",
            "remember","note","notes","memory","memories","today",
            "date","time"
          ]
    );

    function getKeywords(value) {
      return [...new Set(
        normalize(value)
          .split(" ")
          .filter(word => word.length >= 2 && !stopWords.has(word))
      )];
    }

    function runSearch() {
      resultArea.replaceChildren();

      const rawQuery = query.value.trim();
      const keywords = getKeywords(rawQuery);
      const memories = readList(STORAGE_KEYS.memories);

      resultArea.append(make("h3", {
        style: "margin:8px 0 0;font-size:18px;"
      }, t("resultsHeading")));

      if (!memories.length) {
        resultArea.append(noteLine(t("noMemories")));
        return;
      }

      if (!rawQuery || !keywords.length) {
        resultArea.append(noteLine(t("noResults")));
        return;
      }

      const matches = memories.map(memory => {
        const text = normalize(
          `${memory.text} ${memory.category || ""} ${memory.displayTime || ""}`
        );

        const tokens = text.split(" ");

        const matched = keywords.filter(word => {
          if (tokens.includes(word)) return true;

          if (language === "id" && word.length >= 4) {
            const variants = [
              "me" + word, "mem" + word, "men" + word,
              "meng" + word, "ber" + word, "ter" + word,
              "di" + word
            ];

            if (variants.some(variant => tokens.includes(variant))) {
              return true;
            }

            return tokens.some(token =>
              token.length >= 4 &&
              (token.includes(word) || word.includes(token))
            );
          }

          return false;
        });

        return { memory, score: matched.length };
      })
      .filter(item => item.score > 0)
      .sort((a, b) =>
        b.score - a.score ||
        new Date(b.memory.createdAt) - new Date(a.memory.createdAt)
      );

      if (!matches.length) {
        resultArea.append(noteLine(t("noResults")));
        return;
      }

      resultArea.append(noteLine(
        language === "id"
          ? `${matches.length} catatan ditemukan.`
          : `${matches.length} matching notes found.`
      ));

      matches.slice(0, 50).forEach(item => {
        const memory = item.memory;

        const card = make("article", {
          style: "border:1px solid #e2e8f0;border-radius:12px;padding:12px;"
        });

        card.append(make("div", {
          style: "white-space:pre-wrap;overflow-wrap:anywhere;"
        }, memory.text));

        card.append(make("div", {
          style: "font-size:13px;color:#526579;margin-top:8px;"
        }, `${memory.category || t("general")} · ${
          memory.displayTime || stamp(new Date(memory.createdAt))
        }`));

        const actions = make("div", {
          style: "display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;"
        });

        const copy = actionButton(t("copy"), false);
        copy.addEventListener("click", () => copyText(memory.text));

        const speak = actionButton(t("speak"), false);
        speak.addEventListener("click", () => speakText(memory.text));

        const remove = actionButton(t("delete"), false);

        remove.addEventListener("click", () => {
          if (!window.confirm(t("confirmDelete"))) return;

          writeList(
            STORAGE_KEYS.memories,
            readList(STORAGE_KEYS.memories)
              .filter(saved => saved.id !== memory.id)
          );

          runSearch();
        });

        actions.append(copy, speak, remove);
        card.append(actions);
        resultArea.append(card);
      });
    }

    search.addEventListener("click", runSearch);

    query.addEventListener("keydown", event => {
      if (event.key === "Enter") runSearch();
    });

    runSearch();
  }

  function scheduleReminderChecks() {
    if (reminderCheckTimer) clearInterval(reminderCheckTimer);

    reminderCheckTimer = setInterval(() => {
      const now = Date.now();
      const reminders = readList(STORAGE_KEYS.reminders);
      let changed = false;

      reminders.forEach(reminder => {
        if (!reminder.done && new Date(reminder.when).getTime() <= now) {
          reminder.done = true;
          changed = true;

          const message = `${t("dueReminder")}: ${reminder.title}`;
          showMessage(message);

          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification("MEMORA Lite", { body: message });
            } catch (_) {}
          } else if (document.visibilityState === "visible") {
            window.alert(message);
          }
        }
      });

      if (changed) writeList(STORAGE_KEYS.reminders, reminders);
    }, 15000);
  }

  // Connect all home menu buttons.
  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      if (action === "settings") openSettings();
      else if (action === "voice") openVoice();
      else if (action === "text") openText();
      else if (action === "reminder") openReminder();
      else if (action === "ask") openAsk();
    });
  });

  document.getElementById("settings-save")
    ?.addEventListener("click", () => {
      language = languageSelect?.value === "id" ? "id" : "en";

      localStorage.setItem("memora-language", language);
      applyLanguage();
      closeSettings();
      showMessage(t("languageSaved"));
    });

  document.getElementById("settings-cancel")
    ?.addEventListener("click", closeSettings);

  settingsDialog?.addEventListener("click", event => {
    if (event.target === settingsDialog) closeSettings();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSettings();
  });

  applyLanguage();
  scheduleReminderChecks();
});
