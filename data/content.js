/**
 * Замок состава слова. 2 класс, учебник Канакиной и Горецкого, ч. 1, с. 57–67.
 * Имя персонажа приставки — только школьный термин «Приставка».
 */
(function () {
  "use strict";

  function morph(type, text, extra) {
    var part = { type: type, text: text || "" };
    if (extra) Object.keys(extra).forEach(function (key) { part[key] = extra[key]; });
    return part;
  }

  function word(id, text, parts, extra) {
    var entry = { id: id, text: text, morphemes: parts };
    if (extra) Object.keys(extra).forEach(function (key) { entry[key] = extra[key]; });
    return entry;
  }

  function choice(question, options, answer, extra) {
    return Object.assign({ type: "singleChoice", question: question, options: options, answer: answer }, extra || {});
  }

  var z = { zero: true };
  var words = [
    word("brat", "брат", [morph("root", "брат"), morph("ending", "", z)], { familyId: "brat", lemmaId: "brat" }),
    word("bratik", "братик", [morph("root", "брат"), morph("suffix", "ик"), morph("ending", "", z)], { familyId: "brat", lemmaId: "bratik" }),
    word("bratishka", "братишка", [morph("root", "брат"), morph("suffix", "ишк"), morph("ending", "а")], { familyId: "brat", lemmaId: "bratishka" }),
    word("baraban", "барабан", [morph("root", "барабан"), morph("ending", "", z)], { familyId: "baraban", lemmaId: "baraban" }),
    word("barabanshchik", "барабанщик", [morph("root", "барабан"), morph("suffix", "щик"), morph("ending", "", z)], { familyId: "baraban", lemmaId: "barabanshchik" }),
    word("barabanny", "барабанный", [morph("root", "барабан"), morph("suffix", "н"), morph("ending", "ый")], { familyId: "baraban", lemmaId: "barabanny" }),
    word("ryba", "рыба", [morph("root", "рыб"), morph("ending", "а")], { familyId: "ryba", lemmaId: "ryba" }),
    word("rybeshka", "рыбёшка", [morph("root", "рыб"), morph("suffix", "ёшк"), morph("ending", "а")], { familyId: "ryba", lemmaId: "rybeshka" }),
    word("rybak", "рыбак", [morph("root", "рыб"), morph("suffix", "ак"), morph("ending", "", z)], { familyId: "ryba", lemmaId: "rybak" }),
    word("mama", "мама", [morph("root", "мам"), morph("ending", "а")], { familyId: "mama", lemmaId: "mama" }),
    word("syn", "сын", [morph("root", "сын"), morph("ending", "", z)], { familyId: "syn", lemmaId: "syn" }),
    word("dedushka", "дедушка", [morph("root", "дедушк"), morph("ending", "а")], { familyId: "ded", lemmaId: "dedushka" }),
    word("tyotya", "тётя", [morph("root", "тёт"), morph("ending", "я")], { familyId: "tyotya", lemmaId: "tyotya" }),
    word("synok", "сынок", [morph("root", "сын"), morph("suffix", "ок"), morph("ending", "", z)], { familyId: "syn", lemmaId: "synok" }),
    word("synochek", "сыночек", [morph("root", "сын"), morph("suffix", "очек"), morph("ending", "", z)], { familyId: "syn", lemmaId: "synochek" }),
    word("synishka", "сынишка", [morph("root", "сын"), morph("suffix", "ишк"), morph("ending", "а")], { familyId: "syn", lemmaId: "synishka" }),
    word("grib", "гриб", [morph("root", "гриб"), morph("ending", "", z)], { familyId: "grib", lemmaId: "grib" }),
    word("gribok", "грибок", [morph("root", "гриб"), morph("suffix", "ок"), morph("ending", "", z)], { familyId: "grib", lemmaId: "gribok" }),
    word("gribnik", "грибник", [morph("root", "гриб"), morph("suffix", "ник"), morph("ending", "", z)], { familyId: "grib", lemmaId: "gribnik" }),
    word("gribnoj", "грибной", [morph("root", "гриб"), morph("suffix", "н"), morph("ending", "ой")], { familyId: "grib", lemmaId: "gribnoj" }),
    word("yagoda", "ягода", [morph("root", "ягод"), morph("ending", "а")], { familyId: "yagoda", lemmaId: "yagoda" }),
    word("lesnik", "лесник", [morph("root", "лес"), morph("suffix", "ник"), morph("ending", "", z)], { familyId: "les", lemmaId: "lesnik" }),
    word("podberezovik", "подберёзовик", [morph("prefix", "под"), morph("root", "берёз"), morph("suffix", "овик"), morph("ending", "", z)], { familyId: "bereza", lemmaId: "podberezovik" }),
    word("trava", "трава", [morph("root", "трав"), morph("ending", "а")], { familyId: "trava", lemmaId: "trava" }),
    word("travka", "травка", [morph("root", "трав"), morph("suffix", "к"), morph("ending", "а")], { familyId: "trava", lemmaId: "travka" }),
    word("shum", "шум", [morph("root", "шум"), morph("ending", "", z)], { familyId: "shum", lemmaId: "shum" }),
    word("shumet", "шуметь", [morph("root", "шум"), morph("suffix", "е"), morph("ending", "ть")], { familyId: "shum", lemmaId: "shumet" }),
    word("smely", "смелый", [morph("root", "смел"), morph("ending", "ый")], { familyId: "smel", lemmaId: "smely" }),
    word("smelost", "смелость", [morph("root", "смел"), morph("suffix", "ость"), morph("ending", "", z)], { familyId: "smel", lemmaId: "smelost" }),
    word("more", "море", [morph("root", "мор"), morph("ending", "е")], { familyId: "more", lemmaId: "more" }),
    word("morya", "моря", [morph("root", "мор"), morph("ending", "я")], { familyId: "more", lemmaId: "more" }),
    word("moryak", "моряк", [morph("root", "мор"), morph("suffix", "як"), morph("ending", "", z)], { familyId: "more", lemmaId: "moryak" }),
    word("morskoy", "морской", [morph("root", "мор"), morph("suffix", "ск"), morph("ending", "ой")], { familyId: "more", lemmaId: "morskoy" }),
    word("svet", "свет", [morph("root", "свет"), morph("ending", "", z)], { familyId: "svet", lemmaId: "svet" }),
    word("svetit", "светить", [morph("root", "свет"), morph("suffix", "и"), morph("ending", "ть")], { familyId: "svet", lemmaId: "svetit" }),
    word("svetly", "светлый", [morph("root", "свет"), morph("suffix", "л"), morph("ending", "ый")], { familyId: "svet", lemmaId: "svetly" }),
    word("bely", "белый", [morph("root", "бел"), morph("ending", "ый")], { familyId: "bel", lemmaId: "bely" }),
    word("belenky", "беленький", [morph("root", "бел"), morph("suffix", "еньк"), morph("ending", "ий")], { familyId: "bel", lemmaId: "belenky" }),
    word("beleet", "белеет", [morph("root", "бел"), morph("suffix", "е"), morph("ending", "ет")], { familyId: "bel", lemmaId: "beleet" }),
    word("gora", "гора", [morph("root", "гор"), morph("ending", "а")], { familyId: "gora", lemmaId: "gora" }),
    word("gorny", "горный", [morph("root", "гор"), morph("suffix", "н"), morph("ending", "ый")], { familyId: "gora", lemmaId: "gorny" }),
    word("lisa", "лиса", [morph("root", "лис"), morph("ending", "а")], { familyId: "lisa", lemmaId: "lisa" }),
    word("lesa", "леса", [morph("root", "лес"), morph("ending", "а")], { familyId: "les", lemmaId: "les" }),
    word("osa", "оса", [morph("root", "ос"), morph("ending", "а")], { familyId: "osa", lemmaId: "osa" }),
    word("osina", "осина", [morph("root", "осин"), morph("ending", "а")], { familyId: "osina", lemmaId: "osina" }),
    word("korm", "корм", [morph("root", "корм"), morph("ending", "", z)], { familyId: "korm", lemmaId: "korm" }),
    word("kormit", "кормить", [morph("root", "корм"), morph("suffix", "и"), morph("ending", "ть")], { familyId: "korm", lemmaId: "kormit" }),
    word("yabloko", "яблоко", [morph("root", "яблок"), morph("ending", "о")], { familyId: "yabloko", lemmaId: "yabloko" }),
    word("yabloki", "яблоки", [morph("root", "яблок"), morph("ending", "и")], { familyId: "yabloko", lemmaId: "yabloko" }),
    word("zvezda", "звезда", [morph("root", "звёзд"), morph("ending", "а")], { familyId: "zvezda", lemmaId: "zvezda" }),
    word("zvezdy", "звёзды", [morph("root", "звёзд"), morph("ending", "ы")], { familyId: "zvezda", lemmaId: "zvezda" }),
    word("lisica", "лисица", [morph("root", "лисиц"), morph("ending", "а")], { familyId: "lisa", lemmaId: "lisica" }),
    word("lisicy", "лисицы", [morph("root", "лисиц"), morph("ending", "ы")], { familyId: "lisa", lemmaId: "lisica" }),
    word("bereza", "берёза", [morph("root", "берёз"), morph("ending", "а")], { familyId: "bereza", lemmaId: "bereza" }),
    word("berezy", "берёзы", [morph("root", "берёз"), morph("ending", "ы")], { familyId: "bereza", lemmaId: "bereza" }),
    word("bereze", "берёзе", [morph("root", "берёз"), morph("ending", "е")], { familyId: "bereza", lemmaId: "bereza" }),
    word("berezoj", "берёзой", [morph("root", "берёз"), morph("ending", "ой")], { familyId: "bereza", lemmaId: "bereza" }),
    word("sosna", "сосна", [morph("root", "сосн"), morph("ending", "а")], { familyId: "sosna", lemmaId: "sosna" }),
    word("sosny", "сосны", [morph("root", "сосн"), morph("ending", "ы")], { familyId: "sosna", lemmaId: "sosna" }),
    word("sosne", "сосне", [morph("root", "сосн"), morph("ending", "е")], { familyId: "sosna", lemmaId: "sosna" }),
    word("sosnoj", "сосной", [morph("root", "сосн"), morph("ending", "ой")], { familyId: "sosna", lemmaId: "sosna" }),
    word("reka", "река", [morph("root", "рек"), morph("ending", "а")], { familyId: "reka", lemmaId: "reka" }),
    word("reki", "реки", [morph("root", "рек"), morph("ending", "и")], { familyId: "reka", lemmaId: "reka" }),
    word("reke", "реке", [morph("root", "рек"), morph("ending", "е")], { familyId: "reka", lemmaId: "reka" }),
    word("rekoj", "рекой", [morph("root", "рек"), morph("ending", "ой")], { familyId: "reka", lemmaId: "reka" }),
    word("groza", "гроза", [morph("root", "гроз"), morph("ending", "а")], { familyId: "groza", lemmaId: "groza" }),
    word("grozy", "грозы", [morph("root", "гроз"), morph("ending", "ы")], { familyId: "groza", lemmaId: "groza" }),
    word("groze", "грозе", [morph("root", "гроз"), morph("ending", "е")], { familyId: "groza", lemmaId: "groza" }),
    word("grozoj", "грозой", [morph("root", "гроз"), morph("ending", "ой")], { familyId: "groza", lemmaId: "groza" }),
    word("ruka", "рука", [morph("root", "рук"), morph("ending", "а")], { familyId: "ruka", lemmaId: "ruka" }),
    word("ruki", "руки", [morph("root", "рук"), morph("ending", "и")], { familyId: "ruka", lemmaId: "ruka" }),
    word("rosa", "роса", [morph("root", "рос"), morph("ending", "а")], { familyId: "rosa", lemmaId: "rosa" }),
    word("rosinka", "росинка", [morph("root", "рос"), morph("suffix", "инк"), morph("ending", "а")], { familyId: "rosa", lemmaId: "rosinka" }),
    word("tort", "торт", [morph("root", "торт"), morph("ending", "", z)], { familyId: "tort", lemmaId: "tort" }),
    word("torty", "торты", [morph("root", "торт"), morph("ending", "ы")], { familyId: "tort", lemmaId: "tort" }),
    word("maslo", "масло", [morph("root", "масл"), morph("ending", "о")], { familyId: "maslo", lemmaId: "maslo" }),
    word("maslice", "маслице", [morph("root", "масл"), morph("suffix", "иц"), morph("ending", "е")], { familyId: "maslo", lemmaId: "maslice" }),
    word("gorod", "город", [morph("root", "город"), morph("ending", "", z)], { familyId: "gorod", lemmaId: "gorod" }),
    word("goroda", "города", [morph("root", "город"), morph("ending", "а")], { familyId: "gorod", lemmaId: "gorod" }),
    word("gorodu", "городу", [morph("root", "город"), morph("ending", "у")], { familyId: "gorod", lemmaId: "gorod" }),
    word("palto", "пальто", [morph("root", "пальто")], { familyId: "palto", lemmaId: "palto", indeclinable: true, ending: null }),
    word("hodit", "ходит", [morph("root", "ход"), morph("ending", "ит")], { familyId: "hod", lemmaId: "hodit" }),
    word("vhodit", "входит", [morph("prefix", "в"), morph("root", "ход"), morph("ending", "ит")], { familyId: "hod", lemmaId: "vhodit" }),
    word("vyhodit", "выходит", [morph("prefix", "вы"), morph("root", "ход"), morph("ending", "ит")], { familyId: "hod", lemmaId: "vyhodit" }),
    word("podhodit", "подходит", [morph("prefix", "под"), morph("root", "ход"), morph("ending", "ит")], { familyId: "hod", lemmaId: "podhodit" }),
    word("pisat", "писать", [morph("root", "пис"), morph("suffix", "а"), morph("ending", "ть")], { familyId: "pis", lemmaId: "pisat" }),
    word("perepisat", "переписать", [morph("prefix", "пере"), morph("root", "пис"), morph("suffix", "а"), morph("ending", "ть")], { familyId: "pis", lemmaId: "perepisat" }),
    word("zveneli", "звенели", [morph("root", "звен"), morph("ending", "ели")], { familyId: "zven", lemmaId: "zvenet" }),
    word("zazveneli", "зазвенели", [morph("prefix", "за"), morph("root", "звен"), morph("ending", "ели")], { familyId: "zven", lemmaId: "zazveneli" }),
    word("prigorod", "пригород", [morph("prefix", "при"), morph("root", "город"), morph("ending", "", z)], { familyId: "gorod", lemmaId: "prigorod" }),
    word("podyezd", "подъезд", [morph("prefix", "под"), morph("root", "ъезд"), morph("ending", "", z)], { familyId: "ezd", lemmaId: "podyezd" }),
    word("podvodny", "подводный", [morph("prefix", "под"), morph("root", "вод"), morph("suffix", "н"), morph("ending", "ый")], { familyId: "voda", lemmaId: "podvodny" }),
    word("podorozhnik", "подорожник", [morph("prefix", "по"), morph("root", "дорож"), morph("suffix", "ник"), morph("ending", "", z)], { familyId: "dorog", lemmaId: "podorozhnik" }),
    word("podorozhniki", "подорожники", [morph("prefix", "по"), morph("root", "дорож"), morph("suffix", "ник"), morph("ending", "и")], { familyId: "dorog", lemmaId: "podorozhnik" }),
    word("naezdnik", "наездник", [morph("prefix", "на"), morph("root", "езд"), morph("suffix", "ник"), morph("ending", "", z)], { familyId: "ezd", lemmaId: "naezdnik" }),
    word("dom", "дом", [morph("root", "дом"), morph("ending", "", z)], { familyId: "dom", lemmaId: "dom" }),
    word("domik", "домик", [morph("root", "дом"), morph("suffix", "ик"), morph("ending", "", z)], { familyId: "dom", lemmaId: "domik" }),
    word("domok", "домок", [morph("root", "дом"), morph("suffix", "ок"), morph("ending", "", z)], { familyId: "dom", lemmaId: "domok" }),
    word("domishko", "домишко", [morph("root", "дом"), morph("suffix", "ишк"), morph("ending", "о")], { familyId: "dom", lemmaId: "domishko" }),
    word("domische", "домище", [morph("root", "дом"), morph("suffix", "ищ"), morph("ending", "е")], { familyId: "dom", lemmaId: "domische" }),
    word("slon", "слон", [morph("root", "слон"), morph("ending", "", z)], { familyId: "slon", lemmaId: "slon" }),
    word("sloniha", "слониха", [morph("root", "слон"), morph("suffix", "их"), morph("ending", "а")], { familyId: "slon", lemmaId: "sloniha" }),
    word("slonenok", "слонёнок", [morph("root", "слон"), morph("suffix", "ёнок"), morph("ending", "", z)], { familyId: "slon", lemmaId: "slonenok" }),
    word("slonovy", "слоновый", [morph("root", "слон"), morph("suffix", "ов"), morph("ending", "ый")], { familyId: "slon", lemmaId: "slonovy" }),
    word("tigr", "тигр", [morph("root", "тигр"), morph("ending", "", z)], { familyId: "tigr", lemmaId: "tigr" }),
    word("tigrenok", "тигрёнок", [morph("root", "тигр"), morph("suffix", "ёнок"), morph("ending", "", z)], { familyId: "tigr", lemmaId: "tigrenok" }),
    word("uchit", "учить", [morph("root", "уч"), morph("suffix", "и"), morph("ending", "ть")], { familyId: "uch", lemmaId: "uchit" }),
    word("uchitel", "учитель", [morph("root", "уч"), morph("suffix", "итель"), morph("ending", "", z)], { familyId: "uch", lemmaId: "uchitel" }),
    word("igrushka", "игрушка", [morph("root", "игр"), morph("suffix", "ушк"), morph("ending", "а")], { familyId: "igra", lemmaId: "igrushka" }),
    word("futbolist", "футболист", [morph("root", "футбол"), morph("suffix", "ист"), morph("ending", "", z)], { familyId: "futbol", lemmaId: "futbolist" }),
    word("saharnica", "сахарница", [morph("root", "сахар"), morph("suffix", "ниц"), morph("ending", "а")], { familyId: "sahar", lemmaId: "saharnica" }),
    word("sputniki", "спутники", [morph("prefix", "с"), morph("root", "пут"), morph("suffix", "ник"), morph("ending", "и")], { familyId: "put", lemmaId: "sputnik" }),
    word("les", "лес", [morph("root", "лес"), morph("ending", "", z)], { familyId: "les", lemmaId: "les" }),
    word("lesok", "лесок", [morph("root", "лес"), morph("suffix", "ок"), morph("ending", "", z)], { familyId: "les", lemmaId: "lesok" }),
    word("lesa-form", "леса", [morph("root", "лес"), morph("ending", "а")], { familyId: "les", lemmaId: "les" })
  ];

  var examRooms = [
    {
      id: "room-root",
      title: "Комната Корня",
      guardian: "root",
      questions: [
        choice("Какие слова однокоренные?", ["брат, братик, братишка", "мама, сын, дедушка", "гора, лиса, оса"], "брат, братик, братишка"),
        choice("Где однокоренные слова?", ["мама, сын, дедушка, тётя", "сын, сынок, сыночек, сынишка"], "сын, сынок, сыночек, сынишка"),
        choice("Какой корень у слов море, моряк, морской?", ["мор", "море", "як"], "мор"),
        choice("Какая пара однокоренная?", ["гора — горный", "лиса — леса", "оса — осина"], "гора — горный"),
        { type: "markWordPart", word: "барабанщик", part: "root", answer: [0, 6], prompt: "барабанщик", question: "Найди корень." }
      ]
    },
    {
      id: "room-ending",
      title: "Комната Окончания",
      guardian: "ending",
      questions: [
        choice("яблоко → яблоки. Что произошло?", ["изменилась форма", "появилось новое слово"], "изменилась форма"),
        choice("трава → травка. Что произошло?", ["изменилась форма", "появилось новое однокоренное слово"], "появилось новое однокоренное слово"),
        choice("В слове город окончание какое?", ["нулевое", "окончания нет", "окончание -од"], "нулевое"),
        choice("В слове пальто окончание какое?", ["нулевое", "окончания нет", "окончание -о"], "окончания нет"),
        choice("После □ хорошо клюёт рыба.", ["грозы", "гроза", "грозе"], "грозы", { sentence: "После □ хорошо клюёт рыба." })
      ]
    },
    {
      id: "room-prefix",
      title: "Комната Приставки",
      guardian: "prefix",
      questions: [
        choice("Где стоит приставка?", ["перед корнем", "после корня", "в самом конце"], "перед корнем"),
        choice("Чем отличаются входит и выходит?", ["разными приставками", "разными корнями", "разными окончаниями"], "разными приставками"),
        { type: "markWordPart", word: "пригород", part: "prefix", answer: [0, 2], prompt: "пригород", question: "Найди приставку." },
        choice("Что делает приставка пере- в слове переписать?", ["Пишем заново", "действие началось", "меняет форму"], "Пишем заново"),
        choice("Кто из этих частей — приставка?", ["при-", "-ник-", "-а"], "при-")
      ]
    },
    {
      id: "room-suffix",
      title: "Комната Суффикса",
      guardian: "suffix",
      questions: [
        choice("В слове домик есть суффикс?", ["да, -ик-", "нет", "это приставка"], "да, -ик-"),
        choice("Что значит суффикс -ёнок- в слове тигрёнок?", ["детёныш", "большой", "форма слова"], "детёныш"),
        { type: "markWordPart", word: "моряк", part: "suffix", answer: [3, 4], prompt: "моряк", question: "Найди суффикс." },
        choice("Где стоит суффикс?", ["после корня", "перед корнем", "вместо корня"], "после корня"),
        choice("Кто сделал слово слониха?", ["суффикс", "окончание", "приставка"], "суффикс")
      ]
    },
    {
      id: "room-team",
      title: "Комната всей команды",
      guardian: "team",
      questions: [
        choice("Разбери слово спутники. Какой корень?", ["пут", "спут", "ник"], "пут"),
        choice("Кто обязательно должен быть в слове?", ["корень", "приставка", "суффикс"], "корень"),
        choice("лес → лесок. Кто создал новое слово?", ["суффикс", "окончание", "приставка"], "суффикс"),
        choice("лес → леса. Кто изменил форму?", ["окончание", "суффикс", "приставка"], "окончание"),
        choice("ходить → выходить. Кто создал новое слово?", ["приставка", "окончание", "только корень"], "приставка")
      ]
    }
  ];

  window.FOREST_DATA = {
    title: "Лесная тропа знаний: состав слова",
    subject: "Русский язык",
    grade: "2 класс",
    storageKey: "forestWordPartsProgress",
    words: words,
    characterMedals: {
      prefix: "prefix-master",
      root: "root-master",
      suffix: "suffix-master",
      ending: "ending-master"
    },
    topics: [
      { id: "parts", title: "Состав слова", subtitle: "Приставка · Корень · Суффикс · Окончание", available: true },
      { id: "sentence", title: "Предложение", subtitle: "Другая тропа", available: true, href: "https://guns82.github.io/lesnaya-tropa-znaniy/" },
      { id: "words", title: "Слова и их значения", subtitle: "Другая тропа", available: true, href: "https://guns82.github.io/lesnaya-tropa-slova/" },
      { id: "sounds", title: "Звуки и буквы", subtitle: "Другая тропа", available: true, href: "https://guns82.github.io/lesnaya-tropa-zvuki-bukvy/" }
    ],
    scenes: {
      castle: { emoji: "🏰", caption: "Замок состава слова", alt: "Деревянный замок в осеннем лесу" },
      meadow: { emoji: "🌲", caption: "Поляна", alt: "Лесная поляна" },
      "tree-roots": { emoji: "🌳", caption: "Корни дерева", alt: "Дерево с сильными корнями" },
      brothers: { emoji: "👦", caption: "Братья", alt: "Братья рядом" },
      drum: { emoji: "🥁", caption: "Барабан", alt: "Барабан" },
      "fish-family": { emoji: "🐟", caption: "Рыба", alt: "Рыба и рыбак" },
      "family-people": { emoji: "👨‍👩‍👧", caption: "Семья", alt: "Мама, сын, дедушка и тётя" },
      mushroom: { emoji: "🍄", caption: "Гриб", alt: "Гриб" },
      "mushroom-small": { emoji: "🍄", caption: "Грибок", alt: "Маленький гриб" },
      "mushroom-picker": { emoji: "🧺", caption: "Грибник", alt: "Человек с корзиной грибов" },
      "mushroom-soup": { emoji: "🍲", caption: "Грибной суп", alt: "Грибной суп" },
      cranberry: { emoji: "🔴", caption: "Ягода", alt: "Ягода" },
      house: { emoji: "🏠", caption: "Дом", alt: "Дом" },
      "house-small": { emoji: "🏡", caption: "Домик", alt: "Маленький дом" },
      "house-large": { emoji: "🏰", caption: "Домище", alt: "Огромный дом" },
      "house-shabby": { emoji: "🏚️", caption: "Домишко", alt: "Невзрачный домик" },
      "elephant-family": { emoji: "🐘", caption: "Слоны", alt: "Слон и слонёнок" },
      apple: { emoji: "🍎", caption: "Яблоко", alt: "Яблоко" },
      "apples-many": { emoji: "🍎", caption: "Яблоки", alt: "Несколько яблок" },
      "star-sky": { emoji: "⭐", caption: "Звезда", alt: "Звезда на небе" },
      "stars-many": { emoji: "✨", caption: "Звёзды", alt: "Много звёзд" },
      fox: { emoji: "🦊", caption: "Лиса", alt: "Лиса" },
      foxes: { emoji: "🦊", caption: "Лисицы", alt: "Лисы" },
      birch: { emoji: "🌿", caption: "Берёза", alt: "Берёза" },
      pine: { emoji: "🌲", caption: "Сосна", alt: "Сосна" },
      river: { emoji: "🏞️", caption: "Река", alt: "Река" },
      "storm-after": { emoji: "🌦️", caption: "После грозы", alt: "Лес после грозы" },
      "storm-before": { emoji: "⛈️", caption: "Перед грозой", alt: "Тучи перед грозой" },
      anthill: { emoji: "🐜", caption: "Муравейник", alt: "Муравьи" },
      town: { emoji: "🏘️", caption: "Город", alt: "Городская улица" },
      mountain: { emoji: "⛰️", caption: "Гора", alt: "Гора" },
      sea: { emoji: "🌊", caption: "Море", alt: "Море" },
      "sea-sailor": { emoji: "⚓", caption: "Моряк", alt: "Моряк у моря" },
      "light-lamp": { emoji: "💡", caption: "Свет", alt: "Лампа" },
      "white-hare": { emoji: "🐇", caption: "Белый", alt: "Белый заяц" },
      ships: { emoji: "⛵", caption: "Морской", alt: "Лодки на воде" },
      shine: { emoji: "💡", caption: "Светить", alt: "Фонарь светит на тропу" },
      "bright-grove": { emoji: "☀️", caption: "Светлый", alt: "Светлая берёзовая роща" },
      "white-kitten": { emoji: "🐱", caption: "Беленький", alt: "Беленький котёнок" },
      "snow-white": { emoji: "❄️", caption: "Белеет", alt: "Снег белеет на крышах" },
      "feed-bowl": { emoji: "🥣", caption: "Корм", alt: "Миска корма" },
      "wasp-aspen": { emoji: "🐝", caption: "Оса и осина", alt: "Оса и осина" },
      "prefix-in": { emoji: "🚪", caption: "Входит", alt: "Ребёнок входит в дом" },
      "prefix-out": { emoji: "🚶", caption: "Выходит", alt: "Ребёнок выходит из дома" },
      "prefix-near": { emoji: "🏠", caption: "Подходит", alt: "Ребёнок подходит к дому" },
      workshop: { emoji: "🛠️", caption: "Мастерская слов", alt: "Деревянная машина слов" },
      plantain: { emoji: "🌿", caption: "Подорожник", alt: "Подорожник у тропы" },
      rider: { emoji: "🐎", caption: "Наездник", alt: "Ребёнок на лошади" },
      bells: { emoji: "🔔", caption: "Колокольчики", alt: "Звенят колокольчики" },
      library: { emoji: "📖", caption: "Книга", alt: "Книга" },
      student: { emoji: "🎒", caption: "Ученик", alt: "Ученик" },
      oak: { emoji: "🌳", caption: "Дуб", alt: "Дуб" },
      tree: { emoji: "🌳", caption: "Дерево", alt: "Дерево" },
      palto: { emoji: "🧥", caption: "Пальто", alt: "Пальто на вешалке" },
      companions: { emoji: "🌙", caption: "Спутники", alt: "Двое идут вместе по тропе" },
      writing: { emoji: "✏️", caption: "Письмо", alt: "Ребёнок переписывает в тетради" },
      toy: { emoji: "🧸", caption: "Игрушка", alt: "Игрушки на столе" },
      footballer: { emoji: "⚽", caption: "Футболист", alt: "Ребёнок с мячом" },
      "sugar-bowl": { emoji: "🍬", caption: "Сахарница", alt: "Сахарница на столе" },
      "tiger-cub": { emoji: "🐯", caption: "Тигрёнок", alt: "Маленький тигрёнок" },
      teacher: { emoji: "📚", caption: "Учитель", alt: "Учительница с книгой" },
      entrance: { emoji: "🚪", caption: "Подъезд", alt: "Вход в дом" }
    },
    medals: [
      { id: "root-master", title: "Медаль Корня", icon: "🌳", afterId: "root_find", character: "root", text: "Корень собрал семью слов с общим смыслом." },
      { id: "ending-master", title: "Мастер формы слова", icon: "🔲", afterId: "end_zero", character: "ending", text: "Окончание переоделось, а слово осталось тем же." },
      { id: "prefix-master", title: "Мастер приставок", icon: "🚀", afterId: "pre_find", character: "prefix", text: "Приставка прибежала перед Корнем и изменила слово." },
      { id: "suffix-master", title: "Мастер новых слов", icon: "🛠️", afterId: "suf_or_prefix", character: "suffix", text: "Суффикс прикрепился к Корню и создал новое слово." },
      { id: "team-master", title: "Мастер состава слова", icon: "🏆", afterId: "team_exam", character: "team", text: "Вся команда слова стоит на своих местах." }
    ],
    teamCard: [
      { id: "prefix", title: "Приставка", text: "Стоит перед корнем. Помогает образовывать новые слова." },
      { id: "root", title: "Корень", text: "Главная часть родственных слов. Хранит их общий смысл." },
      { id: "suffix", title: "Суффикс", text: "Стоит после корня. Помогает образовывать новые слова." },
      { id: "ending", title: "Окончание", text: "Изменяемая часть слова. Образует формы слова и помогает связывать слова." }
    ],
    finish: {
      title: "Мастер состава слова",
      lead: "Приставка, Корень, Суффикс и Окончание теперь твоя команда.",
      schemeWord: "sputniki",
      abilities: [
        { icon: "🌳", text: "Я нахожу корень и семью слова" },
        { icon: "🔲", text: "Я отличаю форму слова от нового слова" },
        { icon: "🚀", text: "Я вижу, как приставка меняет смысл" },
        { icon: "🛠️", text: "Я вижу, как суффикс создаёт новое слово" }
      ],
      notes: [
        { title: "Приставка", text: "Стоит перед корнем и помогает образовывать новые слова.", example: "в-ходит" },
        { title: "Корень", text: "Общая часть родственных слов, хранит главный смысл.", example: "гриб" },
        { title: "Суффикс", text: "Стоит после корня и помогает образовывать новые слова.", example: "дом-ик" },
        { title: "Окончание", text: "Меняет форму слова и помогает словам дружить в предложении.", example: "берёз-а / берёз-ы" }
      ]
    },
    maps: {
      parts: [
        { id: "start", title: "Старт", icon: "🏠", kind: "start" },
        { id: "zone_root", title: "Глава I. Корень", icon: "🌳", kind: "bridge", zone: "root" },
        { id: "root_meet", title: "Знакомство с Корнем", icon: "🌳", zone: "root" },
        { id: "root_family", title: "Найди родственников", icon: "👨‍👦", zone: "root" },
        { id: "root_tree", title: "Гриб. Родственные слова", icon: "🍄", zone: "root" },
        { id: "root_hide", title: "Что хранит Корень?", icon: "🍃", zone: "root" },
        { id: "root_three", title: "Три группы", icon: "🌲", zone: "root" },
        { id: "root_lookalike", title: "Однокоренные или похожие?", icon: "🦊", zone: "root" },
        { id: "root_find", title: "Найди корень сам", icon: "⭐", zone: "root" },
        { id: "zone_ending", title: "Глава II. Окончание", icon: "🔲", kind: "bridge", zone: "ending" },
        { id: "end_clothes", title: "Окончание меняет форму слова", icon: "🍎", zone: "ending" },
        { id: "end_dress", title: "Подставь окончание", icon: "🌿", zone: "ending" },
        { id: "end_pine", title: "Сосна и река", icon: "🌲", zone: "ending" },
        { id: "end_fix", title: "Почини предложение", icon: "⛈️", zone: "ending" },
        { id: "end_or_new", title: "Форма или новое слово?", icon: "🌉", zone: "ending" },
        { id: "end_zero", title: "Невидимое окончание", icon: "□", zone: "ending" },
        { id: "zone_prefix", title: "Глава III. Приставка", icon: "🚀", kind: "bridge", zone: "prefix" },
        { id: "pre_meet", title: "Приставка впереди", icon: "🚪", zone: "prefix" },
        { id: "pre_go", title: "Куда идёт герой?", icon: "🚶", zone: "prefix" },
        { id: "pre_meaning", title: "Приставка меняет смысл", icon: "🔔", zone: "prefix" },
        { id: "pre_find", title: "Найди приставку", icon: "🔎", zone: "prefix" },
        { id: "zone_suffix", title: "Глава IV. Суффикс", icon: "🛠️", kind: "bridge", zone: "suffix" },
        { id: "suf_house", title: "Создатель новых слов", icon: "🏠", zone: "suffix" },
        { id: "suf_elephant", title: "Слоновая семья", icon: "🐘", zone: "suffix" },
        { id: "suf_meaning", title: "Что означает суффикс?", icon: "🐯", zone: "suffix" },
        { id: "suf_who", title: "Кто сделал слово?", icon: "⚽", zone: "suffix" },
        { id: "suf_or_prefix", title: "Приставка или суффикс?", icon: "↔️", zone: "suffix" },
        { id: "zone_team", title: "Глава V. Вся команда", icon: "🏆", kind: "bridge", zone: "team" },
        { id: "team_sputnik", title: "Спутники", icon: "🌙", zone: "team" },
        { id: "team_parse", title: "Разбери слово", icon: "🧩", zone: "team" },
        { id: "team_needed", title: "Кто лишний?", icon: "❓", zone: "team" },
        { id: "team_builder", title: "Слово-конструктор", icon: "🧱", zone: "team" },
        { id: "team_new_or_form", title: "Новое слово или форма?", icon: "🚪", zone: "team" },
        { id: "team_broken", title: "Сломанные слова", icon: "⚙️", zone: "team" },
        { id: "team_exam", title: "Финальное испытание", icon: "🏰", zone: "team" },
        { id: "finish", title: "Финиш", icon: "🏆", kind: "finish", zone: "team" }
      ]
    },
    finalChallengePool: [
      choice("Кто хранит главный смысл слова?", ["корень", "окончание", "приставка"], "корень"),
      choice("Кто меняет форму одного и того же слова?", ["окончание", "суффикс", "приставка"], "окончание"),
      choice("Кто всегда стоит перед корнем?", ["приставка", "суффикс", "окончание"], "приставка"),
      choice("Кто стоит после корня и создаёт новое слово?", ["суффикс", "приставка", "окончание"], "суффикс"),
      choice("Нулевое окончание — это...", ["окончание, которое не выражено буквами", "когда окончания нет совсем"], "окончание, которое не выражено буквами"),
      choice("Слова гриб, грибок, грибник — это...", ["однокоренные слова", "формы одного слова", "просто похожие буквы"], "однокоренные слова"),
      choice("Какой разбор верен для слова спутники?", ["с-пут-ник-и", "спу-тник-и", "спут-ники"], "с-пут-ник-и"),
      choice("пальто не изменяется. Значит...", ["окончания нет", "окончание нулевое", "есть суффикс -о"], "окончания нет")
    ],
    exercises: {}
  };

  var E = window.FOREST_DATA.exercises;

  E.root_meet = {
    type: "meetCharacter",
    title: "Я Корень",
    scene: "tree-roots",
    guardian: "root",
    quote: "Я Корень. Я храню главный смысл слова.",
    question: "Познакомься с Корнем. Он самый спокойный и собирает семью слова.",
    owl: "Я Корень. Я храню главный смысл слова.",
    answer: "ok",
    options: ["ok"],
    hint: "Нажми кнопку, когда запомнишь Корня.",
    success: "Без Корня у слова нет главного смысла.",
    speak: "Я Корень. Я храню главный смысл слова."
  };

  E.root_family = {
    type: "rounds",
    title: "Найди родственников",
    guardian: "root",
    owl: "У родственных слов есть общая часть и близкое значение.",
    hint: "Ищи слова с общей частью и похожим смыслом.",
    hint2: "В каждой россыпи три родственника.",
    success: "Родственные слова держатся за один корень.",
    speak: "Найди родственные слова.",
    rounds: [
      {
        type: "wordFamily",
        scene: "brothers",
        question: "Найди родственников слова «брат».",
        root: "брат",
        tokens: [
          { text: "брат", role: "family" },
          { text: "братик", role: "family" },
          { text: "братишка", role: "family" },
          { text: "барабан", role: "other" },
          { text: "дом", role: "other" }
        ],
        extraHint: "Барабан не из семьи брата."
      },
      {
        type: "wordFamily",
        scene: "drum",
        question: "Найди родственников слова «барабан».",
        root: "барабан",
        tokens: [
          { text: "барабан", role: "family" },
          { text: "барабанщик", role: "family" },
          { text: "барабанный", role: "family" },
          { text: "брат", role: "other" },
          { text: "рыбак", role: "other" }
        ]
      },
      {
        type: "wordFamily",
        scene: "fish-family",
        question: "Найди родственников слова «рыба».",
        root: "рыб",
        tokens: [
          { text: "рыба", role: "family" },
          { text: "рыбёшка", role: "family" },
          { text: "рыбак", role: "family" },
          { text: "гриб", role: "other" },
          { text: "берег", role: "other" }
        ]
      }
    ]
  };

  E.root_tree = {
    type: "wordFamilyTree",
    title: "Гриб. Родственные слова",
    guardian: "root",
    scene: "mushroom",
    center: "ГРИБ",
    root: "гриб",
    question: "Найди родственные слова для слова «гриб».",
    owl: "Корень умеет находить родственные слова.",
    hint: "У родственных слов общий смысл и общая часть гриб.",
    hint2: "Подберёзовик — другой гриб, но другое слово.",
    extraHint: "Ягода, лесник и подберёзовик — не родственные слову «гриб».",
    success: "Корень гриб держит грибок, грибник и грибной.",
    speak: "Найди родственные слова для слова гриб.",
    tokens: [
      { text: "грибок", role: "family", scene: "mushroom-small" },
      { text: "грибник", role: "family", scene: "mushroom-picker" },
      { text: "грибной", role: "family", scene: "mushroom-soup" },
      { text: "ягода", role: "other", scene: "cranberry" },
      { text: "лесник", role: "other", scene: "oak" },
      { text: "подберёзовик", role: "other", scene: "birch" }
    ]
  };

  E.root_hide = {
    type: "rounds",
    title: "Что хранит Корень?",
    guardian: "root",
    owl: "Без корня мы не узнаем слово.",
    hint: "Без корня исчезает главный общий смысл.",
    success: "Без корня мы не узнаем слово.",
    speak: "Что будет, если спрятать корень?",
    rounds: [
      {
        type: "hideRoot",
        covers: [{ left: "трава", right: "травка", root: "трав" }],
        owl: "Без корня мы не узнаем слово.",
        coverPrompt: "Угадаешь слово?",
        options: ["Нет", "Да"],
        answer: "Нет"
      },
      {
        type: "hideRoot",
        covers: [{ left: "шум", right: "шуметь", root: "шум" }],
        question: "Без корня остался смысл?",
        options: ["Да", "Нет"],
        answer: "Нет"
      },
      {
        type: "hideRoot",
        covers: [{ left: "смелый", right: "смелость", root: "смел" }],
        question: "Без корня остался смысл?",
        options: ["Да", "Нет"],
        answer: "Нет"
      }
    ]
  };

  E.root_three = {
    type: "classification",
    title: "Три группы",
    guardian: "root",
    scene: false,
    compact: true,
    question: "Разложи слова по трём родственным группам.",
    owl: "В каждой группе один корень.",
    hint: "море, моряк, морской держатся за мор-.",
    hint2: "свет- и бел- — две другие группы.",
    success: "Три корня зажглись: мор-, свет-, бел-.",
    speak: "Разложи слова по трём родственным группам.",
    groups: [
      { id: "more", title: "мор-", root: "мор" },
      { id: "svet", title: "свет-", root: "свет" },
      { id: "bel", title: "бел-", root: "бел" }
    ],
    items: [
      { id: "a", text: "море", group: "more", scene: "sea" },
      { id: "b", text: "моряк", group: "more", scene: "sea-sailor" },
      { id: "c", text: "морской", group: "more", scene: "ships" },
      { id: "d", text: "свет", group: "svet", scene: "light-lamp" },
      { id: "e", text: "светить", group: "svet", scene: "shine" },
      { id: "f", text: "светлый", group: "svet", scene: "bright-grove" },
      { id: "g", text: "белый", group: "bel", scene: "white-hare" },
      { id: "h", text: "беленький", group: "bel", scene: "white-kitten" },
      { id: "i", text: "белеет", group: "bel", scene: "snow-white" }
    ]
  };

  E.root_lookalike = {
    type: "rounds",
    title: "Однокоренные или похожие?",
    guardian: "root",
    owl: "Чтобы слова были однокоренными, мало похожих букв. Нужен общий смысл.",
    hint: "Сравни смысл, а не только буквы.",
    success: "Похожие буквы ещё не делают слова родственными.",
    speak: "Однокоренные или похожие?",
    rounds: [
      choice("гора — горный", ["однокоренные", "просто похожие буквы"], "однокоренные", { scene: "mountain", guardian: "root" }),
      choice("лиса — леса", ["однокоренные", "просто похожие буквы"], "просто похожие буквы", { scene: "fox" }),
      choice("оса — осина", ["однокоренные", "просто похожие буквы"], "просто похожие буквы", { scene: "wasp-aspen" }),
      choice("корм — кормить", ["однокоренные", "просто похожие буквы"], "однокоренные", { scene: "feed-bowl" })
    ]
  };

  E.root_find = {
    type: "rounds",
    title: "Найди корень сам",
    guardian: "root",
    owl: "Пойми значение, подбери родственников, сравни, найди общую часть.",
    hint: "Сначала придумай родственные слова, потом ищи общую часть.",
    hint2: "Для одной буквы нажми её дважды.",
    success: "Ты нашёл корень сам.",
    speak: "Найди корень.",
    rounds: [
      { type: "markWordPart", scene: "drum", word: "барабанщик", part: "root", answer: [0, 6], prompt: "барабанщик", question: "Подбери барабан, барабанный. Какая общая часть?" },
      { type: "markWordPart", scene: "sea-sailor", word: "моряк", part: "root", answer: [0, 2], prompt: "моряк", question: "море, морской, моряк. Найди корень." },
      { type: "markWordPart", scene: "mushroom-picker", word: "грибник", part: "root", answer: [0, 3], prompt: "грибник", question: "гриб, грибок, грибной. Найди корень." }
    ]
  };

  E.end_clothes = {
    type: "rounds",
    title: "Окончание меняет форму слова",
    guardian: "ending",
    owl: "Я Окончание. Я меняюсь, чтобы слова могли дружить друг с другом.",
    hint: "Если смысл тот же, а изменился только конец — это форма.",
    success: "Само дерево остаётся тем же. Окончание меняет форму.",
    speak: "Появилось новое слово или изменилась форма?",
    rounds: [
      choice("яблоко → яблоки", ["изменилась форма", "появилось новое слово"], "изменилась форма", { scene: "apples-many", gallery: ["apple", "apples-many"] }),
      choice("звезда → звёзды", ["изменилась форма", "появилось новое слово"], "изменилась форма", { gallery: ["star-sky", "stars-many"] }),
      choice("лисица → лисицы", ["изменилась форма", "появилось новое слово"], "изменилась форма", { scene: "foxes" })
    ]
  };

  E.end_dress = {
    type: "rounds",
    title: "Подставь окончание",
    guardian: "ending",
    scene: "birch",
    owl: "Надень на меня нужный костюм.",
    hint: "Спроси: у кого? к кому? над кем?",
    success: "Дерево то же, костюм другой.",
    speak: "Подбери окончание.",
    rounds: [
      { type: "formDress", stem: "берёз", question: "Одно дерево. Какое окончание?", endings: ["а", "ы", "е", "ой"], answer: "а", prompt: "берёз-□" },
      { type: "formDress", stem: "берёз", question: "У берёз-□", endings: ["а", "ы", "е", "ой"], answer: "ы" },
      { type: "formDress", stem: "берёз", question: "К берёз-□", endings: ["а", "ы", "е", "ой"], answer: "е" },
      { type: "formDress", stem: "берёз", question: "Над берёз-□", endings: ["а", "ы", "е", "ой"], answer: "ой" }
    ]
  };

  E.end_pine = {
    type: "rounds",
    title: "Сосна и река",
    guardian: "ending",
    owl: "Найди часть, которая меняется.",
    hint: "Начало слова стоит на месте. Меняется конец.",
    success: "Меняется окончание.",
    speak: "Какая часть меняется?",
    rounds: [
      {
        type: "singleChoice",
        scene: "pine",
        forms: [
          { word: "сосна", ending: "а" },
          { word: "сосны", ending: "ы" },
          { word: "сосне", ending: "е" },
          { word: "сосной", ending: "ой" }
        ],
        question: "сосна, у сосны, к сосне, под сосной. Что меняется?",
        options: ["окончание", "корень", "всё слово"],
        answer: "окончание"
      },
      {
        type: "singleChoice",
        scene: "river",
        forms: [
          { word: "река", ending: "а" },
          { word: "реки", ending: "и" },
          { word: "реке", ending: "е" },
          { word: "рекой", ending: "ой" }
        ],
        question: "река, у реки, по реке, над рекой. Что меняется?",
        options: ["окончание", "корень", "приставка"],
        answer: "окончание"
      }
    ]
  };

  E.end_fix = {
    type: "rounds",
    title: "Почини предложение",
    guardian: "ending",
    owl: "Окончание помогает связывать слова.",
    hint: "Спроси: после чего? перед чем? к чему?",
    success: "Окончание подружило слова в предложении.",
    speak: "Выбери нужную форму.",
    rounds: [
      { type: "insertWord", scene: "storm-after", sentence: "После □ хорошо клюёт рыба.", question: "Какое окончание нужно?", options: ["гроза", "грозы", "грозе", "грозой"], answer: "грозы" },
      { type: "insertWord", scene: "storm-before", sentence: "Перед □ лес притихает.", question: "Какое окончание нужно?", options: ["гроза", "грозы", "грозе", "грозой"], answer: "грозой" },
      { type: "insertWord", scene: "anthill", sentence: "Муравьи прячутся к □.", question: "Какое окончание нужно?", options: ["гроза", "грозы", "грозе", "грозой"], answer: "грозе" }
    ]
  };

  E.end_or_new = {
    type: "rounds",
    title: "Форма или новое слово?",
    guardian: "ending",
    owl: "Форма слова: это то же самое слово, но с другим окончанием.",
    hint: "Новое слово: это другое слово со своим значением. Оно может быть родственным исходному слову.",
    tips: [
      { title: "Форма слова", text: "Это то же самое слово, но с другим окончанием." },
      { title: "Новое слово", text: "Это другое слово со своим значением. Оно может быть родственным исходному слову." }
    ],
    success: "Ты отличаешь форму от однокоренного слова.",
    speak: "Это форма или новое слово?",
    rounds: [
      choice("рука → руки", ["форма", "новое однокоренное слово"], "форма"),
      choice("роса → росинка", ["форма", "новое однокоренное слово"], "новое однокоренное слово"),
      choice("торт → торты", ["форма", "новое однокоренное слово"], "форма"),
      choice("трава → травка", ["форма", "новое однокоренное слово"], "новое однокоренное слово"),
      choice("масло → маслице", ["форма", "новое однокоренное слово"], "новое однокоренное слово"),
      choice("море → моря", ["форма", "новое однокоренное слово"], "форма")
    ]
  };

  E.end_zero = {
    type: "rounds",
    title: "Невидимое окончание",
    guardian: "ending",
    owl: "Нулевое окончание и «окончания нет» — это разное.",
    hint: "Если слово изменяется, окончание есть, даже когда букв не видно.",
    hint2: "пальто не изменяется — окончания нет.",
    success: "Нулевое окончание не равно отсутствию окончания.",
    speak: "Нулевое окончание или окончания нет?",
    rounds: [
      {
        type: "singleChoice",
        scene: "town",
        forms: [
          { word: "город", ending: "" },
          { word: "города", ending: "а" },
          { word: "городу", ending: "у" }
        ],
        question: "В слове город окончание не видно буквами. Как это называется?",
        options: ["нулевое окончание", "окончания нет", "это приставка"],
        answer: "нулевое окончание"
      },
      {
        type: "singleChoice",
        scene: "palto",
        question: "Слово пальто не изменяется: пальто, пальто, пальто. Что верно?",
        options: ["окончания нет", "нулевое окончание", "окончание -о"],
        answer: "окончания нет"
      },
      choice("Нулевое окончание и «окончания нет» — это одно и то же?", ["нет, это разное", "да, это одно и то же"], "нет, это разное")
    ]
  };

  E.pre_meet = {
    type: "rounds",
    title: "Приставка впереди",
    guardian: "prefix",
    scene: "house",
    owl: "Я всегда стараюсь встать перед Корнем!",
    hint: "Приставка стоит перед корнем и может изменить действие.",
    success: "Приставка встала перед ходом и изменила слово.",
    speak: "Приставка всегда встаёт перед корнем.",
    rounds: [
      {
        type: "meetCharacter",
        guardian: "prefix",
        quote: "Я Приставка! Я всегда встаю перед Корнем.",
        question: "Запомни: в школе эту часть называют приставкой.",
        answer: "ok",
        options: ["ok"]
      },
      choice("Куда встаёт приставка?", ["перед корнем", "после корня", "вместо окончания"], "перед корнем", { prompt: "ХОД" }),
      choice("в + ходит =", ["входит", "выходит", "подходит"], "входит")
    ]
  };

  E.pre_go = {
    type: "rounds",
    title: "Куда идёт герой?",
    guardian: "prefix",
    owl: "Выбери приставку по картинке.",
    hint: "в- — внутрь, вы- — наружу, под- — ближе.",
    success: "Приставка изменила направление действия.",
    speak: "Куда идёт герой?",
    rounds: [
      { type: "prefixMove", scene: "prefix-in", question: "Герой входит внутрь. Какая приставка?", options: [{ id: "в-", label: "в-", scene: "prefix-in" }, { id: "вы-", label: "вы-", scene: "prefix-out" }, { id: "под-", label: "под-", scene: "prefix-near" }], answer: "в-" },
      { type: "prefixMove", scene: "prefix-out", question: "Герой выходит наружу. Какая приставка?", options: [{ id: "в-", label: "в-", scene: "prefix-in" }, { id: "вы-", label: "вы-", scene: "prefix-out" }, { id: "под-", label: "под-", scene: "prefix-near" }], answer: "вы-" },
      { type: "prefixMove", scene: "prefix-near", question: "Герой подходит ближе. Какая приставка?", options: [{ id: "в-", label: "в-", scene: "prefix-in" }, { id: "вы-", label: "вы-", scene: "prefix-out" }, { id: "под-", label: "под-", scene: "prefix-near" }], answer: "под-" }
    ]
  };

  E.pre_meaning = {
    type: "rounds",
    title: "Приставка меняет смысл",
    guardian: "prefix",
    owl: "Приставка способна изменить значение действия.",
    hint: "пере- — заново, за- — действие началось.",
    success: "Новая приставка — новое слово.",
    speak: "Как приставка меняет смысл?",
    rounds: [
      choice("пере- + писать. Что получилось?", ["переписать", "записать", "выписать"], "переписать", { scene: "writing" }),
      choice("Что значит переписать?", ["написать заново", "действие началось", "выйти наружу"], "написать заново"),
      choice("за- + звенели. Что получилось?", ["зазвенели", "перезвенели", "вызвенели"], "зазвенели", { scene: "bells" }),
      choice("Что значит зазвенели?", ["Начали звенеть", "написать заново", "выйти наружу"], "Начали звенеть")
    ]
  };

  E.pre_find = {
    type: "rounds",
    title: "Найди приставку",
    guardian: "prefix",
    owl: "Я всегда стою перед Корнем.",
    hint: "Выдели то, что стоит перед корнем.",
    success: "Приставки найдены.",
    speak: "Найди приставку.",
    rounds: [
      { type: "markWordPart", scene: "town", word: "пригород", part: "prefix", answer: [0, 2], prompt: "пригород" },
      { type: "markWordPart", scene: "entrance", word: "подъезд", part: "prefix", answer: [0, 2], prompt: "подъезд" },
      { type: "markWordPart", scene: "plantain", word: "подорожник", part: "prefix", answer: [0, 1], prompt: "подорожник" },
      { type: "markWordPart", scene: "rider", word: "наездник", part: "prefix", answer: [0, 1], prompt: "наездник" }
    ]
  };

  E.suf_house = {
    type: "rounds",
    title: "Создатель новых слов",
    guardian: "suffix",
    scene: "house",
    owl: "Я Суффикс. Добавь меня после Корня — и получится новое слово.",
    hint: "Суффикс стоит после корня и создаёт новый вариант.",
    success: "Суффикс прикрепился к дому и создал новое слово.",
    speak: "Собери новые слова от дома.",
    rounds: [
      {
        type: "meetCharacter",
        guardian: "suffix",
        quote: "Я Суффикс. Добавь меня после Корня — и получится новое слово.",
        question: "Запомни Суффикса. Он создатель новых слов.",
        answer: "ok",
        options: ["ok"]
      },
      {
        type: "suffixMachine",
        question: "Какое слово получится с суффиксом -ик-?",
        base: "ДОМ",
        options: [
          { id: "домик", label: "домик", suffix: "-ик-", scene: "house-small" },
          { id: "домок", label: "домок", suffix: "-ок-", scene: "house" },
          { id: "домище", label: "домище", suffix: "-ищ-", scene: "house-large" }
        ],
        answer: "домик"
      },
      {
        type: "suffixMachine",
        question: "Какое слово получится с суффиксом -ищ-?",
        base: "ДОМ",
        options: [
          { id: "домик", label: "домик", suffix: "-ик-", scene: "house-small" },
          { id: "домишко", label: "домишко", suffix: "-ишк-", scene: "house-shabby" },
          { id: "домище", label: "домище", suffix: "-ищ-", scene: "house-large" }
        ],
        answer: "домище"
      },
      {
        type: "suffixMachine",
        question: "Какое слово получится с суффиксом -ишк-?",
        base: "ДОМ",
        options: [
          { id: "домок", label: "домок", suffix: "-ок-", scene: "house" },
          { id: "домишко", label: "домишко", suffix: "-ишк-", scene: "house-shabby" },
          { id: "домик", label: "домик", suffix: "-ик-", scene: "house-small" }
        ],
        answer: "домишко"
      }
    ]
  };

  E.suf_elephant = {
    type: "matchPairs",
    title: "Слоновая семья",
    guardian: "suffix",
    scene: "elephant-family",
    question: "Соедини слово и того, кого оно называет.",
    owl: "Суффикс создаёт новые слова в одной семье.",
    hint: "слониха — мама, слонёнок — детёныш, слоновый — признак.",
    success: "Суффикс собрал слоновую семью.",
    speak: "Соедини слово и картинку.",
    left: [
      { id: "sloniha", text: "слониха" },
      { id: "slonenok", text: "слонёнок" },
      { id: "slonovy", text: "слоновый" }
    ],
    right: [
      { id: "mom", text: "мама-слон" },
      { id: "baby", text: "детёныш" },
      { id: "adj", text: "признак: чей?" }
    ],
    pairs: { sloniha: "mom", slonenok: "baby", slonovy: "adj" }
  };

  E.suf_meaning = {
    type: "rounds",
    title: "Что означает суффикс?",
    guardian: "suffix",
    owl: "Суффикс не просто буквы. У него есть значение.",
    hint: "-ёнок- — детёныш, -тель- — человек по делу.",
    success: "Ты слышишь смысл суффикса.",
    speak: "Что означает суффикс?",
    rounds: [
      choice("тигр → тигрёнок. Что значит -ёнок-?", ["детёныш", "большой зверь", "форма слова"], "детёныш", { scene: "tiger-cub" }),
      choice("Что означает слово «учитель»?", ["Профессия", "маленький", "форма слова"], "Профессия", { scene: "teacher" })
    ]
  };

  E.suf_who = {
    type: "rounds",
    title: "Кто сделал слово?",
    guardian: "suffix",
    owl: "Найди суффикс. Он стоит после корня.",
    hint: "Ищи меня после Корня.",
    success: "Суффиксы найдены.",
    speak: "Найди суффикс.",
    rounds: [
      { type: "markWordPart", scene: "sea-sailor", word: "моряк", part: "suffix", answer: [3, 4], prompt: "моряк" },
      { type: "markWordPart", scene: "toy", word: "игрушка", part: "suffix", answer: [3, 5], prompt: "игрушка" },
      { type: "markWordPart", scene: "footballer", word: "футболист", part: "suffix", answer: [6, 8], prompt: "футболист" },
      { type: "markWordPart", scene: "sugar-bowl", word: "сахарница", part: "suffix", answer: [5, 7], prompt: "сахарница" }
    ]
  };

  E.suf_or_prefix = {
    type: "rounds",
    title: "Приставка или суффикс?",
    guardian: "suffix",
    owl: "Приставка стоит перед корнем. Суффикс стоит после корня.",
    hint: "при-, в-, под- — приставки. -ник-, -ок-, -ик- — суффиксы.",
    success: "Ты видишь, где стоит выделенная часть.",
    speak: "Посмотри на выделенную часть слова. Это приставка или суффикс?",
    rounds: [
      { type: "sendPart", word: "подводный", part: "под", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "prefix", guardian: "prefix" },
      { type: "sendPart", word: "грибник", part: "ник", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "suffix" },
      { type: "sendPart", word: "пригород", part: "при", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "prefix", guardian: "prefix" },
      { type: "sendPart", word: "грибок", part: "ок", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "suffix" },
      { type: "sendPart", word: "переписать", part: "пере", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "prefix", guardian: "prefix" },
      { type: "sendPart", word: "тигрёнок", part: "ёнок", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "suffix" },
      { type: "sendPart", word: "зазвенели", part: "за", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "prefix", guardian: "prefix" },
      { type: "sendPart", word: "учитель", part: "тель", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "suffix" },
      { type: "sendPart", word: "наездник", part: "на", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "prefix", guardian: "prefix" },
      { type: "sendPart", word: "домик", part: "ик", question: "Посмотри на выделенную часть слова. Это приставка или суффикс?", options: ["prefix", "suffix"], answer: "suffix" }
    ]
  };

  E.team_sputnik = {
    type: "placeTeam",
    title: "Встаньте по местам",
    guardian: "team",
    scene: "companions",
    wordId: "sputniki",
    question: "Поставь части слова спутники к своим персонажам.",
    owl: "Приставка, Корень, Суффикс, Окончание. Всегда в этом порядке.",
    hint: "с- — приставка, -пут- — корень, -ник- — суффикс, -и — окончание.",
    hint2: "Приставка всегда слева, окончание всегда справа.",
    success: "С | ПУТ | НИК | И — вся команда на местах.",
    speak: "Разбери слово спутники.",
    revealWord: "sputniki"
  };

  E.team_parse = {
    type: "rounds",
    title: "Разбери слово",
    guardian: "team",
    owl: "Корень обязателен. Остальные части могут отсутствовать.",
    hint: "Сначала найди корень. Потом посмотри, есть ли кто слева и справа.",
    hint2: "Если слово изменяется, а букв окончания не видно — это нулевое окончание, а не «нет».",
    extraHint: "пальто не изменяется — окончания нет. город изменяется — окончание нулевое.",
    success: "Ты разбираешь слово по составу.",
    speak: "Разбери слово.",
    rounds: [
      {
        type: "parseChoices",
        prompt: "подорожник",
        scene: "plantain",
        question: "Какие части есть в слове?",
        parts: { prefix: "по", root: "дорож", suffix: "ник", ending: "нулевое" },
        options: {
          prefix: ["по", "под", "нет"],
          root: ["дорож", "подорож", "ник"],
          suffix: ["ник", "по", "нет"],
          ending: ["нулевое", "нет", "и"]
        }
      },
      {
        type: "parseChoices",
        prompt: "наездник",
        scene: "rider",
        question: "Какие части есть в слове?",
        parts: { prefix: "на", root: "езд", suffix: "ник", ending: "нулевое" },
        options: {
          prefix: ["на", "над", "нет"],
          root: ["езд", "наезд", "ник"],
          suffix: ["ник", "на", "нет"],
          ending: ["нулевое", "нет", "а"]
        }
      },
      {
        type: "parseChoices",
        prompt: "пригород",
        scene: "town",
        question: "Какие части есть в слове?",
        parts: { prefix: "при", root: "город", suffix: "нет", ending: "нулевое" },
        options: {
          prefix: ["при", "про", "нет"],
          root: ["город", "пригород", "род"],
          suffix: ["нет", "ник", "ок"],
          ending: ["нулевое", "нет", "а"]
        }
      },
      {
        type: "parseChoices",
        prompt: "сахарница",
        scene: "sugar-bowl",
        question: "Какие части есть в слове?",
        parts: { prefix: "нет", root: "сахар", suffix: "ниц", ending: "а" },
        options: {
          prefix: ["нет", "са", "на"],
          root: ["сахар", "ниц", "а"],
          suffix: ["ниц", "ник", "нет"],
          ending: ["а", "нулевое", "нет"]
        }
      },
      {
        type: "parseChoices",
        prompt: "игрушка",
        scene: "toy",
        question: "Какие части есть в слове?",
        parts: { prefix: "нет", root: "игр", suffix: "ушк", ending: "а" },
        options: {
          prefix: ["нет", "и", "за"],
          root: ["игр", "игруш", "ушк"],
          suffix: ["ушк", "ик", "нет"],
          ending: ["а", "нулевое", "нет"]
        }
      },
      {
        type: "parseChoices",
        prompt: "футболист",
        scene: "footballer",
        question: "Какие части есть в слове?",
        parts: { prefix: "нет", root: "футбол", suffix: "ист", ending: "нулевое" },
        options: {
          prefix: ["нет", "фут", "по"],
          root: ["футбол", "ист", "бол"],
          suffix: ["ист", "ник", "нет"],
          ending: ["нулевое", "нет", "ы"]
        }
      }
    ]
  };

  E.team_needed = {
    type: "rounds",
    title: "Кто лишний?",
    guardian: "team",
    scene: "castle",
    owl: "Корень обязателен. Остальные части могут отсутствовать.",
    hint: "Подумай, без кого слово не может жить.",
    success: "Корень обязателен. Приставка и суффикс создают новые слова. Окончание меняет форму.",
    speak: "Кто обязательно должен быть в слове?",
    rounds: [
      choice("Кто обязательно должен быть в слове?", ["корень", "приставка", "суффикс", "окончание"], "корень"),
      choice("Кто может меняться при изменении формы?", ["окончание", "корень", "приставка"], "окончание"),
      choice("Кто обычно создаёт новые слова?", ["приставка и суффикс", "только окончание", "только корень"], "приставка и суффикс")
    ]
  };

  E.team_builder = {
    type: "rounds",
    title: "Слово-конструктор",
    guardian: "team",
    scene: "workshop",
    owl: "Собери слово из частей. Порядок всегда один: приставка, корень, суффикс, окончание.",
    hint: "Сначала то, что перед корнем.",
    success: "Из частей возникло значение.",
    speak: "Собери слово.",
    rounds: [
      {
        type: "wordBuilder",
        wordId: "naezdnik",
        question: "Собери слово наездник.",
        parts: [
          { type: "prefix", text: "на" },
          { type: "root", text: "езд" },
          { type: "suffix", text: "ник" }
        ],
        distractors: [
          { type: "prefix", text: "по" },
          { type: "ending", text: "а" }
        ]
      },
      {
        type: "wordBuilder",
        wordId: "podorozhnik",
        question: "Собери слово подорожник.",
        parts: [
          { type: "prefix", text: "по" },
          { type: "root", text: "дорож" },
          { type: "suffix", text: "ник" }
        ],
        distractors: [{ type: "prefix", text: "под" }]
      }
    ]
  };

  E.team_new_or_form = {
    type: "rounds",
    title: "Новое слово или новая форма?",
    guardian: "team",
    owl: "Приставка и суффикс создают новое слово. Окончание создаёт новую форму.",
    hint: "Кто изменился: одежда Окончания или появился новый житель семьи?",
    success: "Вся команда работает по своим правилам.",
    speak: "Новое слово или новая форма?",
    rounds: [
      choice("лес → лесок", ["новое слово, суффикс", "форма, окончание", "новое слово, приставка"], "новое слово, суффикс"),
      choice("лес → леса", ["форма, окончание", "новое слово, суффикс", "новое слово, приставка"], "форма, окончание"),
      choice("ходить → выходить", ["новое слово, приставка", "форма, окончание", "новое слово, суффикс"], "новое слово, приставка")
    ]
  };

  E.team_broken = {
    type: "rounds",
    title: "Сломанные слова",
    guardian: "team",
    scene: "workshop",
    owl: "Части слова перепутались. Найди ошибку.",
    hint: "Проверь, все ли части на своих местах и нет ли лишних.",
    success: "Слова собраны верно.",
    speak: "Слово собрано верно?",
    rounds: [
      {
        type: "brokenMachine",
        prompt: "ПРИ | ГОРОД | НИК",
        chunks: [
          { text: "ПРИ", ok: true },
          { text: "ГОРОД", ok: true },
          { text: "НИК", ok: false }
        ],
        question: "Слово «пригородник» собрано верно?",
        options: ["Нет, лишние части", "да, всё верно"],
        answer: "Нет, лишние части"
      },
      {
        type: "brokenMachine",
        prompt: "ПОД | ДОРОЖ | НИК",
        chunks: [
          { text: "ПОД", ok: false },
          { text: "ДОРОЖ", ok: true },
          { text: "НИК", ok: true }
        ],
        question: "Так собирается подорожник?",
        options: ["нет, приставка по-, а не под-", "да, всё верно"],
        answer: "нет, приставка по-, а не под-"
      },
      {
        type: "brokenMachine",
        prompt: "НА | ЕЗД | НИК",
        chunks: [
          { text: "НА", ok: true },
          { text: "ЕЗД", ok: true },
          { text: "НИК", ok: true }
        ],
        question: "Слово наездник собрано верно?",
        options: ["да, всё верно", "нет, корень не тот"],
        answer: "да, всё верно"
      },
      {
        type: "brokenMachine",
        prompt: "С | ПУТ | НИК",
        chunks: [
          { text: "С", ok: true },
          { text: "ПУТ", ok: true },
          { text: "НИК", ok: true }
        ],
        question: "Слово «спутник» собрано верно?",
        options: ["да, всё верно", "Нет, суффикс неправильный"],
        answer: "да, всё верно"
      }
    ]
  };

  E.team_exam = {
    type: "examRooms",
    title: "Финальное испытание",
    guardian: "team",
    scene: "castle",
    owl: "Пять коротких проверок в каждой комнате.",
    hint: "Вспомни правило персонажа этой комнаты.",
    success: "Ты прошёл финальное испытание Замка состава слова!",
    speak: "Финальное испытание. Пройди все комнаты Замка состава слова.",
    rooms: examRooms
  };
})();
