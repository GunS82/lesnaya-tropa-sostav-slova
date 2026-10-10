/** Run with: node js/check-logic.js */
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");
const path = require("path");

const root = path.resolve(__dirname, "..");
const context = { window: {}, console };
context.window = context;
for (const file of ["data/content.js", "js/game.js", "js/renderer.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const data = context.window.FOREST_DATA;
const ids = data.maps.parts.filter((node) => !node.kind).map((node) => node.id);
const progress = {
  state: { sound: true, medals: [], totalStars: 0, completed: {} },
  hasMedal: function () { return false; },
  hasProgress: function () { return false; },
  firstOpenId: function () { return "root_meet"; },
  exerciseIds: function () { return ids; },
  starsFor: function () { return 0; },
  isUnlocked: function () { return true; },
  isCompleted: function () { return false; },
  trail: function () { return data.maps.parts; }
};
const game = new context.window.ForestGame(data, progress);
const renderer = new context.window.ForestRenderer({ querySelector: function () { return null; }, querySelectorAll: function () { return []; } }, game);
assert.strictEqual(ids.length, 30, "30 exercises, got " + ids.length);
assert.strictEqual(new Set(ids).size, 30);
assert.strictEqual(Object.keys(data.exercises).sort().join(","), ids.slice().sort().join(","));
assert.notStrictEqual(data.storageKey, "forestGrammarProgress");
assert.notStrictEqual(data.storageKey, "forestWordMeaningProgress");
assert.notStrictEqual(data.storageKey, "forestSoundsAlphabetProgress");
assert.strictEqual(data.storageKey, "forestWordPartsProgress");

const raw = fs.readFileSync(path.join(root, "data/content.js"), "utf8") +
  fs.readFileSync(path.join(root, "js/game.js"), "utf8") +
  fs.readFileSync(path.join(root, "js/renderer.js"), "utf8") +
  fs.readFileSync(path.join(root, "js/app.js"), "utf8") +
  fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(!/Префикс/i.test(raw), "the name Префикс must not appear");
assert(/Приставка/.test(raw), "school term Приставка must appear");

function findWord(id) {
  return data.words.filter((item) => item.id === id || item.text === id)[0];
}

function familyWords(familyId) {
  return data.words.filter((item) => item.familyId === familyId).map((item) => item.text);
}

const grib = ["гриб", "грибок", "грибник", "грибной"];
grib.forEach((name) => assert.strictEqual(findWord(name).familyId, "grib", name + " in grib family"));
assert.ok(!familyWords("grib").includes("подберёзовик"));

["мама", "сын", "дедушка", "тётя"].forEach((name, i, list) => {
  list.forEach((other) => {
    if (name !== other) assert.notStrictEqual(findWord(name).familyId, findWord(other).familyId, name + " vs " + other);
  });
});

["сын", "сынок", "сыночек", "сынишка"].forEach((name) => {
  assert.strictEqual(findWord(name).familyId, "syn");
});

assert.strictEqual(game.rootOf("moryak"), "мор");
assert.strictEqual(game.rootOf("morskoy"), "мор");
assert.strictEqual(game.rootOf("more"), "мор");
assert.strictEqual(game.rootOf("svet"), "свет");
assert.strictEqual(game.rootOf("svetit"), "свет");
assert.strictEqual(game.rootOf("svetly"), "свет");

assert.strictEqual(game.sameLemma("ruka", "ruki"), true);
assert.strictEqual(game.relationKind("ruka", "ruki"), "form");
assert.strictEqual(game.sameFamily("trava", "travka"), true);
assert.strictEqual(game.sameLemma("trava", "travka"), false);
assert.strictEqual(game.relationKind("trava", "travka"), "family");
assert.strictEqual(game.sameLemma("more", "morya"), true);
assert.strictEqual(game.relationKind("more", "morya"), "form");

assert.ok(game.isZeroEnding("gorod"));
assert.ok(!game.hasNoEnding("gorod"));
assert.ok(game.hasNoEnding("palto"));
assert.ok(!game.isZeroEnding("palto"));

assert.ok(game.prefixBeforeRoot("vhodit"));
assert.ok(game.suffixAfterRoot("domik"));
assert.strictEqual(game.prefixOf("vhodit"), "в");
assert.strictEqual(game.prefixOf("vyhodit"), "вы");
assert.notStrictEqual(game.prefixOf("vhodit"), game.prefixOf("vyhodit"));
assert.ok(game.hasSuffix("domik"));
assert.ok(!game.hasPrefix("dom"));
assert.ok(!game.hasSuffix("gorod"));

const sputnik = findWord("sputniki");
assert.strictEqual(sputnik.morphemes.map((part) => part.type).join("|"), "prefix|root|suffix|ending");
assert.strictEqual(sputnik.morphemes.map((part) => part.text).join("|"), "с|пут|ник|и");
assert.ok(game.checkPlaceTeam({ wordId: "sputniki" }, { "prefix:с": "prefix", "root:пут": "root", "suffix:ник": "suffix", "ending:и": "ending" }));
assert.ok(!game.checkPlaceTeam({ wordId: "sputniki" }, { "prefix:с": "root" }));

const built = [
  { type: "prefix", text: "на" },
  { type: "root", text: "езд" },
  { type: "suffix", text: "ник" }
];
assert.ok(game.checkWordBuilder({ wordId: "naezdnik" }, built));
assert.ok(!game.checkWordBuilder({ wordId: "naezdnik" }, built.slice().reverse()));
assert.ok(game.builderOrderOk(built));
assert.ok(!game.builderOrderOk([{ type: "root", text: "езд" }, { type: "prefix", text: "на" }]));
assert.ok(game.checkBuilderStep({ wordId: "naezdnik" }, [], { type: "prefix", text: "на" }));
assert.ok(!game.checkBuilderStep({ wordId: "naezdnik" }, [], { type: "root", text: "езд" }));

const parsePrigorod = data.exercises.team_parse.rounds[2];
assert.ok(game.checkParseChoices(parsePrigorod, { prefix: "при", root: "город", suffix: "нет", ending: "нулевое" }));
assert.ok(!game.checkParseChoices(parsePrigorod, { prefix: "при", root: "город", suffix: "нет", ending: "нет" }));
const parseIgrushka = data.exercises.team_parse.rounds[4];
assert.ok(game.checkParseChoices(parseIgrushka, { prefix: "нет", root: "игр", suffix: "ушк", ending: "а" }));
assert.ok(!game.checkParseChoices(parseIgrushka, { prefix: "нет", root: "игр", suffix: "ушк", ending: "нулевое" }));
assert.ok(findWord("prigorod").morphemes.some((part) => part.type === "ending" && part.zero));
assert.ok(findWord("palto").indeclinable);

assert.ok(game.checkFamilyTree(data.exercises.root_tree, ["грибок", "грибник", "грибной"]).ok);
assert.ok(!game.checkFamilyTree(data.exercises.root_tree, ["грибок", "ягода"]).ok);

const namesRound = data.exercises.root_names.rounds[1];
assert.ok(game.checkSingle(namesRound, "во второй группе"));

const lookalike = data.exercises.root_lookalike.rounds;
assert.ok(game.checkSingle(lookalike[0], "однокоренные"));
assert.ok(game.checkSingle(lookalike[1], "просто похожие буквы"));

assert.ok(game.checkFormDress({ answer: "ы" }, "ы"));
assert.ok(!game.checkFormDress({ answer: "ы" }, "а"));

assert.strictEqual(data.exercises.team_exam.rooms.length, 5);
assert.strictEqual(data.exercises.team_exam.rooms.reduce((sum, room) => sum + room.questions.length, 0), 25);
game.begin("team_exam");
assert.strictEqual(game.stepCount(data.exercises.team_exam), 25);

function stepsOf(exercise) {
  if (exercise.type === "examRooms") {
    return exercise.rooms.reduce((all, room) => all.concat(room.questions), []);
  }
  return exercise.rounds || exercise.steps || [exercise];
}

for (const id of ids) {
  const ex = data.exercises[id];
  assert(ex.title && ex.type, "incomplete " + id);
  assert(ex.owl && ex.hint && ex.success, "missing speech " + id);
  renderer.parentExercise = ex;
  renderer.view = {};
  for (const step of stepsOf(ex)) {
    assert(step.type, "missing step type " + id);
    const html = renderer.renderByType(step);
    assert(html.includes("<h1>") && !html.includes("Неизвестный тип"), id + ": rendered " + step.type);
    if (step.type === "singleChoice" || step.type === "insertWord" || step.type === "hideRoot" || step.type === "brokenMachine") {
      assert(step.options.includes(step.answer) || (Array.isArray(step.answer) && step.options.includes(step.answer[0])), id + " answer in options");
    }
    if (step.type === "markWordPart") {
      assert(game.checkWordPart(step, step.answer[0], step.answer[1]), id + " mark range");
      assert(!game.checkWordPart(step, 0, 0) || (step.answer[0] === 0 && step.answer[1] === 0), id + " wrong range rejected unless zero-width");
    }
    if (step.type === "parseChoices") {
      ["prefix", "root", "suffix", "ending"].forEach((key) => {
        assert(step.options[key].includes(step.parts[key]), id + " parse option " + key);
      });
      assert(game.checkParseChoices(step, step.parts), id + " parse answer");
    }
  }
}

assert.strictEqual(data.medals.length, 5);
["root_find", "end_zero", "pre_find", "suf_or_prefix", "team_exam"].forEach((afterId, i) => {
  assert.strictEqual(data.medals[i].afterId, afterId, "medal after " + afterId);
});

console.log("OK " + ids.length + " exercises");
