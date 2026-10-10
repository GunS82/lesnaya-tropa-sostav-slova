(function () {
  "use strict";

  var data = window.FOREST_DATA;
  if (!data) {
    document.body.innerHTML = "<p style='padding:24px;font-family:sans-serif'>Не найден файл data/content.js</p>";
    return;
  }

  var storage = new ForestStorage(data.storageKey || "forestWordPartsProgress");
  var progress = new ForestProgress(storage, data);
  var game = new ForestGame(data, progress);
  var ui = new ForestRenderer(document.getElementById("app"), game);

  function playing() {
    var ex = game.exercise(game.currentId);
    var steps = game.currentSteps();
    if (steps && ui.view) return steps[ui.view.step] || ex;
    return ex;
  }

  function afterStepSuccess() {
    var ex = game.exercise(game.currentId);
    var steps = game.currentSteps();
    if (steps && ui.view && !game.isFinishedStep(ex, ui.view.step)) {
      var step = steps[ui.view.step];
      ui.holdForNextRound(step.note || step.success || "Верно!", step.link || step.links);
      return;
    }
    afterSuccess();
    ui.succeed(playing());
  }

  function afterSuccess() {
    var stars = game.completeCurrent();
    var medal = game.medalFor(game.currentId);
    ui.view.stars = stars;
    if (medal && progress.awardMedal(medal.id)) {
      ui.pendingMedal = medal;
    } else {
      ui.pendingMedal = null;
    }
  }

  function goNext() {
    if (ui.pendingMedal) {
      var medal = ui.pendingMedal;
      ui.pendingMedal = null;
      ui.renderMedal(medal);
      return;
    }
    var next = progress.firstOpenId();
    if (next === "finish") {
      ui.renderFinish();
      return;
    }
    ui.renderMap();
  }

  function onChoose(value, node) {
    var ex = playing();
    if (game.checkSingle(ex, value)) {
      node.classList.add("is-correct");
      if (ex.type === "insertWord") {
        var view = document.getElementById("sentence-view");
        if (view) view.innerHTML = ui.blankHtml(ex.sentence, value);
      }
      if (ex.type === "formDress") {
        var dress = document.getElementById("dress-ending");
        if (dress) dress.textContent = value;
      }
      afterStepSuccess();
    } else {
      ui.fail(ex, node);
    }
  }

  function onToggleToken(index, node) {
    var text = node.getAttribute("data-text");
    var selected = ui.view.selected || [];
    ui.view.selected = selected;
    var at = selected.indexOf(text);
    if (at === -1) {
      selected.push(text);
      node.classList.add("is-selected");
    } else {
      selected.splice(at, 1);
      node.classList.remove("is-selected");
    }
  }

  function clearLetterPicks() {
    var letters = document.querySelectorAll(".letter");
    for (var i = 0; i < letters.length; i += 1) letters[i].classList.remove("is-picked");
  }

  function onMarkLetter(index, node) {
    var ex = playing();
    var mark = ui.view.mark || [];
    if (mark.length >= 2) {
      mark = [];
      clearLetterPicks();
    }
    mark.push(Number(index));
    ui.view.mark = mark;
    node.classList.add("is-picked");
    if (mark.length < 2) return;
    if (game.checkWordPart(ex, mark[0], mark[1])) {
      ui.paintMorpheme(ex);
      afterStepSuccess();
      return;
    }
    ui.fail(ex, node);
    ui.view.mark = [];
    clearLetterPicks();
    if (game.hintLevel >= 3) ui.glowCorrect(ex);
  }

  function onCheckMultiple() {
    var ex = playing();
    var result =
      ex.type === "wordFamily" || ex.type === "wordForm" || ex.type === "wordFamilyTree"
        ? game.checkWordFamily(ex, ui.view.selected || [])
        : game.checkMultiple(ex, ui.view.selected || []);
    if (result.ok) {
      var tokens = document.querySelectorAll(".token");
      for (var i = 0; i < tokens.length; i += 1) {
        if (tokens[i].classList.contains("is-selected")) tokens[i].classList.add("is-correct");
      }
      if (ex.type === "wordFamily" || ex.type === "wordFamilyTree") ui.highlightFamily(ex);
      afterStepSuccess();
      return;
    }
    var message =
      result.reason === "main"
        ? ex.extraHint || "Попробуй ещё раз. Здесь есть лишнее слово."
        : ex.missingHint || "Попробуй ещё раз. Выбери все нужные слова.";
    ui.fail(ex, document.getElementById("tokens"), message);
    if (game.hintLevel >= 3) ui.glowCorrect(ex);
  }

  function onPickItem(id, node) {
    ui.view.selected = id;
    var cards = document.querySelectorAll(".sentence-card");
    for (var i = 0; i < cards.length; i += 1) cards[i].classList.remove("is-selected");
    node.classList.add("is-selected");
  }

  function onPutBasket(groupId) {
    var ex = playing();
    var itemId = ui.view.selected;
    if (!itemId) {
      ui.setOwl("Сначала нажми карточку, потом корзину.");
      return;
    }
    var item = ex.items.filter(function (entry) {
      return entry.id === itemId;
    })[0];
    var card = document.querySelector('.sentence-card[data-id="' + itemId + '"]');
    var allowed = item.groups ? item.groups : [item.group];
    if (allowed.indexOf(groupId) === -1) {
      ui.fail(ex, card);
      if (game.hintLevel >= 3) {
        var basket = document.querySelector('.basket[data-id="' + item.group + '"]');
        if (basket) basket.classList.add("is-glow");
      }
      return;
    }
    ui.view.placed[itemId] = groupId;
    var drop = document.querySelector('[data-drop="' + groupId + '"]');
    if (card && drop) {
      card.classList.remove("is-selected");
      card.disabled = true;
      drop.appendChild(card);
    }
    ui.view.selected = null;
    ui.setOwl(ex.owl);
    if (Object.keys(ui.view.placed).length === ex.items.length) {
      ui.labelGroupRoots(ex);
      afterStepSuccess();
    }
  }

  function onPairLeft(id, node) {
    ui.view.left = id;
    var items = document.querySelectorAll("#pair-left .pair-item");
    for (var i = 0; i < items.length; i += 1) {
      if (!items[i].classList.contains("is-matched")) items[i].classList.remove("is-selected");
    }
    node.classList.add("is-selected");
  }

  function onPairRight(id, node) {
    var ex = playing();
    var left = ui.view.left;
    if (!left) {
      ui.setOwl("Сначала нажми слово слева, потом пару справа.");
      return;
    }
    if (ex.pairs[left] === id) {
      ui.view.chosen[left] = id;
      var leftNode = document.querySelector('#pair-left .pair-item[data-id="' + left + '"]');
      if (leftNode) {
        leftNode.classList.add("is-matched", "is-correct");
        leftNode.classList.remove("is-selected");
        leftNode.disabled = true;
      }
      node.classList.add("is-matched", "is-correct");
      node.disabled = true;
      ui.view.matchCount = (ui.view.matchCount || 0) + 1;
      var mark = String(ui.view.matchCount);
      if (leftNode) leftNode.setAttribute("data-mark", mark);
      node.setAttribute("data-mark", mark);
      ui.view.left = null;
      if (game.checkPairs(ex, ui.view.chosen)) afterStepSuccess();
    } else {
      ui.fail(ex, node);
    }
  }

  function onToggleScene(value, node) {
    var selected = ui.view.selected || [];
    ui.view.selected = selected;
    var at = selected.indexOf(value);
    if (at === -1) {
      selected.push(value);
      node.classList.add("is-selected");
      node.setAttribute("aria-pressed", "true");
    } else {
      selected.splice(at, 1);
      node.classList.remove("is-selected");
      node.setAttribute("aria-pressed", "false");
    }
  }

  function onCheckScenes() {
    var ex = playing();
    var result = game.checkSceneMultiple(ex, ui.view.selected || []);
    if (result.ok) {
      var choices = document.querySelectorAll(".scene-choice.is-selected");
      for (var i = 0; i < choices.length; i += 1) choices[i].classList.add("is-correct");
      afterStepSuccess();
      return;
    }
    ui.fail(ex, document.getElementById("scene-multi"));
  }

  function onDress(value, node) {
    var ex = playing();
    var dress = document.getElementById("dress-ending");
    if (dress) dress.textContent = value;
    var face = document.querySelector(".guardian-ending");
    if (face) face.classList.add("is-change");
    if (game.checkFormDress(ex, value)) {
      node.classList.add("is-correct");
      afterStepSuccess();
    } else {
      ui.fail(ex, node);
    }
  }

  function onPickPart(id, node) {
    ui.view.selected = id;
    var chips = document.querySelectorAll("#morph-bank .chip");
    for (var i = 0; i < chips.length; i += 1) chips[i].classList.remove("is-selected");
    node.classList.add("is-selected");
  }

  function onPutPart(type, node) {
    var ex = playing();
    var key = ui.view.selected;
    if (!key) {
      ui.setOwl("Сначала нажми часть слова, потом персонажа.");
      return;
    }
    var expected = key.split(":")[0];
    var chip = document.querySelector('#morph-bank .chip[data-id="' + key + '"]');
    if (expected !== type) {
      ui.fail(ex, node);
      return;
    }
    ui.view.placed[key] = type;
    var drop = node.querySelector("[data-drop]");
    if (chip && drop) {
      chip.classList.remove("is-selected");
      chip.disabled = true;
      drop.appendChild(chip);
    }
    ui.view.selected = null;
    if (game.checkPlaceTeam(ex, ui.view.placed)) afterStepSuccess();
  }

  function onBuildPart(index, node) {
    var ex = playing();
    if (node.classList.contains("is-used")) return;
    var part = { type: node.getAttribute("data-type"), text: node.getAttribute("data-text") };
    if (!game.checkBuilderStep(ex, ui.view.builder, part)) {
      ui.fail(ex, node, "Сначала приставка, потом корень, потом суффикс, потом окончание.");
      return;
    }
    ui.view.builder = ui.view.builder.concat([part]);
    node.classList.add("is-used");
    var line = document.getElementById("builder-line");
    line.textContent = ui.view.builder
      .map(function (item) {
        return item.text;
      })
      .join("");
    var word = ex.word || game.lookupWord(ex.wordId);
    var needed = ForestGame.morphemesOf(word).filter(function (item) {
      return item.text;
    });
    if (ui.view.builder.length < needed.length) return;
    if (game.checkWordBuilder(ex, ui.view.builder)) {
      line.classList.add("is-correct");
      afterStepSuccess();
    } else {
      ui.fail(ex, line, "Слово собралось неверно. Сбрось и попробуй ещё раз.");
    }
  }

  function onBuilderReset() {
    ui.view.builder = [];
    var line = document.getElementById("builder-line");
    if (line) {
      line.textContent = "Собери слово здесь";
      line.classList.remove("is-correct");
    }
    var chips = document.querySelectorAll("#builder-bank .chip");
    for (var i = 0; i < chips.length; i += 1) chips[i].classList.remove("is-used", "is-glow");
  }

  function onParsePick(role, value, node) {
    ui.view.chosen[role] = value;
    var field = node.closest(".parse-field");
    var chips = field.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i += 1) chips[i].classList.remove("is-selected");
    node.classList.add("is-selected");
  }

  function onCheckParse() {
    var ex = playing();
    if (game.checkParseChoices(ex, ui.view.chosen || {})) {
      afterStepSuccess();
      return;
    }
    ui.fail(ex, document.querySelector(".parse-grid"));
    if (game.hintLevel >= 3) ui.glowCorrect(ex);
  }

  document.getElementById("app").addEventListener("click", function (event) {
    var btn = event.target.closest("[data-action]");
    if (!btn || btn.disabled) return;
    var action = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-id");

    switch (action) {
      case "start":
        progress.useTopic(progress.state.activeTopic || progress.defaultTopic());
        ui.renderMap();
        break;
      case "continue":
        if (!progress.state.activeTopic) progress.useTopic(progress.defaultTopic());
        ui.renderMap();
        break;
      case "topics":
        ui.renderTopics();
        break;
      case "home":
        ui.renderMenu();
        break;
      case "team-card":
        ui.renderTeamCard();
        break;
      case "reset":
        if (window.confirm("Начать тропу сначала? Звёзды и медали сбросятся.")) {
          progress.reset();
          ui.renderMenu();
        }
        break;
      case "open-topic":
        progress.useTopic(id);
        ui.renderMap();
        break;
      case "round-next":
        game.hintLevel = 0;
        ui.view.step += 1;
        ui.el("game-footer").hidden = true;
        ui.prepareFooter(false);
        ui.renderPlaying();
        break;
      case "toggle-scene":
        onToggleScene(btn.getAttribute("data-value"), btn);
        break;
      case "check-scenes":
        onCheckScenes();
        break;
      case "play":
        ui.renderExercise(id);
        break;
      case "to-map":
        ui.renderMap();
        break;
      case "finish":
        ui.renderFinish();
        break;
      case "challenge":
        ui.renderExercise("bonus_challenge");
        break;
      case "next":
        goNext();
        break;
      case "medal-continue":
        if (progress.firstOpenId() === "finish") ui.renderFinish();
        else ui.renderMap();
        break;
      case "speak":
        ui.speak(playing());
        break;
      case "toggle-sound":
        ui.soundOn = !ui.soundOn;
        progress.state.sound = ui.soundOn;
        progress.save();
        ui.updateSoundButton();
        break;
      case "choose":
        onChoose(btn.getAttribute("data-value"), btn);
        break;
      case "toggle-token":
        onToggleToken(btn.getAttribute("data-index"), btn);
        break;
      case "check-multiple":
        onCheckMultiple();
        break;
      case "mark-letter":
        onMarkLetter(btn.getAttribute("data-index"), btn);
        break;
      case "pick-item":
        onPickItem(id, btn);
        break;
      case "put-basket":
        onPutBasket(id);
        break;
      case "pair-left":
        onPairLeft(id, btn);
        break;
      case "pair-right":
        onPairRight(id, btn);
        break;
      case "dress-ending":
        onDress(btn.getAttribute("data-value"), btn);
        break;
      case "pick-part":
        onPickPart(id, btn);
        break;
      case "put-part":
        onPutPart(id, btn);
        break;
      case "build-part":
        onBuildPart(btn.getAttribute("data-index"), btn);
        break;
      case "builder-reset":
        onBuilderReset();
        break;
      case "parse-pick":
        onParsePick(btn.getAttribute("data-role"), btn.getAttribute("data-value"), btn);
        break;
      case "check-parse":
        onCheckParse();
        break;
      default:
        break;
    }
  });

  ui.soundOn = progress.state.sound !== false;
  ui.renderMenu();
})();
