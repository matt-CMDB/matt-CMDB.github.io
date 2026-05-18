// Level 1 data + level map for the full 15-step ascent.
// English is primary text. Hebrew is reserved for terms.

window.KODSHIM_DATA = {
  // ── The fifteen steps ────────────────────────────────────────────────
  // Names for steps 1–5 come from the source CSV. Steps 6–15 are
  // placeholder topics on the road through Sefer Avodah / Korbanot.
  levels: [
    { num:  1, name: "Which animals & when",       state: "active" },
    { num:  2, name: "Basic categorization",       state: "locked" },
    { num:  3, name: "Who brings what korban",     state: "locked" },
    { num:  4, name: "Olah, chatat & asham",       state: "locked" },
    { num:  5, name: "Communal korbanot",          state: "locked" },
    { num:  6, name: "The altar & its fire",       state: "locked" },
    { num:  7, name: "Disqualifications & blemishes", state: "locked" },
    { num:  8, name: "The four avodot",            state: "locked" },
    { num:  9, name: "Eating the korbanot",        state: "locked" },
    { num: 10, name: "Impurity in the Mikdash",    state: "locked" },
    { num: 11, name: "Misappropriation (Meilah)",  state: "locked" },
    { num: 12, name: "The Pesach offering",        state: "locked" },
    { num: 13, name: "Festival musafim",           state: "locked" },
    { num: 14, name: "Yom Kippur service",         state: "locked" },
    { num: 15, name: "The Kohen Gadol's avodah",   state: "locked" }
  ],

  // ── LEARN PART A — animal vocabulary ─────────────────────────────────
  // The Hebrew word IS the term — it stays large. English is the gloss.
  vocab: [
    { hebrew: "עֵגֶל",      translit: "egel",       english: "young male cow — a calf",                group: "cow"   },
    { hebrew: "עֶגְלָה",    translit: "eglah",      english: "young female cow — a heifer",            group: "cow"   },
    { hebrew: "פַּר",       translit: "par",        english: "adult male cow — a bull (also: shor — שׁוֹר)", group: "cow"  },
    { hebrew: "פָּרָה",     translit: "parah",      english: "adult female cow",                        group: "cow"   },
    { hebrew: "כֶּבֶשׂ",    translit: "keves",      english: "young male sheep, under one year — a lamb", group: "sheep" },
    { hebrew: "כִּבְשָׂה",  translit: "kivsah",     english: "young female sheep — a young ewe",        group: "sheep" },
    { hebrew: "אַיִל",      translit: "ayil",       english: "adult male sheep — a ram",                 group: "sheep" },
    { hebrew: "רָחֵל",      translit: "rachel",     english: "adult female sheep — a ewe",               group: "sheep" },
    { hebrew: "גְּדִי",     translit: "gedi",       english: "young male goat — a kid",                  group: "goat"  },
    { hebrew: "שְׂעִירָה",  translit: "se'irah",    english: "young female goat (also: gediyah — גְּדִיָּה)", group: "goat" },
    { hebrew: "תַּיִשׁ",    translit: "tayish",     english: "adult male goat (also: sa'ir — שָׂעִיר)", group: "goat"  },
    { hebrew: "עֵז",        translit: "ez",         english: "adult female goat",                        group: "goat"  },
    { hebrew: "תּוֹר",      translit: "tor",        english: "turtledove (plural: torim — תּוֹרִים)",   group: "bird"  },
    { hebrew: "בֶּן יוֹנָה", translit: "ben yonah", english: "young pigeon (plural: bnei yonah — בְּנֵי יוֹנָה)", group: "bird" }
  ],

  // Group labels for the vocab pill and quiz buckets.
  groups: {
    cow:   { en: "Cattle", he: "בָּקָר",     tl: "bakar"    },
    sheep: { en: "Sheep",  he: "כְּבָשִׂים", tl: "kevasim"  },
    goat:  { en: "Goats",  he: "עִזִּים",   tl: "izim"     },
    bird:  { en: "Birds",  he: "עוֹף",       tl: "of"       }
  },

  // ── LEARN PART B — concept screens ───────────────────────────────────
  // English question + English answer.
  // `terms` are the Hebrew terms relevant to that concept — shown as chips.
  concepts: [
    {
      question: "From what species of mammals may a korban be brought?",
      answer:   "Three: cattle, sheep, and goats.",
      terms: [
        { he: "בָּקָר",     tl: "bakar",    en: "cattle" },
        { he: "כְּבָשִׂים", tl: "kevasim",  en: "sheep" },
        { he: "עִזִּים",   tl: "izim",     en: "goats" }
      ],
      tanach: "Vayikra 1:2",
      rambam: "Maaseh HaKorbanot 1:1"
    },
    {
      question: "From what species of birds may a korban be brought?",
      answer:   "Two: turtledoves and young pigeons.",
      terms: [
        { he: "תּוֹרִים",     tl: "torim",     en: "turtledoves" },
        { he: "בְּנֵי יוֹנָה", tl: "bnei yonah", en: "young pigeons" }
      ],
      tanach: "Vayikra 1:14",
      rambam: "Maaseh HaKorbanot 1:1"
    },
    {
      question: "How many species in total may be used for korbanot?",
      answer:   "Five — three mammals and two birds.",
      terms: [],
      rambam: "Maaseh HaKorbanot 1:1"
    },
    {
      question: "Are turtledoves and young pigeons used at the same age?",
      answer:   "No — the rule is the opposite. A turtledove is fit only when adult; a pigeon is fit only when young.",
      terms: [
        { he: "תּוֹר",      tl: "tor",      en: "turtledove (must be adult)" },
        { he: "בֶּן יוֹנָה", tl: "ben yonah", en: "young pigeon (must be young)" }
      ],
      rambam: "Maaseh HaKorbanot 1:14"
    },
    {
      question: "From what age may an animal be offered as a korban?",
      answer:   "From the eighth day of its life onward. Ideally, from the thirtieth day.",
      terms: [],
      tanach: "Vayikra 22:27",
      rambam: "Maaseh HaKorbanot 1:12"
    },
    {
      question: "What is the maximum age for cattle offered as a korban?",
      answer:   "Three years old.",
      terms: [{ he: "בָּקָר", tl: "bakar", en: "cattle" }],
      rambam: "Maaseh HaKorbanot 1:12"
    },
    {
      question: "What is the maximum age for sheep or goats?",
      answer:   "Two years old.",
      terms: [
        { he: "כְּבָשִׂים", tl: "kevasim", en: "sheep" },
        { he: "עִזִּים",   tl: "izim",    en: "goats" }
      ],
      rambam: "Maaseh HaKorbanot 1:12"
    },
    {
      question: "Until what age is a sheep called a keves rather than an ayil?",
      answer:   "Until it completes its first year. After that, a male sheep is an ayil.",
      terms: [
        { he: "כֶּבֶשׂ", tl: "keves", en: "lamb (under one year)" },
        { he: "אַיִל",   tl: "ayil",  en: "ram (one year and older)" }
      ],
      rambam: "Maaseh HaKorbanot 1:14"
    },
    {
      question: "From which species may an olah be brought?",
      answer:   "Male cattle, male sheep, or male goats — or turtledoves or young pigeons (of either sex).",
      terms: [{ he: "עוֹלָה", tl: "olah", en: "burnt offering" }],
      tanach: "Vayikra 1:3",
      rambam: "Maaseh HaKorbanot 1:8"
    },
    {
      question: "From which species may a chatat be brought?",
      answer:   "From all five species — cattle, sheep, goats, turtledoves, or young pigeons — male or female.",
      terms: [{ he: "חַטָּאת", tl: "chatat", en: "sin offering" }],
      tanach: "Vayikra 4:3",
      rambam: "Maaseh HaKorbanot 1:9"
    },
    {
      question: "From which species may an asham be brought?",
      answer:   "Only from male sheep — never from cattle, goats, or birds.",
      terms: [{ he: "אָשָׁם", tl: "asham", en: "guilt offering" }],
      tanach: "Vayikra 5:15",
      rambam: "Maaseh HaKorbanot 1:10"
    },
    {
      question: "From which species may shelamim be brought?",
      answer:   "From cattle, sheep, or goats — male or female. There are no bird shelamim.",
      terms: [{ he: "שְׁלָמִים", tl: "shelamim", en: "peace offering" }],
      tanach: "Vayikra 3:1",
      rambam: "Maaseh HaKorbanot 1:11"
    },
    {
      question: "Why are there no bird shelamim?",
      answer:   "The Torah did not include birds in the shelamim section; and shelamim's structure — eimurin burned on the altar, portions to the kohen, portions to the owner — does not fit a bird.",
      terms: [
        { he: "שְׁלָמִים",   tl: "shelamim", en: "peace offering" },
        { he: "אֵימוּרִין", tl: "eimurin",  en: "fats burned on the altar" }
      ],
      rambam: "Maaseh HaKorbanot 1:11"
    },
    {
      question: "May a male animal be brought as an individual chatat?",
      answer:   "Generally no — a chatat yachid is always female. The exceptions are: a nasi, a kohen mashiach, and the kohen gadol on Yom Kippur.",
      terms: [
        { he: "חַטָּאת",          tl: "chatat",        en: "sin offering" },
        { he: "נָשִׂיא",          tl: "nasi",          en: "tribal leader / king" },
        { he: "כֹּהֵן מָשִׁיחַ", tl: "kohen mashiach", en: "anointed high priest" }
      ],
      rambam: "Maaseh HaKorbanot 1:14"
    },
    {
      question: "What disqualifies an animal from being a korban?",
      answer:   "A blemish — any physical defect listed in the Torah (such as blindness or a broken limb) renders the animal pasul.",
      terms: [
        { he: "מוּם",  tl: "mum",   en: "blemish" },
        { he: "פָּסוּל", tl: "pasul", en: "disqualified" }
      ],
      tanach: "Vayikra 22:22",
      rambam: "Biat HaMikdash 7:1"
    }
  ],

  // ── QUIZ — English prompts, Hebrew where it's a term ─────────────────
  quiz: [
    {
      kind: "match",
      prompt: "Match each Hebrew word to its meaning.",
      pairs: [
        { hebrew: "עֵגֶל",  english: "young male cow (calf)" },
        { hebrew: "אַיִל",  english: "adult male sheep (ram)" },
        { hebrew: "גְּדִי",  english: "young male goat (kid)" },
        { hebrew: "תּוֹר",  english: "turtledove" }
      ]
    },
    {
      kind: "mc",
      prompt: "From what species of mammals may a korban be brought?",
      options: [
        "Cattle, sheep, and goats",
        "Cattle, sheep, goats, and deer",
        "Sheep and goats only",
        "Any kosher mammal"
      ],
      answer: 0
    },
    {
      kind: "sort",
      prompt: "Sort each animal into its species.",
      buckets: [
        { id: "cow",   he: "בָּקָר",     en: "Cattle" },
        { id: "sheep", he: "כְּבָשִׂים", en: "Sheep" },
        { id: "goat",  he: "עִזִּים",   en: "Goats" }
      ],
      items: [
        { hebrew: "פָּרָה",  translit: "parah",  bucket: "cow"   },
        { hebrew: "כֶּבֶשׂ", translit: "keves",  bucket: "sheep" },
        { hebrew: "תַּיִשׁ", translit: "tayish", bucket: "goat"  },
        { hebrew: "עֶגְלָה", translit: "eglah",  bucket: "cow"   },
        { hebrew: "רָחֵל",   translit: "rachel", bucket: "sheep" },
        { hebrew: "עֵז",     translit: "ez",     bucket: "goat"  }
      ]
    },
    {
      kind: "mc",
      prompt: "How many species in total may be used for korbanot?",
      options: ["Three", "Four", "Five", "Seven"],
      answer: 2
    },
    {
      kind: "tap",
      prompt: "Which Hebrew word means 'adult male cow'?",
      options: ["עֵגֶל", "פַּר", "אַיִל", "תַּיִשׁ"],
      answer: 1
    },
    {
      kind: "mc",
      prompt: "From what age may an animal ideally be offered?",
      options: [
        "From the first day",
        "From the eighth day",
        "From the thirtieth day onward",
        "From one year old"
      ],
      answer: 2
    },
    {
      kind: "match",
      prompt: "Match each species to its maximum age for korbanot.",
      pairs: [
        { hebrew: "בָּקָר",     english: "three years old" },
        { hebrew: "כְּבָשִׂים", english: "two years old"   },
        { hebrew: "עִזִּים",   english: "two years old "  }
      ]
    },
    {
      kind: "mc",
      prompt: "From which species ONLY may an asham be brought?",
      options: [
        "Female sheep",
        "Male sheep only",
        "Any of the five species",
        "Bulls only"
      ],
      answer: 1
    },
    {
      kind: "sort",
      prompt: "Which korbanot can come from birds — and which cannot?",
      buckets: [
        { id: "yes", he: "מן העוף",     en: "Can be a bird" },
        { id: "no",  he: "לא מן העוף", en: "Never a bird"  }
      ],
      items: [
        { hebrew: "עוֹלָה",    translit: "olah",     bucket: "yes" },
        { hebrew: "חַטָּאת",   translit: "chatat",   bucket: "yes" },
        { hebrew: "אָשָׁם",    translit: "asham",    bucket: "no"  },
        { hebrew: "שְׁלָמִים", translit: "shelamim", bucket: "no"  }
      ]
    },
    {
      kind: "mc",
      prompt: "What disqualifies an animal from being a korban?",
      options: [
        "Its color",
        "Being too small",
        "A blemish (mum)",
        "Being born outside Eretz Yisrael"
      ],
      answer: 2
    }
  ]
};
