(function (global) {
  "use strict";

  var GUARDIANS = {
    prefix: { id: "prefix", name: "Приставка", emoji: "🚀", file: "prefix.jpg", color: "prefix" },
    root: { id: "root", name: "Корень", emoji: "🌳", file: "root.jpg", color: "root" },
    suffix: { id: "suffix", name: "Суффикс", emoji: "🛠️", file: "suffix.jpg", color: "suffix" },
    ending: { id: "ending", name: "Окончание", emoji: "🔲", file: "ending.jpg", color: "ending" },
    owl: { id: "owl", name: "Сова", emoji: "🦉", file: "", color: "owl" },
    team: { id: "team", name: "Команда слова", emoji: "🏆", file: "team.jpg", color: "team" }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function Renderer(root, game) {
    this.root = root;
    this.game = game;
    this.data = game.data;
    this.progress = game.progress;
    this.view = {};
    this.soundOn = game.progress.state.sound !== false;
    this.pendingMedal = null;
    this.parentExercise = null;
  }

  Renderer.prototype.el = function (id) {
    return this.root.querySelector("#" + id) || document.getElementById(id);
  };

  Renderer.prototype.showScreen = function (name) {
    var screens = this.root.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i += 1) {
      var screen = screens[i];
      var active = screen.getAttribute("data-screen") === name;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    }
  };

  Renderer.prototype.guardianMeta = function (id) {
    return GUARDIANS[id] || GUARDIANS.owl;
  };

  Renderer.prototype.characterUnlocked = function (id) {
    var medals = this.data.characterMedals || {};
    var medalId = medals[id];
    if (!medalId) return this.progress.hasProgress();
    return this.progress.hasMedal(medalId);
  };

  Renderer.prototype.portraitHtml = function (id, extraClass) {
    var meta = this.guardianMeta(id);
    var cls = "guardian-face guardian-" + meta.color + (extraClass ? " " + extraClass : "");
    if (!meta.file) {
      return '<div class="' + cls + ' owl-drawn" aria-hidden="true">' + meta.emoji + "</div>";
    }
    return (
      '<div class="' +
      cls +
      '">' +
      '<img class="guardian-photo" alt="' +
      escapeHtml(meta.name) +
      '" src="assets/characters/' +
      encodeURIComponent(meta.file.replace(".jpg", "")) +
      '.jpg" data-char="' +
      escapeHtml(id) +
      '">' +
      '<span class="guardian-fallback" hidden>' +
      meta.emoji +
      "</span></div>"
    );
  };

  Renderer.prototype.bindCharacterImages = function (scope) {
    var imgs = (scope || this.root).querySelectorAll("img.guardian-photo[data-char]");
    for (var i = 0; i < imgs.length; i += 1) {
      this.loadScene(imgs[i]);
    }
  };

  Renderer.prototype.setSpeech = function (text, guardian) {
    var who = guardian || "owl";
    var box = this.el("assistant");
    if (box) {
      box.setAttribute("data-guardian", who);
      var face = box.querySelector(".assistant-face");
      if (face) face.innerHTML = this.portraitHtml(who);
      this.bindCharacterImages(box);
    }
    var speech = this.el("owl-speech");
    if (speech) speech.textContent = text || "";
  };

  Renderer.prototype.setOwl = function (text) {
    var step = this.view && this.parentExercise ? this.playingStep() : null;
    var who = (step && step.guardian) || (this.parentExercise && this.parentExercise.guardian) || "owl";
    this.setSpeech(text, who);
  };

  Renderer.prototype.playingStep = function () {
    var parent = this.parentExercise;
    var steps = this.game.currentSteps();
    if (steps && this.view) return steps[this.view.step] || parent;
    return parent;
  };

  Renderer.prototype.sceneHtml = function (name, alt) {
    if (!name) return "";
    var meta = (this.data.scenes && this.data.scenes[name]) || {};
    var caption = meta.caption || "";
    var emoji = meta.emoji || "🌲";
    var label = alt || meta.alt || caption;
    return (
      '<figure class="scene-frame">' +
      '<img class="scene-photo" alt="' +
      escapeHtml(label) +
      '" src="assets/scenes/' +
      encodeURIComponent(name) +
      '.jpg" width="1400" height="788" decoding="async" data-scene="' +
      escapeHtml(name) +
      '">' +
      '<div class="scene-fallback" hidden data-scene="' +
      escapeHtml(name) +
      '">' +
      '<div class="hero">' +
      emoji +
      "</div>" +
      "<figcaption>" +
      escapeHtml(caption || label) +
      "</figcaption>" +
      "</div></figure>"
    );
  };

  Renderer.prototype.bindSceneImages = function (scope) {
    var imgs = (scope || this.root).querySelectorAll("img.scene-photo[data-scene], img.guardian-photo[data-char]");
    for (var i = 0; i < imgs.length; i += 1) this.loadScene(imgs[i]);
  };

  Renderer.prototype.loadScene = function (img) {
    var fallback = img.nextElementSibling;

    function showPhoto() {
      img.hidden = false;
      if (fallback) fallback.hidden = true;
    }

    function showFallback() {
      img.hidden = true;
      if (fallback) fallback.hidden = false;
    }

    img.addEventListener("load", showPhoto);
    img.addEventListener("error", showFallback);
    if (img.complete) {
      if (img.naturalWidth) showPhoto();
      else showFallback();
    }
  };

  Renderer.prototype.teamStripHtml = function (active) {
    var self = this;
    var medals = this.data.characterMedals || {};
    return (
      '<ol class="team-strip" aria-label="Команда слова">' +
      ForestGame.ORDER.map(function (id) {
        var meta = self.guardianMeta(id);
        var on = self.progress.hasMedal(medals[id]);
        var cls = "team-member team-" + id;
        if (on) cls += " is-color";
        if (active === id) cls += " is-active";
        return (
          '<li class="' +
          cls +
          '">' +
          self.portraitHtml(id, "tiny") +
          "<span>" +
          escapeHtml(meta.name) +
          "</span></li>"
        );
      }).join("") +
      "</ol>"
    );
  };

  Renderer.prototype.renderMenu = function () {
    this.showScreen("menu");
    var has = this.progress.hasProgress();
    this.el("btn-continue").hidden = !has;
    this.el("btn-reset").hidden = !has;
    var team = this.el("menu-team");
    if (team) {
      team.innerHTML = this.teamStripHtml();
      this.bindCharacterImages(team);
    }
    var cardBtn = this.el("btn-team-card");
    if (cardBtn) {
      var done = this.progress.firstOpenId() === "finish";
      cardBtn.hidden = !done;
    }
  };

  Renderer.prototype.renderTopics = function () {
    this.showScreen("topics");
    var box = this.el("topic-list");
    box.innerHTML = this.data.topics
      .map(function (topic) {
        var inner =
          escapeHtml(topic.title) +
          "<small>" +
          escapeHtml(topic.subtitle || "") +
          "</small>";
        if (topic.href) {
          return '<a class="btn topic-btn" href="' + escapeHtml(topic.href) + '">' + inner + "</a>";
        }
        var locked = !topic.available;
        return (
          '<button type="button" class="btn topic-btn' +
          (locked ? " is-locked" : "") +
          '" data-action="' +
          (locked ? "noop" : "open-topic") +
          '" data-id="' +
          escapeHtml(topic.id) +
          '"' +
          (locked ? " disabled" : "") +
          ">" +
          inner +
          "</button>"
        );
      })
      .join("");
  };

  Renderer.prototype.renderTeamCard = function () {
    this.showScreen("team");
    var box = this.el("team-card-list");
    var notes = this.data.teamCard || [];
    var self = this;
    box.innerHTML = notes
      .map(function (card) {
        return (
          '<article class="team-note team-' +
          escapeHtml(card.id) +
          '">' +
          self.portraitHtml(card.id) +
          "<div><h3>" +
          escapeHtml(card.title) +
          "</h3><p>" +
          escapeHtml(card.text) +
          "</p></div></article>"
        );
      })
      .join("");
    this.bindCharacterImages(box);
  };

  Renderer.prototype.renderMap = function () {
    this.showScreen("map");
    this.el("map-stars").textContent = "★ " + this.progress.state.totalStars;
    var current = this.progress.firstOpenId();
    var self = this;
    var strip = this.el("map-team");
    if (strip) {
      strip.innerHTML = this.teamStripHtml();
      this.bindCharacterImages(strip);
    }
    this.el("trail").innerHTML = this.progress
      .trail()
      .map(function (node) {
        if (node.kind === "bridge") {
          return (
            '<li class="trail-bridge zone-' +
            escapeHtml(node.zone || "root") +
            '">' +
            node.icon +
            " " +
            escapeHtml(node.title) +
            "</li>"
          );
        }
        var unlocked = self.progress.isUnlocked(node.id);
        var done =
          node.kind === "start" ||
          (node.kind === "finish"
            ? current === "finish"
            : self.progress.isCompleted(node.id));
        var isCurrent = node.id === current || (current === "finish" && node.kind === "finish" && done);
        var stars = node.kind ? "" : self.starString(self.progress.starsFor(node.id));
        var cls = "trail-stop";
        if (done) cls += " is-done";
        if (isCurrent && node.kind !== "start") cls += " is-current";
        if (!unlocked) cls += " is-locked";
        if (node.zone) cls += " zone-" + node.zone;
        var action = "noop";
        if (unlocked && !node.kind) action = "play";
        if (node.kind === "finish" && done) action = "finish";
        var canPress = action !== "noop";
        return (
          '<li class="' +
          cls +
          '">' +
          '<div class="trail-dot">' +
          node.icon +
          "</div>" +
          '<button type="button" class="btn trail-btn" data-action="' +
          action +
          '" data-id="' +
          escapeHtml(node.id) +
          '"' +
          (canPress ? "" : " disabled") +
          ">" +
          escapeHtml(node.title) +
          "</button>" +
          "<span>" +
          stars +
          "</span></li>"
        );
      })
      .join("");
  };

  Renderer.prototype.starString = function (count) {
    if (!count) return "";
    return "★".repeat(count);
  };

  Renderer.prototype.prepareFooter = function (midRound) {
    var btn = this.el("game-footer").querySelector("button");
    if (!btn) return;
    if (midRound) {
      btn.setAttribute("data-action", "round-next");
      btn.textContent = "Дальше";
    } else {
      btn.setAttribute("data-action", "next");
      btn.textContent = "Дальше →";
    }
  };

  Renderer.prototype.renderExercise = function (id) {
    var exercise = this.game.begin(id);
    if (!exercise) return;
    this.showScreen("game");
    this.prepareFooter(false);
    this.el("game-footer").hidden = true;
    var ids = this.progress.exerciseIds();
    var index = ids.indexOf(id) + 1;
    this.el("progress-label").textContent = index
      ? "Задание " + index + " из " + ids.length
      : "Дополнительная проверка";
    this.view = { id: id, step: 0, type: exercise.type, selected: null, extra: {} };
    this.renderPlaying();
    this.updateSoundButton();
  };

  Renderer.prototype.renderPlaying = function () {
    var parent = this.game.exercise(this.view.id);
    var steps = this.game.currentSteps();
    var step = steps ? steps[this.view.step] : parent;
    this.parentExercise = parent;
    this.view.type = step.type;
    this.view.selected = null;
    this.view.chosen = {};
    this.view.placed = {};
    this.view.left = null;
    this.view.matchCount = 0;
    this.view.builder = [];
    this.view.mark = [];
    var who = step.guardian || parent.guardian || "owl";
    this.setSpeech(step.owl || parent.owl || "Давай попробуем!", who);
    var html = this.teamStripHtml(who);
    if (steps) {
      var room = step.roomTitle ? '<span class="room-name">' + escapeHtml(step.roomTitle) + "</span> · " : "";
      html +=
        '<p class="round-label">' +
        room +
        "Шаг " +
        (this.view.step + 1) +
        " из " +
        steps.length +
        "</p>";
    }
    html += this.renderByType(step);
    this.el("exercise").innerHTML = html;
    this.bindSceneImages(this.el("exercise"));
    this.bindCharacterImages(this.el("exercise"));
  };

  Renderer.prototype.renderByType = function (exercise) {
    switch (exercise.type) {
      case "singleChoice":
        return this.renderSingleChoice(exercise);
      case "brokenMachine":
        return this.renderBrokenMachine(exercise);
      case "insertWord":
        return this.renderInsertWord(exercise);
      case "classification":
        return this.renderClassification(exercise);
      case "findMultiple":
      case "wordFamily":
      case "wordForm":
        return this.renderFindMultiple(exercise);
      case "markWordPart":
        return this.renderMarkWordPart(exercise);
      case "matchPairs":
        return this.renderMatchPairs(exercise);
      case "sceneChoice":
      case "prefixMove":
        return this.renderSceneChoice(exercise);
      case "sceneMultiple":
        return this.renderSceneMultiple(exercise);
      case "meetCharacter":
        return this.renderMeet(exercise);
      case "wordFamilyTree":
        return this.renderFamilyTree(exercise);
      case "hideRoot":
        return this.renderHideRoot(exercise);
      case "formDress":
        return this.renderFormDress(exercise);
      case "suffixMachine":
        return this.renderSuffixMachine(exercise);
      case "placeTeam":
        return this.renderPlaceTeam(exercise);
      case "wordBuilder":
        return this.renderWordBuilder(exercise);
      case "parseChoices":
        return this.renderParseChoices(exercise);
      case "sendPart":
        return this.renderSendPart(exercise);
      default:
        return "<p>Неизвестный тип задания.</p>";
    }
  };

  Renderer.prototype.miniScene = function (name, label) {
    if (!name) return "";
    var meta = (this.data.scenes && this.data.scenes[name]) || {};
    var emoji = meta.emoji || "🌲";
    var text = label || meta.alt || meta.caption || name;
    return (
      '<span class="mini-scene">' +
      '<img class="scene-photo" alt="' +
      escapeHtml(text) +
      '" src="assets/scenes/' +
      encodeURIComponent(name) +
      '.jpg" data-scene="' +
      escapeHtml(name) +
      '">' +
      '<span class="scene-fallback mini-fallback" hidden data-scene="' +
      escapeHtml(name) +
      '">' +
      emoji +
      "</span></span>"
    );
  };

  Renderer.prototype.titleBlock = function (exercise) {
    var parent = this.parentExercise || exercise;
    var title = exercise.title || parent.title || "";
    var question = exercise.question || "";
    var gallery = exercise.gallery || [];
    var galleryHtml = gallery.length
      ? '<div class="scene-gallery">' +
        gallery
          .map(function (name) {
            return this.miniScene(name, name);
          }, this)
          .join("") +
        "</div>"
      : "";
    var scene = !gallery.length ? exercise.scene || parent.scene : "";
    if (exercise.scene === false) scene = "";
    return (
      "<h1>" +
      escapeHtml(title) +
      "</h1>" +
      (scene ? this.sceneHtml(scene, title) : "") +
      galleryHtml +
      (exercise.prompt ? '<p class="word-hero">' + escapeHtml(exercise.prompt) + "</p>" : "") +
      this.groupsShowHtml(exercise.groupsShow) +
      this.coversHtml(exercise.covers, exercise.coverPrompt) +
      this.formsHtml(exercise.forms) +
      this.morphemePreview(exercise.wordPreview) +
      (exercise.quote
        ? '<blockquote class="char-quote">' + escapeHtml(exercise.quote) + "</blockquote>"
        : "") +
      (question ? '<p class="exercise-question">' + escapeHtml(question) + "</p>" : "")
    );
  };

  Renderer.prototype.groupsShowHtml = function (groups) {
    if (!groups || !groups.length) return "";
    return (
      '<div class="shown-groups">' +
      groups
        .map(function (group) {
          return (
            '<div class="shown-group"><h3>' +
            escapeHtml(group.title) +
            "</h3><p>" +
            group.words.map(escapeHtml).join(" · ") +
            "</p></div>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.morphemeWordHtml = function (word, options) {
    options = options || {};
    var parts = ForestGame.morphemesOf(word);
    if (!parts.length && word && word.text) {
      return '<div class="morph-word"><span class="morph morph-root">' + escapeHtml(word.text) + "</span></div>";
    }
    var hide = options.hide || [];
    var highlight = options.highlight || [];
    var clickable = options.clickable;
    var showEmpty = options.showEmpty;
    var html = '<div class="morph-word' + (options.react ? " is-react" : "") + '">';
    ForestGame.ORDER.forEach(function (type) {
      var part = null;
      for (var i = 0; i < parts.length; i += 1) {
        if (parts[i].type === type) part = parts[i];
      }
      if (!part && !showEmpty) return;
      var text = part ? part.text : "";
      var zero = part && part.zero;
      var missing = !part || (!text && !zero);
      if (missing && !showEmpty) return;
      var cls = "morph morph-" + type;
      if (hide.indexOf(type) !== -1) cls += " is-hidden";
      if (highlight.indexOf(type) !== -1) cls += " is-on";
      if (zero) cls += " is-zero";
      if (word && word.indeclinable && type === "ending") cls += " is-none";
      var label = text || (zero ? "□" : "—");
      if (clickable) {
        html +=
          '<button type="button" class="' +
          cls +
          '" data-action="pick-morph" data-type="' +
          type +
          '">' +
          escapeHtml(label) +
          "</button>";
      } else {
        html += '<span class="' + cls + '">' + escapeHtml(label) + "</span>";
      }
    });
    html += "</div>";
    if (options.legend !== false) {
      html +=
        '<p class="morph-legend"><span class="leg-prefix">приставка</span> · <span class="leg-root">корень</span> · <span class="leg-suffix">суффикс</span> · <span class="leg-ending">окончание</span></p>';
    }
    return html;
  };

  Renderer.prototype.morphemePreview = function (preview) {
    if (!preview) return "";
    var word = typeof preview === "string" ? this.game.lookupWord(preview) : preview;
    if (!word) return "";
    return this.morphemeWordHtml(word, { highlight: preview.highlight || [] });
  };

  Renderer.prototype.rootSpan = function (word, root) {
    var norm = ForestGame.normalize(word);
    var rootNorm = ForestGame.normalize(root);
    var at = norm.indexOf(rootNorm);
    if (at < 0 || !root) return escapeHtml(word);
    return (
      escapeHtml(word.slice(0, at)) +
      '<span class="root-letters">' +
      escapeHtml(word.slice(at, at + root.length)) +
      "</span>" +
      escapeHtml(word.slice(at + root.length))
    );
  };

  Renderer.prototype.coversHtml = function (covers, caption) {
    if (!covers || !covers.length) return "";
    function face(word, root) {
      var norm = ForestGame.normalize(word);
      var at = norm.indexOf(ForestGame.normalize(root));
      if (at < 0) return escapeHtml(word);
      var tail = word.slice(at + root.length);
      return (
        '<span class="covered-word"><span class="leaf-cover" aria-hidden="true">🍃</span><span class="covered-tail">' +
        escapeHtml(tail || " ") +
        "</span></span>"
      );
    }
    return (
      '<div class="cover-list">' +
      (caption ? '<p class="cover-prompt">' + escapeHtml(caption) + "</p>" : "") +
      covers
        .map(function (pair) {
          return (
            '<div class="cover-pair">' +
            face(pair.left, pair.root) +
            '<span class="arrow">—</span>' +
            face(pair.right, pair.root) +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.highlightPartHtml = function (word, part) {
    var text = word || "";
    var mark = part || "";
    if (!text) return "";
    var at = ForestGame.normalize(text).indexOf(ForestGame.normalize(mark));
    var inner;
    if (at < 0 || !mark) {
      inner = escapeHtml(text);
    } else {
      inner =
        escapeHtml(text.slice(0, at)) +
        '<span class="part-mark">' +
        escapeHtml(text.slice(at, at + mark.length)) +
        "</span>" +
        escapeHtml(text.slice(at + mark.length));
    }
    return '<p class="word-hero word-with-part">' + inner + "</p>";
  };

  Renderer.prototype.tipsHtml = function (exercise) {
    var tips = exercise.tips || (this.parentExercise && this.parentExercise.tips);
    if (!tips || !tips.length) return "";
    return (
      '<div class="tips-box">' +
      tips
        .map(function (tip) {
          return (
            '<p><strong>' +
            escapeHtml(tip.title) +
            ":</strong> " +
            escapeHtml(tip.text) +
            "</p>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.brokenWordHtml = function (exercise) {
    var chunks = exercise.chunks;
    if (!chunks || !chunks.length) {
      return exercise.prompt ? '<p class="word-hero">' + escapeHtml(exercise.prompt) + "</p>" : "";
    }
    return (
      '<p class="word-hero broken-word">' +
      chunks
        .map(function (chunk, index) {
          var sep = index ? '<span class="broken-sep">|</span>' : "";
          return (
            sep +
            '<span class="broken-chunk" data-ok="' +
            (chunk.ok ? "1" : "0") +
            '">' +
            escapeHtml(chunk.text) +
            "</span>"
          );
        })
        .join("") +
      "</p>"
    );
  };

  Renderer.prototype.formsHtml = function (forms) {
    if (!forms || !forms.length) return "";
    var self = this;
    return (
      '<div class="form-row">' +
      forms
        .map(function (item) {
          if (item.root) {
            return '<span class="static-word">' + self.rootSpan(item.word, item.root) + "</span>";
          }
          var ending = item.ending || "";
          var stem = ending ? item.word.slice(0, item.word.length - ending.length) : item.word;
          return (
            '<span class="static-word"><span class="root-letters">' +
            escapeHtml(stem) +
            '</span><span class="ending-letters' +
            (ending ? "" : " is-zero") +
            '">' +
            escapeHtml(ending || "□") +
            "</span></span>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.letterRow = function (word) {
    return (
      '<div class="letter-row">' +
      String(word)
        .split("")
        .map(function (letter, index) {
          return (
            '<button type="button" class="letter" data-action="mark-letter" data-index="' +
            index +
            '">' +
            escapeHtml(letter) +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.renderMarkWordPart = function (exercise) {
    this.view.mark = [];
    var ask =
      exercise.question ||
      (exercise.part === "ending"
        ? "Нажми первую и последнюю букву окончания. Для одной буквы нажми её дважды."
        : exercise.part === "prefix"
          ? "Нажми первую и последнюю букву приставки."
          : exercise.part === "suffix"
            ? "Нажми первую и последнюю букву суффикса."
            : "Нажми первую и последнюю букву корня.");
    var copy = {
      title: exercise.title,
      scene: exercise.scene,
      gallery: exercise.gallery,
      prompt: exercise.prompt,
      question: ask
    };
    return this.titleBlock(copy) + this.letterRow(exercise.word);
  };

  Renderer.prototype.paintMorpheme = function (exercise) {
    var row = this.el("exercise").querySelector(".letter-row");
    if (!row || !exercise.answer) return;
    var letters = row.querySelectorAll(".letter");
    var from = Number(exercise.answer[0]);
    var to = Number(exercise.answer[1]);
    var first = letters[from];
    var last = letters[to];
    if (!first || !last) return;
    var rowRect = row.getBoundingClientRect();
    var aRect = first.getBoundingClientRect();
    var bRect = last.getBoundingClientRect();
    var mark = document.createElement("span");
    var part = exercise.part || "root";
    mark.className = "morph-paint morph-paint-" + part;
    mark.style.left = aRect.left - rowRect.left + "px";
    mark.style.width = Math.max(12, bRect.right - aRect.left) + "px";
    if (part === "ending") {
      mark.style.top = aRect.top - rowRect.top - 4 + "px";
      mark.style.height = aRect.height + 8 + "px";
    } else if (part === "suffix") {
      mark.style.top = aRect.bottom - rowRect.top + 2 + "px";
    } else {
      mark.style.top = aRect.top - rowRect.top - 14 + "px";
    }
    row.appendChild(mark);
  };

  Renderer.prototype.highlightFamily = function (exercise) {
    if (!exercise.root) return;
    var nodes = this.el("exercise").querySelectorAll(".token.is-correct, .tree-leaf.is-correct");
    for (var i = 0; i < nodes.length; i += 1) {
      var text = nodes[i].getAttribute("data-text");
      var picture = nodes[i].querySelector(".mini-scene");
      nodes[i].innerHTML = (picture ? picture.outerHTML : "") + this.rootSpan(text, exercise.root);
    }
    this.el("exercise").insertAdjacentHTML(
      "beforeend",
      '<p class="term-banner">Корень: <span class="root-letters">' +
        escapeHtml((exercise.root || "").toUpperCase()) +
        "</span></p>"
    );
  };

  Renderer.prototype.labelGroupRoots = function (exercise) {
    var groups = exercise.groups || [];
    for (var i = 0; i < groups.length; i += 1) {
      if (!groups[i].root) continue;
      var title = this.el("exercise").querySelector('.basket[data-id="' + groups[i].id + '"] h3');
      if (!title || title.parentNode.querySelector(".root-name")) continue;
      title.insertAdjacentHTML(
        "afterend",
        '<p class="root-name">корень <span class="root-letters">' + escapeHtml(groups[i].root) + "</span></p>"
      );
    }
  };

  Renderer.prototype.optionButtons = function (options, action) {
    return (
      '<div class="answers">' +
      options
        .map(function (option) {
          return (
            '<button type="button" class="answer" data-action="' +
            action +
            '" data-value="' +
            escapeHtml(option) +
            '">' +
            escapeHtml(option) +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.renderSingleChoice = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    return (
      this.titleBlock(exercise) +
      (exercise.sentence ? '<div class="sentence" id="sentence-view">' + escapeHtml(exercise.sentence) + "</div>" : "") +
      this.optionButtons(this.view.options, "choose") +
      this.tipsHtml(exercise)
    );
  };

  Renderer.prototype.renderBrokenMachine = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    var copy = Object.assign({}, exercise, { prompt: "" });
    return (
      this.titleBlock(copy) +
      this.brokenWordHtml(exercise) +
      this.optionButtons(this.view.options, "choose")
    );
  };

  Renderer.prototype.renderInsertWord = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    return (
      this.titleBlock(exercise) +
      '<div class="sentence" id="sentence-view">' +
      this.blankHtml(exercise.sentence, "□") +
      "</div>" +
      this.optionButtons(this.view.options, "choose")
    );
  };

  Renderer.prototype.blankHtml = function (sentence, fill) {
    return escapeHtml(sentence).replace("□", '<span class="slot">' + escapeHtml(fill) + "</span>");
  };

  Renderer.prototype.renderClassification = function (exercise) {
    this.view.placed = {};
    this.view.selected = null;
    var items = ForestGame.shuffle(exercise.items.slice());
    var self = this;
    var wrap = exercise.compact ? "class-compact" : "";
    return (
      this.titleBlock(exercise) +
      '<div class="' +
      wrap +
      '"><div class="word-bank" id="class-bank">' +
      items
        .map(function (item) {
          var face = item.scene ? self.miniScene(item.scene) : "";
          return (
            '<button type="button" class="sentence-card" data-action="pick-item" data-id="' +
            escapeHtml(item.id) +
            '">' +
            face +
            escapeHtml(item.text) +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="baskets' +
      (exercise.groups.length > 2 ? " baskets-many" : "") +
      '">' +
      exercise.groups
        .map(function (group) {
          return (
            '<div class="basket" role="button" tabindex="0" data-action="put-basket" data-id="' +
            escapeHtml(group.id) +
            '"><h3>' +
            escapeHtml(group.title) +
            '</h3><div data-drop="' +
            escapeHtml(group.id) +
            '"></div></div>'
          );
        })
        .join("") +
      "</div></div>"
    );
  };

  Renderer.prototype.renderFindMultiple = function (exercise) {
    this.view.selected = [];
    var tokens = ForestGame.shuffle(exercise.tokens.slice());
    return (
      this.titleBlock(exercise) +
      (exercise.sentence ? '<div class="sentence">' + escapeHtml(exercise.sentence) + "</div>" : "") +
      '<div class="tokens" id="tokens">' +
      tokens
        .map(function (token, index) {
          var picture = token.scene ? this.miniScene(token.scene) : "";
          return (
            '<button type="button" class="token" data-action="toggle-token" data-index="' +
            index +
            '" data-text="' +
            escapeHtml(token.text) +
            '">' +
            picture +
            escapeHtml(token.text) +
            "</button>"
          );
        }, this)
        .join("") +
      "</div>" +
      '<div class="check-row"><button type="button" class="btn btn-primary" data-action="check-multiple">Готово</button></div>'
    );
  };

  Renderer.prototype.pairFace = function (item) {
    var picture = item.scene ? this.miniScene(item.scene) : "";
    var text = item.text ? "<span>" + escapeHtml(item.text) + "</span>" : "";
    return picture + text;
  };

  Renderer.prototype.renderMatchPairs = function (exercise) {
    this.view.chosen = {};
    this.view.left = null;
    var left = ForestGame.shuffle(exercise.left.slice());
    var right = ForestGame.shuffle(exercise.right.slice());
    var self = this;
    return (
      this.titleBlock(exercise) +
      '<div class="pair-columns">' +
      '<div class="pair-col" id="pair-left">' +
      left
        .map(function (item) {
          return (
            '<button type="button" class="pair-item" data-action="pair-left" data-id="' +
            escapeHtml(item.id) +
            '">' +
            self.pairFace(item) +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="pair-col" id="pair-right">' +
      right
        .map(function (item) {
          return (
            '<button type="button" class="pair-item" data-action="pair-right" data-id="' +
            escapeHtml(item.id) +
            '">' +
            self.pairFace(item) +
            "</button>"
          );
        })
        .join("") +
      "</div></div>"
    );
  };

  Renderer.prototype.renderSceneChoice = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    var self = this;
    return (
      this.titleBlock(exercise) +
      '<div class="scene-choices' +
      (this.view.options.length <= 2 ? " scene-choices-pair" : "") +
      '">' +
      this.view.options
        .map(function (option) {
          var label = option.label || "";
          return (
            '<button type="button" class="scene-choice answer" data-action="choose" data-value="' +
            escapeHtml(option.id) +
            '">' +
            (option.scene ? self.miniScene(option.scene) : "") +
            (option.showLabel === false ? "" : '<span class="choice-label">' + escapeHtml(label) + "</span>") +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.renderSceneMultiple = function (exercise) {
    this.view.selected = [];
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    var self = this;
    return (
      this.titleBlock(exercise) +
      '<div class="scene-choices" id="scene-multi">' +
      this.view.options
        .map(function (option) {
          var label = option.label || "";
          return (
            '<button type="button" class="scene-choice answer" aria-pressed="false" data-action="toggle-scene" data-value="' +
            escapeHtml(option.id) +
            '">' +
            self.miniScene(option.scene) +
            (option.showLabel === false ? "" : '<span class="choice-label">' + escapeHtml(label) + "</span>") +
            "</button>"
          );
        })
        .join("") +
      '</div><div class="check-row"><button type="button" class="btn btn-primary" data-action="check-scenes">Готово</button></div>'
    );
  };

  Renderer.prototype.renderMeet = function (exercise) {
    return (
      this.titleBlock(exercise) +
      '<div class="meet-hero">' +
      this.portraitHtml(exercise.guardian || "root", "meet") +
      "</div>" +
      '<div class="check-row"><button type="button" class="btn btn-primary answer" data-action="choose" data-value="ok">Я запомнил</button></div>'
    );
  };

  Renderer.prototype.renderFamilyTree = function (exercise) {
    this.view.selected = [];
    var tokens = ForestGame.shuffle(exercise.tokens.slice());
    return (
      this.titleBlock(exercise) +
      '<div class="family-tree">' +
      '<div class="tree-root-word">' +
      escapeHtml(exercise.center || "") +
      "</div>" +
      '<div class="tree-leaves" id="tokens">' +
      tokens
        .map(function (token, index) {
          var picture = token.scene ? this.miniScene(token.scene) : "";
          return (
            '<button type="button" class="token tree-leaf" data-action="toggle-token" data-index="' +
            index +
            '" data-text="' +
            escapeHtml(token.text) +
            '">' +
            picture +
            escapeHtml(token.text) +
            "</button>"
          );
        }, this)
        .join("") +
      "</div></div>" +
      '<div class="check-row"><button type="button" class="btn btn-primary" data-action="check-multiple">Присоединить к дереву</button></div>'
    );
  };

  Renderer.prototype.renderHideRoot = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    return this.titleBlock(exercise) + this.optionButtons(this.view.options, "choose");
  };

  Renderer.prototype.renderFormDress = function (exercise) {
    var endings = ForestGame.shuffle(exercise.endings.slice());
    this.view.ending = "";
    return (
      this.titleBlock(exercise) +
      '<div class="dress-stage">' +
      '<p class="stem-word"><span class="root-letters">' +
      escapeHtml(exercise.stem) +
      '</span><span class="ending-letters" id="dress-ending">□</span></p>' +
      this.portraitHtml("ending", "dress") +
      "</div>" +
      '<div class="word-bank" id="ending-bank">' +
      endings
        .map(function (item) {
          return (
            '<button type="button" class="chip costume" data-action="dress-ending" data-value="' +
            escapeHtml(item) +
            '">' +
            escapeHtml(item || "□") +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.renderSuffixMachine = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    var self = this;
    return (
      this.titleBlock(exercise) +
      '<p class="word-hero">' +
      escapeHtml(exercise.base || "") +
      "</p>" +
      '<div class="scene-choices">' +
      this.view.options
        .map(function (option) {
          return (
            '<button type="button" class="scene-choice answer" data-action="choose" data-value="' +
            escapeHtml(option.id) +
            '">' +
            (option.scene ? self.miniScene(option.scene) : "") +
            '<span class="choice-label">' +
            escapeHtml(option.label) +
            "</span><small>" +
            escapeHtml(option.suffix || "") +
            "</small></button>"
          );
        })
        .join("") +
      "</div>"
    );
  };

  Renderer.prototype.renderPlaceTeam = function (exercise) {
    this.view.placed = {};
    this.view.selected = null;
    var word = exercise.word || this.game.lookupWord(exercise.wordId);
    var parts = ForestGame.shuffle(ForestGame.morphemesOf(word).slice());
    var self = this;
    return (
      this.titleBlock(exercise) +
      '<p class="word-hero">' +
      escapeHtml(word.text) +
      "</p>" +
      '<p class="morph-legend"><span class="leg-prefix">приставка</span> · <span class="leg-root">корень</span> · <span class="leg-suffix">суффикс</span> · <span class="leg-ending">окончание</span></p>' +
      '<div class="word-bank" id="morph-bank">' +
      parts
        .map(function (part) {
          var key = part.type + ":" + (part.text || "");
          var label = part.zero ? "□" : part.text;
          return (
            '<button type="button" class="chip morph-chip morph-' +
            part.type +
            '" data-action="pick-part" data-id="' +
            escapeHtml(key) +
            '">' +
            escapeHtml(label) +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="team-slots">' +
      ForestGame.ORDER.map(function (id) {
        var meta = self.guardianMeta(id);
        return (
          '<button type="button" class="slot-card team-' +
          id +
          '" data-action="put-part" data-id="' +
          id +
          '">' +
          self.portraitHtml(id, "tiny") +
          "<strong>" +
          escapeHtml(meta.name) +
          '</strong><div data-drop="' +
          id +
          '"></div></button>'
        );
      }).join("") +
      "</div>"
    );
  };

  Renderer.prototype.renderWordBuilder = function (exercise) {
    this.view.builder = [];
    var word = exercise.word || this.game.lookupWord(exercise.wordId);
    var bank = ForestGame.shuffle((exercise.parts || ForestGame.morphemesOf(word)).slice());
    if (exercise.distractors) bank = ForestGame.shuffle(bank.concat(exercise.distractors));
    return (
      this.titleBlock(exercise) +
      '<div class="builder-line" id="builder-line">Собери слово здесь</div>' +
      '<div class="word-bank" id="builder-bank">' +
      bank
        .map(function (part, index) {
          return (
            '<button type="button" class="chip morph-chip morph-' +
            part.type +
            '" data-action="build-part" data-index="' +
            index +
            '" data-type="' +
            part.type +
            '" data-text="' +
            escapeHtml(part.text || "") +
            '">' +
            escapeHtml(part.text || "□") +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="check-row"><button type="button" class="btn btn-ghost" data-action="builder-reset">Сбросить</button></div>'
    );
  };

  Renderer.prototype.renderParseChoices = function (exercise) {
    this.view.chosen = {};
    var keys = [
      { id: "prefix", title: "Приставка" },
      { id: "root", title: "Корень" },
      { id: "suffix", title: "Суффикс" },
      { id: "ending", title: "Окончание" }
    ];
    var options = exercise.options || {};
    return (
      this.titleBlock(exercise) +
      '<div class="parse-grid">' +
      keys
        .map(function (key) {
          var list = (options[key.id] || []).slice();
          return (
            '<fieldset class="parse-field team-' +
            key.id +
            '"><legend>' +
            escapeHtml(key.title) +
            "</legend>" +
            list
              .map(function (opt) {
                return (
                  '<button type="button" class="chip" data-action="parse-pick" data-role="' +
                  key.id +
                  '" data-value="' +
                  escapeHtml(opt) +
                  '">' +
                  escapeHtml(opt) +
                  "</button>"
                );
              })
              .join("") +
            "</fieldset>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="check-row"><button type="button" class="btn btn-primary" data-action="check-parse">Готово</button></div>'
    );
  };

  Renderer.prototype.renderSendPart = function (exercise) {
    this.view.options = ForestGame.shuffle(exercise.options.slice());
    var head = Object.assign({}, exercise, { prompt: "" });
    return (
      this.titleBlock(head) +
      '<div class="send-stage">' +
      '<button type="button" class="slot-card team-prefix" data-action="choose" data-value="prefix">' +
      this.portraitHtml("prefix", "tiny") +
      "<strong>Приставка</strong></button>" +
      this.highlightPartHtml(exercise.word || exercise.prompt, exercise.part) +
      '<button type="button" class="slot-card team-suffix" data-action="choose" data-value="suffix">' +
      this.portraitHtml("suffix", "tiny") +
      "<strong>Суффикс</strong></button>" +
      "</div>"
    );
  };

  Renderer.prototype.optionIsCorrect = function (exercise, value) {
    if (exercise.answers) return exercise.answers.indexOf(value) !== -1;
    return this.game.checkSingle(exercise, value);
  };

  Renderer.prototype.applyHint = function (exercise, parent) {
    var level = this.game.hintLevel;
    this.setOwl("Попробуй ещё раз. " + this.game.hintText(exercise, parent || this.parentExercise));
    if (level >= 2) this.reduceOptions(exercise);
    if (level >= 3) this.glowCorrect(exercise);
  };

  Renderer.prototype.reduceOptions = function (exercise) {
    var answers = this.el("exercise").querySelectorAll(".answer");
    var hidden = 0;
    for (var i = 0; i < answers.length; i += 1) {
      var value = answers[i].getAttribute("data-value");
      var correct = this.optionIsCorrect(exercise, value);
      if (!correct && hidden === 0 && answers.length > 2) {
        answers[i].classList.add("is-disabled");
        answers[i].disabled = true;
        hidden += 1;
      }
    }
  };

  Renderer.prototype.glowCorrect = function (exercise) {
    var type = exercise.type;
    var root = this.el("exercise");
    if (
      type === "singleChoice" ||
      type === "insertWord" ||
      type === "sceneChoice" ||
      type === "prefixMove" ||
      type === "brokenMachine" ||
      type === "hideRoot" ||
      type === "suffixMachine" ||
      type === "sendPart" ||
      type === "formDress"
    ) {
      var answers = root.querySelectorAll(".answer, .costume");
      for (var i = 0; i < answers.length; i += 1) {
        if (this.optionIsCorrect(exercise, answers[i].getAttribute("data-value"))) {
          answers[i].classList.add("is-glow");
        }
      }
    }
    if (type === "sceneMultiple") {
      var pictures = root.querySelectorAll(".scene-choice");
      for (var s = 0; s < pictures.length; s += 1) {
        if (this.optionIsCorrect(exercise, pictures[s].getAttribute("data-value"))) {
          pictures[s].classList.add("is-glow");
        }
      }
    }
    if (type === "matchPairs" && this.view.left && exercise.pairs) {
      var rightId = exercise.pairs[this.view.left];
      var pairNode = root.querySelector('#pair-right .pair-item[data-id="' + rightId + '"]');
      if (pairNode) pairNode.classList.add("is-glow");
    }
    if (type === "findMultiple" || type === "wordFamily" || type === "wordForm" || type === "wordFamilyTree") {
      var needed = this.game.neededTexts(exercise);
      var buttons = root.querySelectorAll(".token");
      for (var t = 0; t < buttons.length; t += 1) {
        if (needed.indexOf(buttons[t].getAttribute("data-text")) !== -1) buttons[t].classList.add("is-glow");
      }
    }
    if (type === "markWordPart" && exercise.answer) {
      var letters = root.querySelectorAll(".letter");
      for (var m = Number(exercise.answer[0]); m <= Number(exercise.answer[1]); m += 1) {
        if (letters[m]) letters[m].classList.add("is-glow");
      }
    }
    if (type === "wordBuilder") {
      var word = exercise.word || this.game.lookupWord(exercise.wordId);
      var next = ForestGame.morphemesOf(word)[this.view.builder.length];
      var chips = root.querySelectorAll("#builder-bank .chip");
      for (var c = 0; c < chips.length; c += 1) {
        if (
          next &&
          chips[c].getAttribute("data-type") === next.type &&
          ForestGame.normalize(chips[c].getAttribute("data-text")) === ForestGame.normalize(next.text || "")
        ) {
          chips[c].classList.add("is-glow");
        }
      }
    }
    if (type === "placeTeam") {
      var slots = root.querySelectorAll(".slot-card");
      for (var p = 0; p < slots.length; p += 1) slots[p].classList.add("is-glow");
    }
  };

  Renderer.prototype.paintBrokenParts = function () {
    var nodes = this.el("exercise").querySelectorAll(".broken-chunk");
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i].getAttribute("data-ok") === "1") nodes[i].classList.add("is-ok");
      else nodes[i].classList.add("is-extra");
    }
  };

  Renderer.prototype.holdForNextRound = function (text, links) {
    this.setOwl(text || "Верно!");
    this.reactGuardians(this.playingStep());
    this.prepareFooter(true);
    this.el("game-footer").hidden = false;
    var buttons = this.el("exercise").querySelectorAll("button");
    for (var i = 0; i < buttons.length; i += 1) buttons[i].disabled = true;
    this.playTone(true);
  };

  Renderer.prototype.reactGuardians = function (exercise) {
    var who = (exercise && exercise.guardian) || (this.parentExercise && this.parentExercise.guardian);
    var strip = this.el("exercise").querySelector(".team-member.team-" + who);
    if (strip) strip.classList.add("is-happy");
    var face = this.el("assistant");
    if (face) face.classList.add("is-happy");
    var morph = this.el("exercise").querySelector(".morph-" + who);
    if (morph) morph.classList.add("is-on");
  };

  Renderer.prototype.succeed = function (exercise, extraHtml) {
    this.prepareFooter(false);
    this.setOwl(exercise.success || (this.parentExercise && this.parentExercise.success) || "Верно!");
    this.el("game-footer").hidden = false;
    this.reactGuardians(exercise);
    if (exercise.marks) {
      var sentence = this.el("sentence-view");
      if (sentence) sentence.innerHTML = this.highlightSentence(exercise.sentence, exercise.marks);
    }
    var parent = this.parentExercise || exercise;
    var extra = extraHtml || "";
    if (parent.term) extra += '<p class="term-banner">' + escapeHtml(parent.term) + "</p>";
    if (exercise.revealWord) {
      extra += this.morphemeWordHtml(
        typeof exercise.revealWord === "string" ? this.game.lookupWord(exercise.revealWord) : exercise.revealWord,
        { highlight: ForestGame.ORDER, legend: true }
      );
    }
    if (extra) this.el("exercise").insertAdjacentHTML("beforeend", extra);
    var buttons = this.el("exercise").querySelectorAll("button");
    for (var i = 0; i < buttons.length; i += 1) {
      if (buttons[i].getAttribute("data-action") !== "next") buttons[i].disabled = true;
    }
    this.playTone(true);
    this.popStars();
  };

  Renderer.prototype.highlightSentence = function (sentence, marks) {
    if (!sentence) return "";
    var html = escapeHtml(sentence);
    if (!marks) return html;
    Object.keys(marks).forEach(function (word) {
      var role = marks[word];
      var re = new RegExp("(" + escapeRegExp(escapeHtml(word)) + ")", "i");
      html = html.replace(re, '<span class="mark mark-' + role + '">$1</span>');
    });
    return html;
  };

  Renderer.prototype.fail = function (exercise, node, message) {
    this.game.registerMistake();
    if (node) {
      node.classList.add("is-wrong");
      var el = node;
      setTimeout(function () {
        el.classList.remove("is-wrong");
      }, 450);
    }
    this.playTone(false);
    if (message) this.setOwl(message);
    else this.applyHint(exercise, this.parentExercise);
  };

  Renderer.prototype.popStars = function () {
    var pop = document.createElement("div");
    pop.className = "star-pop";
    pop.textContent = "★";
    this.el("game-card").appendChild(pop);
    setTimeout(function () {
      pop.remove();
    }, 900);
  };

  Renderer.prototype.updateSoundButton = function () {
    var btn = this.el("btn-sound");
    if (btn) btn.textContent = this.soundOn ? "🔔" : "🔕";
  };

  Renderer.prototype.playTone = function (ok) {
    if (!this.soundOn || (!global.AudioContext && !global.webkitAudioContext)) return;
    try {
      var Ctx = global.AudioContext || global.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new Ctx();
      var ctx = this.audioCtx;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = ok ? "triangle" : "sine";
      osc.frequency.value = ok ? 660 : 220;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (ok ? 0.18 : 0.22));
    } catch (err) {
      /* ignore */
    }
  };

  Renderer.prototype.speak = function (exercise) {
    if (!global.speechSynthesis) {
      this.setOwl("В этом браузере нет чтения вслух, но задание видно на экране.");
      return;
    }
    var text = exercise.speak || [exercise.title, exercise.question, exercise.sentence, exercise.quote].filter(Boolean).join(". ");
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = 0.92;
    global.speechSynthesis.cancel();
    global.speechSynthesis.speak(utter);
  };

  Renderer.prototype.renderMedal = function (medal) {
    this.showScreen("medal");
    this.el("medal-icon").textContent = medal.icon;
    this.el("medal-title").textContent = medal.title;
    this.el("medal-text").textContent = medal.text || "Медаль «" + medal.title + "» теперь твоя!";
    var who = medal.character;
    var face = this.el("medal-face");
    if (face && who) {
      face.innerHTML = this.portraitHtml(who, "meet");
      this.bindCharacterImages(face);
    }
  };

  Renderer.prototype.renderFinish = function () {
    this.showScreen("finish");
    var finish = this.data.finish || {};
    if (finish.title && this.el("finish-title")) this.el("finish-title").textContent = finish.title;
    if (finish.lead && this.el("finish-lead")) this.el("finish-lead").textContent = finish.lead;
    this.el("finish-stars").textContent = "★ " + this.progress.state.totalStars;
    var scheme = this.el("finish-scheme");
    if (scheme && finish.schemeWord) {
      scheme.innerHTML = this.morphemeWordHtml(this.game.lookupWord(finish.schemeWord) || finish.schemeWord, {
        highlight: ForestGame.ORDER,
        legend: true
      });
    }
    var notes = finish.notes || [];
    var abilities = finish.abilities || [];
    if (this.el("finish-notes")) {
      this.el("finish-notes").innerHTML =
        abilities
          .map(function (item) {
            return '<li class="ability">' + item.icon + " " + escapeHtml(item.text) + "</li>";
          })
          .join("") +
        notes
          .map(function (note) {
            return (
              "<li><strong>" +
              escapeHtml(note.title) +
              "</strong><span>" +
              escapeHtml(note.text) +
              (note.example ? "</span><em>" + escapeHtml(note.example) + "</em>" : "</span>") +
              "</li>"
            );
          })
          .join("");
    }
    var medals = this.data.medals;
    var state = this.progress.state.medals;
    this.el("medal-shelf").innerHTML = medals
      .map(function (medal) {
        var got = state.indexOf(medal.id) !== -1;
        return "<li>" + medal.icon + " " + escapeHtml(medal.title) + (got ? "" : " (ещё впереди)") + "</li>";
      })
      .join("");
  };

  global.ForestRenderer = Renderer;
})(window);
