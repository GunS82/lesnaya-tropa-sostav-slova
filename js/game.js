(function (global) {
  "use strict";

  var ORDER = ["prefix", "root", "suffix", "ending"];

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function normalize(text) {
    return String(text)
      .replace(/\s+/g, " ")
      .replace(/[!.?]+$/g, "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е");
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var left = a.slice().sort();
    var right = b.slice().sort();
    for (var i = 0; i < left.length; i += 1) {
      if (left[i] !== right[i]) return false;
    }
    return true;
  }

  function starsFromMistakes(mistakes, steps) {
    var room = Math.max(1, Math.floor((steps || 1) / 2));
    if (mistakes <= 0) return 3;
    if (mistakes <= room) return 2;
    return 1;
  }

  function morphemesOf(word) {
    if (!word) return [];
    if (word.morphemes) return word.morphemes.slice();
    return [];
  }

  function partOf(word, type) {
    var list = morphemesOf(word);
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].type === type) return list[i];
    }
    return null;
  }

  function joinMorphemes(list) {
    return list
      .map(function (part) {
        return part.text || "";
      })
      .join("");
  }

  function Game(data, progress) {
    this.data = data;
    this.progress = progress;
    this.currentId = null;
    this.mistakes = 0;
    this.hintLevel = 0;
    this.steps = null;
  }

  Game.prototype.exercise = function (id) {
    if (id === "bonus_challenge") {
      return {
        type: "quiz",
        title: "Ещё раз проверь себя",
        count: 8,
        pool: this.data.finalChallengePool,
        guardian: "owl",
        owl: "Восемь коротких вопросов после финиша.",
        hint: "Вспомни, зачем нужна каждая часть слова.",
        success: "Дополнительная проверка пройдена!"
      };
    }
    return this.data.exercises[id];
  };

  Game.prototype.begin = function (id) {
    this.currentId = id;
    this.mistakes = 0;
    this.hintLevel = 0;
    var exercise = this.exercise(id);
    this.steps = null;
    if (!exercise) return exercise;
    if (exercise.type === "quiz") {
      var count = exercise.count || exercise.pool.length;
      this.steps = shuffle(exercise.pool.slice()).slice(0, count);
    } else if (exercise.type === "examRooms") {
      this.steps = [];
      (exercise.rooms || []).forEach(function (room) {
        (room.questions || []).forEach(function (q) {
          var step = Object.assign({ roomId: room.id, roomTitle: room.title, guardian: room.guardian || q.guardian }, q);
          this.steps.push(step);
        }, this);
      }, this);
    } else if (exercise.type === "multiStep" || exercise.type === "rounds") {
      this.steps = exercise.steps || exercise.rounds;
    }
    return exercise;
  };

  Game.prototype.currentSteps = function () {
    return this.steps || null;
  };

  Game.prototype.stepCount = function (exercise) {
    if (!exercise) return 1;
    if (exercise.type === "rounds") return exercise.rounds.length;
    if (exercise.type === "multiStep") return exercise.steps.length;
    if (exercise.type === "quiz") return exercise.count || (exercise.pool ? exercise.pool.length : 1);
    if (exercise.type === "examRooms") {
      return (exercise.rooms || []).reduce(function (sum, room) {
        return sum + (room.questions || []).length;
      }, 0);
    }
    return 1;
  };

  Game.prototype.isFinishedStep = function (exercise, stepIndex) {
    return stepIndex >= this.stepCount(exercise) - 1;
  };

  Game.prototype.registerMistake = function () {
    this.mistakes += 1;
    this.hintLevel = Math.min(3, this.mistakes);
    return this.hintLevel;
  };

  Game.prototype.hintText = function (exercise, parent) {
    var hint2 = exercise.hint2 || (parent && parent.hint2);
    var hint = exercise.hint || (parent && parent.hint);
    if (this.hintLevel >= 2 && hint2) return hint2;
    if (hint) return hint;
    var who = (exercise && exercise.guardian) || (parent && parent.guardian);
    var fallback = {
      root: "Посмотри, какая часть повторяется у родственных слов.",
      ending: "Попробуй изменить форму слова. Что изменилось в конце?",
      prefix: "Я всегда стою перед Корнем.",
      suffix: "Ищи меня после Корня.",
      owl: "Попробуй ещё раз.",
      team: "Вспомни порядок: приставка, корень, суффикс, окончание."
    };
    return fallback[who] || "Попробуй ещё раз.";
  };

  Game.prototype.completeCurrent = function () {
    var exercise = this.exercise(this.currentId);
    var steps = this.stepCount(exercise);
    var stars = starsFromMistakes(this.mistakes, steps);
    this.progress.complete(this.currentId, stars, this.mistakes);
    return stars;
  };

  Game.prototype.medalFor = function (id) {
    var medals = this.data.medals || [];
    for (var i = 0; i < medals.length; i += 1) {
      if (medals[i].afterId === id) return medals[i];
    }
    return null;
  };

  Game.prototype.checkSingle = function (exercise, value) {
    if (Array.isArray(exercise.answer)) {
      return exercise.answer.indexOf(value) !== -1;
    }
    return value === exercise.answer;
  };

  Game.prototype.checkSceneMultiple = function (exercise, selected) {
    var needed = exercise.answers || [];
    var extras = selected.filter(function (id) {
      return needed.indexOf(id) === -1;
    });
    if (extras.length) return { ok: false, reason: "extra" };
    if (!sameSet(selected, needed)) return { ok: false, reason: "missing" };
    return { ok: true };
  };

  Game.prototype.neededTexts = function (exercise) {
    if (exercise.answers && exercise.answers.length) return exercise.answers.slice();
    return (exercise.tokens || [])
      .filter(function (token) {
        return token.role === "family" || token.role === "keep" || token.role === "secondary" || token.role === "synonym";
      })
      .map(function (token) {
        return token.text;
      });
  };

  Game.prototype.checkMultiple = function (exercise, selected) {
    var needed = this.neededTexts(exercise);
    var extras = selected.filter(function (text) {
      return needed.indexOf(text) === -1;
    });
    if (extras.length) return { ok: false, reason: "main" };
    if (!sameSet(selected, needed)) return { ok: false, reason: "missing" };
    return { ok: true };
  };

  Game.prototype.checkWordFamily = function (exercise, selected) {
    return this.checkMultiple(exercise, selected);
  };

  Game.prototype.checkFamilyTree = function (exercise, selected) {
    return this.checkMultiple(exercise, selected);
  };

  Game.prototype.checkPairs = function (exercise, chosen) {
    var pairs = exercise.pairs;
    var keys = Object.keys(pairs);
    if (Object.keys(chosen).length !== keys.length) return false;
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (chosen[key] !== pairs[key]) return false;
    }
    return true;
  };

  Game.prototype.checkClass = function (exercise, placed) {
    for (var i = 0; i < exercise.items.length; i += 1) {
      var item = exercise.items[i];
      var wanted = item.group || (item.groups && item.groups[0]);
      var got = placed[item.id];
      if (item.groups) {
        if (item.groups.indexOf(got) === -1) return false;
      } else if (got !== wanted) {
        return false;
      }
    }
    return true;
  };

  Game.prototype.checkWordPart = function (exercise, start, end) {
    var answer = exercise.answer;
    if (!answer || answer.length < 2) return false;
    var lo = Math.min(Number(start), Number(end));
    var hi = Math.max(Number(start), Number(end));
    return lo === Number(answer[0]) && hi === Number(answer[1]);
  };

  Game.prototype.checkFormDress = function (exercise, ending) {
    return normalize(ending) === normalize(exercise.answer);
  };

  Game.prototype.checkWordBuilder = function (exercise, placed) {
    var target = exercise.word || this.lookupWord(exercise.wordId);
    var needed = morphemesOf(target).filter(function (part) {
      if (part.type === "ending" && (part.zero || part.text === "")) return false;
      return Boolean(part.text);
    });
    if (!placed || placed.length !== needed.length) return false;
    for (var i = 0; i < needed.length; i += 1) {
      if (placed[i].type !== needed[i].type) return false;
      if (normalize(placed[i].text) !== normalize(needed[i].text)) return false;
    }
    return joinMorphemes(placed) === joinMorphemes(needed);
  };

  Game.prototype.neededParts = function (exercise) {
    var target = exercise.word || this.lookupWord(exercise.wordId);
    return morphemesOf(target).filter(function (part) {
      return Boolean(part.text);
    });
  };

  Game.prototype.builderOrderOk = function (placed) {
    var last = -1;
    for (var i = 0; i < placed.length; i += 1) {
      var at = ORDER.indexOf(placed[i].type);
      if (at < last) return false;
      last = at;
    }
    return true;
  };

  Game.prototype.checkBuilderStep = function (exercise, placed, next) {
    var needed = this.neededParts(exercise);
    var expected = needed[placed.length];
    if (!expected || !next) return false;
    return expected.type === next.type && normalize(expected.text) === normalize(next.text || "");
  };

  Game.prototype.checkPlaceTeam = function (exercise, placed) {
    var target = exercise.word || this.lookupWord(exercise.wordId);
    var parts = morphemesOf(target);
    if (Object.keys(placed).length !== parts.length) return false;
    for (var i = 0; i < parts.length; i += 1) {
      var key = parts[i].type + ":" + (parts[i].text || "");
      if (placed[key] !== parts[i].type) return false;
    }
    return true;
  };

  Game.prototype.checkParseChoices = function (exercise, chosen) {
    var expect = exercise.parts || {};
    var keys = ["prefix", "root", "suffix", "ending"];
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var want = expect[key];
      var got = chosen[key];
      if (want === undefined || want === null) {
        if (got && got !== "none") return false;
      } else if (normalize(String(got || "")) !== normalize(String(want))) {
        return false;
      }
    }
    return true;
  };

  Game.prototype.checkBroken = function (exercise, value) {
    return this.checkSingle(exercise, value);
  };

  Game.prototype.lookupWord = function (id) {
    var list = this.data.words || [];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id || list[i].text === id) return list[i];
    }
    return null;
  };

  Game.prototype.familyOf = function (id) {
    return (this.data.families || []).filter(function (item) {
      return item.id === id;
    })[0] || null;
  };

  Game.prototype.sameFamily = function (a, b) {
    var left = this.lookupWord(a) || a;
    var right = this.lookupWord(b) || b;
    var idA = typeof left === "object" ? left.familyId : "";
    var idB = typeof right === "object" ? right.familyId : "";
    return Boolean(idA) && idA === idB;
  };

  Game.prototype.sameLemma = function (a, b) {
    var left = this.lookupWord(a) || a;
    var right = this.lookupWord(b) || b;
    var idA = typeof left === "object" ? left.lemmaId : "";
    var idB = typeof right === "object" ? right.lemmaId : "";
    return Boolean(idA) && idA === idB;
  };

  Game.prototype.hasPrefix = function (word) {
    var part = partOf(typeof word === "string" ? this.lookupWord(word) : word, "prefix");
    return Boolean(part && part.text);
  };

  Game.prototype.hasSuffix = function (word) {
    var part = partOf(typeof word === "string" ? this.lookupWord(word) : word, "suffix");
    return Boolean(part && part.text);
  };

  Game.prototype.prefixOf = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    var part = partOf(entry, "prefix");
    return part ? part.text : "";
  };

  Game.prototype.rootOf = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    var part = partOf(entry, "root");
    return part ? part.text : "";
  };

  Game.prototype.suffixOf = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    var part = partOf(entry, "suffix");
    return part ? part.text : "";
  };

  Game.prototype.endingOf = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    if (!entry) return null;
    if (entry.indeclinable) return null;
    var part = partOf(entry, "ending");
    return part || { type: "ending", text: "", zero: true };
  };

  Game.prototype.isZeroEnding = function (word) {
    var ending = this.endingOf(word);
    return Boolean(ending && ending.zero);
  };

  Game.prototype.hasNoEnding = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    return Boolean(entry && entry.indeclinable);
  };

  Game.prototype.prefixBeforeRoot = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    var list = morphemesOf(entry);
    var prefixAt = -1;
    var rootAt = -1;
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].type === "prefix" && prefixAt < 0) prefixAt = i;
      if (list[i].type === "root" && rootAt < 0) rootAt = i;
    }
    if (prefixAt < 0 || rootAt < 0) return true;
    return prefixAt < rootAt;
  };

  Game.prototype.suffixAfterRoot = function (word) {
    var entry = typeof word === "string" ? this.lookupWord(word) : word;
    var list = morphemesOf(entry);
    var suffixAt = -1;
    var rootAt = -1;
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].type === "suffix" && suffixAt < 0) suffixAt = i;
      if (list[i].type === "root" && rootAt < 0) rootAt = i;
    }
    if (suffixAt < 0 || rootAt < 0) return true;
    return suffixAt > rootAt;
  };

  Game.prototype.relationKind = function (left, right) {
    if (this.sameLemma(left, right)) return "form";
    if (this.sameFamily(left, right)) return "family";
    return "other";
  };

  Game.shuffle = shuffle;
  Game.normalize = normalize;
  Game.starsFromMistakes = starsFromMistakes;
  Game.ORDER = ORDER;
  Game.morphemesOf = morphemesOf;
  Game.joinMorphemes = joinMorphemes;

  global.ForestGame = Game;
})(window);
