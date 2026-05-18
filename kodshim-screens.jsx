// Learn (build-slide) and Result screens for Level 1.
// Each slide is a Prezi-style camera: zoom into a focal region,
// fill it on the next click, zoom out on the click after.

const {
  useState:        useStateL,
  useEffect:       useEffectL,
  useRef:          useRefL,
  useLayoutEffect: useLayoutEffectL,
  useCallback:     useCallbackL
} = React;

/* ─── Reveal: fades content in when `on` flips true ─────────────────── */
function Reveal({ on, children, className, style }) {
  const cls = "reveal " + (className || "") + (on ? " is-on" : "");
  return <div className={cls} style={style}>{children}</div>;
}

/* ─── CameraStage: viewport + canvas with animated transform ─────────
   When `focus` is null, the camera fits the whole canvas in the viewport.
   When `focus` matches a `data-focus="key"` element inside the canvas,
   the camera zooms tight on that element. */
function CameraStage({ focus, overlay, children }) {
  const viewportRef = useRefL(null);
  const canvasRef   = useRefL(null);
  const [transform, setTransform] = useStateL("none");

  useLayoutEffectL(() => {
    const recompute = () => {
      const v = viewportRef.current;
      const c = canvasRef.current;
      if (!v || !c) return;

      const vw = v.clientWidth;
      const vh = v.clientHeight;
      const cw = c.offsetWidth;
      const ch = c.offsetHeight;
      if (!vw || !vh || !cw || !ch) return;

      let scale, tx, ty;

      if (!focus) {
        const pad = 0.94;
        scale = Math.min((vw * pad) / cw, (vh * pad) / ch);
        tx = (vw - cw * scale) / 2;
        ty = (vh - ch * scale) / 2;
      } else {
        const fEl = c.querySelector(`[data-focus="${focus}"]`);
        if (!fEl) return;
        let fx = 0, fy = 0, cur = fEl;
        while (cur && cur !== c) {
          fx += cur.offsetLeft;
          fy += cur.offsetTop;
          cur = cur.offsetParent;
        }
        const fw = fEl.offsetWidth;
        const fh = fEl.offsetHeight;
        // Tight zoom — small padding around focus element.
        const padX = 10;
        const padY = 10;
        scale = Math.min(vw / (fw + padX * 2), vh / (fh + padY * 2));
        tx = vw / 2 - (fx + fw / 2) * scale;
        ty = vh / 2 - (fy + fh / 2) * scale;
      }
      setTransform(`translate(${tx}px, ${ty}px) scale(${scale})`);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (canvasRef.current)   ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [focus]);

  return (
    <div className="slide-viewport" ref={viewportRef}>
      <div className="slide-canvas" ref={canvasRef} style={{ transform }}>
        {children}
      </div>
      {overlay && (
        <div className={"slide-overlay" + (focus ? " is-on" : "")}>
          {overlay}
        </div>
      )}
    </div>
  );
}

/* ─── Slide chrome — transparent passthrough.
   Titles/subtitles now live in the LearnScreen header; sources are dropped. */
function SlideFrame({ children }) {
  return children;
}

/* Helper to consume shot scripts: returns r(zoneIdx) and current focus. */
function useShot(script, idx) {
  const cur = script[Math.min(idx, script.length - 1)];
  const r = (n) => cur.reveal >= n;
  return { focus: cur.focus || null, r, cur };
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 0 · Intro — what we're about to learn                        */
/* ═══════════════════════════════════════════════════════════════════ */

const INTRO_LIST = [
  { title: "Two realms, five species",
    blurb: "The whole animal kingdom of korbanos in one tree." },
  { title: "Naming the animals",
    blurb: "Egel, par, ayil, gedi — and when each name applies." },
  { title: "How old is old enough?",
    blurb: "Eligibility windows by the day, and the curious case of pilgas." },
  { title: "The four categories",
    blurb: "Olah, chatat, asham, shlamim — plus three individuals-only." },
  { title: "Animal × korban",
    blurb: "Which species, which sex, and the famous exceptions." },
  { title: "Most holy, lighter holies",
    blurb: "Where each korban is slaughtered, and who eats it." }
];

function SlideIntro() {
  return (
    <SlideFrame
      title="What you're about to learn"
      subtitle="Six slides ahead. Take your time — the kohen gadol won't rush you."
      source="Mishneh Torah, Maaseh HaKorbanot, ch. 1"
    >
      <CameraStage focus={null}>
        <div className="intro-slide">
          <div className="intro-art">
            <img src="assets/boy-learning.png" alt="A student preparing to learn" />
          </div>
          <div className="intro-list">
            <ol>
              {INTRO_LIST.map((row, i) => (
                <li key={i}>
                  <span className="intro-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="intro-li-body">
                    <strong>{row.title}</strong>
                    <p>{row.blurb}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="intro-footnote">Click anywhere — or press → — to begin.</p>
          </div>
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideIntro.shotCount = 1;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 1 · Two realms, five species (tree)                          */
/* ═══════════════════════════════════════════════════════════════════ */

// reveal index meaning:
//   0  base   → Animals, Mammals, Birds nodes
//   1  mammals subtree (cattle, flock, sheep, goats)
//   2  birds subtree (turtle-doves, young pigeons)
//   3  tally pill
const SPECIES_SHOTS = [
  { focus: null,      reveal: 0 }, // overview, just root + branches
  { focus: "mammals", reveal: 0 }, // zoom mammals
  { focus: "mammals", reveal: 1 }, // fill mammals subtree
  { focus: null,      reveal: 1 }, // zoom out
  { focus: "birds",   reveal: 1 }, // zoom birds
  { focus: "birds",   reveal: 2 }, // fill birds subtree
  { focus: null,      reveal: 3 }  // zoom out + tally
];
function SlideSpecies({ shot }) {
  const { focus, r } = useShot(SPECIES_SHOTS, shot);
  return (
    <SlideFrame
      title="Two realms. Five species."
      subtitle="Every korban from the animal kingdom comes from one of these five — and only these five."
      source="Mishneh Torah, Maaseh HaKorbanot 1:1"
    >
      <CameraStage focus={focus}>
        <div className="tree">
          <div className="tree-row tree-root-row">
            <div className="tree-node tree-node-root">
              <span className="en">Animals</span>
              <span className="he">בְּהֵמָה וָעוֹף</span>
            </div>
          </div>

          <div className="tree-row tree-branches">
            {/* Mammals subtree */}
            <div className="tree-branch" data-focus="mammals">
              <div className="tree-node tree-node-branch">
                <span className="en">Mammals</span>
                <span className="he">בְּהֵמָה</span>
                <span className="sub">non-flying</span>
              </div>
              <Reveal on={r(1)} className="tree-children">
                <div className="tree-node tree-node-leaf">
                  <span className="en">Cattle</span>
                  <span className="he">בָּקָר</span>
                </div>
                <div className="tree-sub">
                  <div className="tree-node tree-node-branch tree-node-sm">
                    <span className="en">Flock</span>
                    <span className="he">צֹאן</span>
                  </div>
                  <div className="tree-children-2">
                    <div className="tree-node tree-node-leaf">
                      <span className="en">Sheep</span>
                      <span className="he">כְּבָשִׂים</span>
                    </div>
                    <div className="tree-node tree-node-leaf">
                      <span className="en">Goats</span>
                      <span className="he">עִזִּים</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Birds subtree */}
            <div className="tree-branch" data-focus="birds">
              <div className="tree-node tree-node-branch">
                <span className="en">Birds</span>
                <span className="he">עוֹף</span>
                <span className="sub">flying</span>
              </div>
              <Reveal on={r(2)} className="tree-children">
                <div className="tree-node tree-node-leaf">
                  <span className="en">Turtle-doves</span>
                  <span className="he">תּוֹרִים</span>
                </div>
                <div className="tree-node tree-node-leaf">
                  <span className="en">Young pigeons</span>
                  <span className="he">בְּנֵי יוֹנָה</span>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal on={r(3)} className="tree-tally">
            <span className="tally-num">5</span>
            <span className="tally-label">species in total — three mammals, two birds.</span>
          </Reveal>
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideSpecies.shotCount = SPECIES_SHOTS.length;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 2 · Naming the animals (3 × 3 grid, cell-by-cell)            */
/* ═══════════════════════════════════════════════════════════════════ */

// Each cell: { id, img, he, tl, en, col, row }
const NAMES_COLS = {
  cow:   { he: "בָּקָר",     en: "Cattle" },
  sheep: { he: "כְּבָשִׂים", en: "Sheep"  },
  goat:  { he: "עִזִּים",   en: "Goats"  }
};
const NAMES_ROWS = {
  young:  { en: "young",        sub: "8 days – 1 year" },
  male:   { en: "adult male",   sub: "1 – 3 yr cattle · 1 – 2 yr flock" },
  female: { en: "adult female", sub: "same age window" }
};
const NAMES_CELLS = [
  // Order: row-major (young → male → female), across cols (cow → sheep → goat).
  { id: "cow-young",    col: "cow",   row: "young",  img: "calf.png",                  he: "עֵגֶל",   tl: "egel",   en: "calf" },
  { id: "sheep-young",  col: "sheep", row: "young",  img: "lamb.png",                  he: "כֶּבֶשׂ", tl: "keves",  en: "lamb" },
  { id: "goat-young",   col: "goat",  row: "young",  img: "kid-goat.png",              he: "גְּדִי",   tl: "gedi",   en: "kid" },
  { id: "cow-male",     col: "cow",   row: "male",   img: "cow-male.png",              he: "פַּר",    tl: "par",    en: "bull (also: שׁוֹר shor)" },
  { id: "sheep-male",   col: "sheep", row: "male",   img: "ram.png",                   he: "אַיִל",   tl: "ayil",   en: "ram (from day 31 of yr 2)" },
  { id: "goat-male",    col: "goat",  row: "male",   img: "male-goat.png",             he: "תַּיִשׁ", tl: "tayish", en: "he-goat (also: שָׂעִיר sa'ir)" },
  { id: "cow-female",   col: "cow",   row: "female", img: "cow-f.png",                 he: "פָּרָה",  tl: "parah",  en: "cow" },
  { id: "sheep-female", col: "sheep", row: "female", img: "ewe.png",                   he: "רָחֵל",   tl: "rachel", en: "ewe" },
  { id: "goat-female",  col: "goat",  row: "female", img: "female-goat-never-used.png", he: "עֵז",    tl: "ez",     en: "she-goat" }
];

// Shots: 1 overview empty · then for each cell, pan-in (still empty) + fill · then 1 final overview.
const NAMES_SHOTS = [
  { focus: null, reveal: 0 }
];
NAMES_CELLS.forEach((cell, i) => {
  NAMES_SHOTS.push({ focus: "cell-" + cell.id, reveal: i });     // pan to cell (empty)
  NAMES_SHOTS.push({ focus: "cell-" + cell.id, reveal: i + 1 }); // fill cell
});
NAMES_SHOTS.push({ focus: null, reveal: NAMES_CELLS.length });   // overview, all filled

function SlideNames({ shot }) {
  const { focus, r } = useShot(NAMES_SHOTS, shot);

  // Build overlay (frozen col header + row label) for the currently focused cell.
  let overlay = null;
  if (focus && focus.startsWith("cell-")) {
    const cellId = focus.slice(5);
    const cell = NAMES_CELLS.find((x) => x.id === cellId);
    if (cell) {
      const col = NAMES_COLS[cell.col];
      const row = NAMES_ROWS[cell.row];
      overlay = (
        <>
          <div className="frozen-col-head">
            <span className="he">{col.he}</span>
            <span className="en">{col.en}</span>
          </div>
          <div className="frozen-row-label">
            <span className="en">{row.en}</span>
            <span className="sub">{row.sub}</span>
          </div>
        </>
      );
    }
  }

  return (
    <SlideFrame
      title="Naming the animals"
      subtitle="Each species has its own words for the young and for the grown — the Torah cares which is which."
      source="Mishneh Torah, Maaseh HaKorbanot 1:14"
    >
      <CameraStage focus={focus} overlay={overlay}>
        <div className="ages-grid">
          {/* top-left corner empty */}
          <div className="ages-corner" />
          {/* column headers */}
          {["cow", "sheep", "goat"].map((c) => (
            <div className="ages-col-head" key={c}>
              <span className="he">{NAMES_COLS[c].he}</span>
              <span className="en">{NAMES_COLS[c].en}</span>
            </div>
          ))}
          {/* each row: row-label + 3 cells */}
          {["young", "male", "female"].map((rowKey) => (
            <React.Fragment key={rowKey}>
              <div className="ages-rowlabel">
                <span className="en">{NAMES_ROWS[rowKey].en}</span>
                <span className="sub">{NAMES_ROWS[rowKey].sub}</span>
              </div>
              {["cow", "sheep", "goat"].map((colKey) => {
                const cell = NAMES_CELLS.find((x) => x.col === colKey && x.row === rowKey);
                const idx  = NAMES_CELLS.findIndex((x) => x.id === cell.id);
                return (
                  <div className="ages-cell" data-focus={"cell-" + cell.id} key={cell.id}>
                    <Reveal on={r(idx + 1)}>
                      <div className="age-card">
                        <div className="age-card-img" style={{ backgroundImage: `url(assets/${cell.img})` }} />
                        <div className="age-card-meta">
                          <span className="he">{cell.he}</span>
                          <span className="tl">{cell.tl}</span>
                          <span className="en">{cell.en}</span>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideNames.shotCount = NAMES_SHOTS.length;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 3 · How old is old enough? (timeline)                        */
/* ═══════════════════════════════════════════════════════════════════ */

// reveal: 0 frame · 1 band1 · 2 band2 · 3 band3 · 4 max cards
const AGES_SHOTS = [
  { focus: null,     reveal: 0 },
  { focus: "band-1", reveal: 0 },
  { focus: "band-1", reveal: 1 },
  { focus: "band-2", reveal: 1 },
  { focus: "band-2", reveal: 2 },
  { focus: "band-3", reveal: 2 },
  { focus: "band-3", reveal: 3 },
  { focus: null,     reveal: 3 },
  { focus: "maxes",  reveal: 3 },
  { focus: "maxes",  reveal: 4 },
  { focus: null,     reveal: 4 }
];
function SlideAges({ shot }) {
  const { focus, r } = useShot(AGES_SHOTS, shot);

  const band = (id, range, name, note, klass) => (
    <div className={"timeline-band " + klass} data-focus={id}>
      <div className="band-bar" />
      <div className="band-label">
        <span className="band-range">{range}</span>
        <span className="band-name">{name}</span>
        <span className="band-note">{note}</span>
      </div>
    </div>
  );

  return (
    <SlideFrame
      title="How old is old enough?"
      subtitle="Animals enter and leave eligibility on the calendar — to the day."
      source="Mishneh Torah, Maaseh HaKorbanot 1:11–14"
    >
      <CameraStage focus={focus}>
        <div className="age-timeline">
          <Reveal on={r(1)}>{band("band-1", "Day 1 – 7",   "Too young — פָּסוּל",
                              "Not yet a valid korban at any cost.",       "band-too-young")}</Reveal>
          <Reveal on={r(2)}>{band("band-2", "Day 8 – 29",  "Valid b'di'eved",
                              "From the eighth day a korban is kasher — but l'chatchila one waits.",
                              "band-bdi")}</Reveal>
          <Reveal on={r(3)}>{band("band-3", "Day 30 onward", "Valid l'chatchila",
                              "Bechor, pesach, and ma'aser may already be brought from day 8.",
                              "band-lc")}</Reveal>

          <div className="age-maxes" data-focus="maxes">
            <Reveal on={r(4)}>
              <div className="max-card">
                <span className="he">בָּקָר</span>
                <span className="en">Cattle</span>
                <span className="num">≤ 3 years</span>
              </div>
            </Reveal>
            <Reveal on={r(4)}>
              <div className="max-card">
                <span className="he">כְּבָשִׂים · עִזִּים</span>
                <span className="en">Sheep · Goats</span>
                <span className="num">≤ 2 years</span>
              </div>
            </Reveal>
            <Reveal on={r(4)}>
              <div className="max-card max-card-call">
                <span className="he">פִּלְגָּס</span>
                <span className="en">Pilgas</span>
                <span className="num">day 30 of yr 2</span>
                <span className="note">A male sheep on this one day is neither keves nor ayil.</span>
              </div>
            </Reveal>
          </div>
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideAges.shotCount = AGES_SHOTS.length;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 4 · The four korban categories                               */
/* ═══════════════════════════════════════════════════════════════════ */

const KORBAN_SHOTS = [
  { focus: null,      reveal: 0 },
  { focus: "k-olah",  reveal: 0 },
  { focus: "k-olah",  reveal: 1 },
  { focus: "k-chat",  reveal: 1 },
  { focus: "k-chat",  reveal: 2 },
  { focus: "k-asham", reveal: 2 },
  { focus: "k-asham", reveal: 3 },
  { focus: "k-shel",  reveal: 3 },
  { focus: "k-shel",  reveal: 4 },
  { focus: null,      reveal: 5 } // zoom out + extras
];
function SlideKorbanos({ shot }) {
  const { focus, r } = useShot(KORBAN_SHOTS, shot);

  const card = (id, he, tl, en, line, at) => (
    <div className="korban-card" data-focus={id}>
      <span className="korban-card-head he">{he}</span>
      <span className="korban-card-head tl">{tl}</span>
      <span className="korban-card-head en">{en}</span>
      <Reveal on={r(at)}>
        <p className="line">{line}</p>
      </Reveal>
    </div>
  );

  return (
    <SlideFrame
      title="The four categories of korban"
      subtitle="Every korban — communal or individual — fits into one of four kinds."
      source="Mishneh Torah, Maaseh HaKorbanot 1:2–3"
    >
      <CameraStage focus={focus}>
        <div className="korban-grid">
          {card("k-olah",  "עוֹלָה",     "olah",     "burnt offering",
                "Entirely burned on the mizbe'ach. No portion is eaten — wholly to Hashem.", 1)}
          {card("k-chat",  "חַטָּאת",    "chatat",   "sin offering",
                "Atones for accidental violation of a karet-bearing prohibition.", 2)}
          {card("k-asham", "אָשָׁם",     "asham",    "guilt offering",
                "Brought for specific transgressions, or in doubt (asham talui).", 3)}
          {card("k-shel",  "שְׁלָמִים",  "shelamim", "peace offering",
                "Eimurin to the altar, portions to the kohen, the rest is feasted by the owner.", 4)}

          <Reveal on={r(5)} className="korban-extras">
            <span className="eyebrow">Three more — individuals only</span>
            <div className="korban-extras-row">
              <span className="extra"><b className="he">פֶּסַח</b> pesach</span>
              <span className="extra"><b className="he">בְּכוֹר</b> bechor</span>
              <span className="extra"><b className="he">מַעֲשֵׂר</b> ma'aser</span>
            </div>
          </Reveal>
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideKorbanos.shotCount = KORBAN_SHOTS.length;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 5 · Which animal for which korban?                           */
/* ═══════════════════════════════════════════════════════════════════ */

const MATCH_SHOTS = [
  { focus: null,    reveal: 0 },
  { focus: "m-1",   reveal: 0 },
  { focus: "m-1",   reveal: 1 },
  { focus: "m-2",   reveal: 1 },
  { focus: "m-2",   reveal: 2 },
  { focus: "m-3",   reveal: 2 },
  { focus: "m-3",   reveal: 3 },
  { focus: "m-4",   reveal: 3 },
  { focus: "m-4",   reveal: 4 },
  { focus: null,    reveal: 5 }
];
function SlideMatch({ shot }) {
  const { focus, r } = useShot(MATCH_SHOTS, shot);

  const panel = (id, he, en, rules, pics, at) => (
    <div className="match-panel" data-focus={id}>
      <header>
        <span className="he">{he}</span>
        <span className="en">{en}</span>
      </header>
      <Reveal on={r(at)}>
        <ul>{rules.map((row, i) => <li key={i}>{row}</li>)}</ul>
        <div className="match-pics">
          {pics.map((p, i) => <img key={i} src={"assets/" + p.src} alt={p.alt} />)}
        </div>
      </Reveal>
    </div>
  );

  return (
    <SlideFrame
      title="Which animal for which korban?"
      subtitle="Each korban dictates species, sex, and (sometimes) age."
      source="Mishneh Torah, Maaseh HaKorbanot 1:6–10"
    >
      <CameraStage focus={focus}>
        <div className="match-grid">
          {panel("m-1", "עוֹלָה", "Olah",
            [<><b>Sex:</b> males only (mammals); either for birds</>,
             <><b>Species:</b> any of the five</>,
             <><b>Age:</b> any valid age</>],
            [{src:"cow-male.png", alt:"bull"}, {src:"ram.png", alt:"ram"}, {src:"male-goat.png", alt:"he-goat"}],
            1)}

          {panel("m-2", "שְׁלָמִים", "Shlamim",
            [<><b>Sex:</b> male <i>or</i> female</>,
             <><b>Species:</b> mammals only — no birds</>,
             <><b>Age:</b> any valid age</>],
            [{src:"cow-f.png", alt:"cow"}, {src:"ewe.png", alt:"ewe"}, {src:"female-goat-never-used.png", alt:"she-goat"}],
            2)}

          {panel("m-3", "אָשָׁם", "Asham",
            [<><b>Sex:</b> male only</>,
             <><b>Species:</b> sheep only — never cattle, goats, or birds</>,
             <><b>Age:</b> usually adult (ayil); metzora's asham is a keves</>],
            [{src:"ram.png", alt:"ram"}, {src:"lamb.png", alt:"lamb"}],
            3)}

          {panel("m-4", "חַטָּאת יָחִיד", "Chatat (individual)",
            [<><b>Sex:</b> female</>,
             <><b>Species:</b> any of the five</>,
             <><b>Exceptions:</b> nasi (male goat), kohen mashiach &amp; KG on Yom Kippur (bull)</>],
            [{src:"ewe.png", alt:"ewe"}, {src:"female-goat-never-used.png", alt:"she-goat"}],
            4)}

          <Reveal on={r(5)} className="match-note">
            A communal chatat is always male, and never a sheep — only a goat or a bull. The community never brings an asham, and never a bird.
          </Reveal>
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideMatch.shotCount = MATCH_SHOTS.length;

/* ═══════════════════════════════════════════════════════════════════ */
/*  Slide 6 · Most holy vs lighter holies                              */
/* ═══════════════════════════════════════════════════════════════════ */

const KK_SHOTS = [
  { focus: null,     reveal: 0 },
  { focus: "kk-kk",  reveal: 0 },
  { focus: "kk-kk",  reveal: 1 },
  { focus: null,     reveal: 1 },
  { focus: "kk-lt",  reveal: 1 },
  { focus: "kk-lt",  reveal: 2 },
  { focus: null,     reveal: 3 } // overview + coda
];
function SlideKK({ shot }) {
  const { focus, r } = useShot(KK_SHOTS, shot);

  const col = (id, klass, he, en, items, rule, at) => (
    <div className={"kk-col " + klass} data-focus={id}>
      <header>
        <span className="he">{he}</span>
        <span className="en">{en}</span>
      </header>
      <Reveal on={r(at)}>
        <ul>{items.map((it, i) => (
          <li key={i}><b className="he">{it[0]}</b> {it[1]}</li>
        ))}</ul>
        <p className="kk-rule">{rule}</p>
      </Reveal>
    </div>
  );

  return (
    <SlideFrame
      title="Most holy, and merely holy"
      subtitle="Every korban is classified one of two ways — governing where it's slaughtered, where it's eaten, and who eats it."
      source="Mishneh Torah, Maaseh HaKorbanot 1:17"
    >
      <CameraStage focus={focus}>
        <div className="kk-split">
          {col("kk-kk", "kk-kk", "קָדְשֵׁי קָדָשִׁים", "Most holy",
            [["עוֹלָה","olah"], ["חַטָּאת","chatat"], ["אָשָׁם","asham"],
             ["שַׁלְמֵי צִבּוּר","communal shlamim (two kvasim of Shavuos)"]],
            "Slaughtered in the north of the azarah. Eaten only inside the azarah, only by male kohanim, only that day and the following night.",
            1)}

          {col("kk-lt", "kk-light", "קָדָשִׁים קַלִּים", "Lighter holies",
            [["שְׁלָמִים","shlamim (individual)"], ["בְּכוֹר","bechor"],
             ["מַעֲשֵׂר","ma'aser"], ["פֶּסַח","pesach"]],
            "Slaughtered anywhere in the azarah. Eaten anywhere in Yerushalayim by anyone tahor, for two days and a night — except pesach (one night) and bechor (kohanim only).",
            2)}

          <Reveal on={r(3)} className="kk-coda">
            <span className="he">קֹדֶשׁ קָדָשִׁים</span>
            <span className="en">↑ most holy stays inside the courtyard.</span>
          </Reveal>
        </div>
      </CameraStage>
    </SlideFrame>
  );
}
SlideKK.shotCount = KK_SHOTS.length;

/* ─── Registry ──────────────────────────────────────────────────────── */
const LEARN_SLIDES = [
  { id: "intro",    Component: SlideIntro,
    title:    "What you'll learn",
    subtitle: "Six slides ahead. Take your time — the kohen gadol won't rush you." },
  { id: "species",  Component: SlideSpecies,
    title:    "Two realms. Five species.",
    subtitle: "Every korban from the animal kingdom comes from one of these five — and only these five." },
  { id: "names",    Component: SlideNames,
    title:    "Naming the animals",
    subtitle: "Each species has its own words for the young and for the grown — the Torah cares which is which." },
  { id: "ages",     Component: SlideAges,
    title:    "How old is old enough?",
    subtitle: "Animals enter and leave eligibility on the calendar — to the day." },
  { id: "korbanos", Component: SlideKorbanos,
    title:    "The four categories of korban",
    subtitle: "Every korban — communal or individual — fits into one of four kinds." },
  { id: "match",    Component: SlideMatch,
    title:    "Which animal for which korban?",
    subtitle: "Each korban dictates species, sex, and (sometimes) age." },
  { id: "kk",       Component: SlideKK,
    title:    "Most holy, and merely holy",
    subtitle: "Every korban is classified one of two ways — governing where it's slaughtered, where it's eaten, and who eats it." }
];

/* ─── LearnScreen — slide+shot driver ───────────────────────────────── */
function LearnScreen({ data, onDone, onBack }) {
  const [slideIdx, setSlideIdx] = useStateL(0);
  const [shot, setShot]         = useStateL(0);

  const slide       = LEARN_SLIDES[slideIdx];
  const shotCount   = slide.Component.shotCount;
  const atLastShot  = shot >= shotCount - 1;
  const atLastSlide = slideIdx >= LEARN_SLIDES.length - 1;

  const advance = useCallbackL(() => {
    if (!atLastShot)  { setShot(s => s + 1); return; }
    if (!atLastSlide) { setSlideIdx(i => i + 1); setShot(0); return; }
    onDone();
  }, [atLastShot, atLastSlide, onDone]);

  const back = useCallbackL(() => {
    if (shot > 0)     { setShot(s => s - 1); return; }
    if (slideIdx > 0) {
      const prev = LEARN_SLIDES[slideIdx - 1];
      setSlideIdx(i => i - 1);
      setShot(prev.Component.shotCount - 1);
      return;
    }
    onBack && onBack();
  }, [shot, slideIdx, onBack]);

  useEffectL(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault(); advance();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault(); back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back]);

  const Component = slide.Component;
  const totalShots  = LEARN_SLIDES.reduce((s, x) => s + x.Component.shotCount, 0);
  const passedShots = LEARN_SLIDES.slice(0, slideIdx).reduce((s, x) => s + x.Component.shotCount, 0) + shot + 1;
  const pct         = (passedShots / totalShots) * 100;

  const atStart = slideIdx === 0 && shot === 0;
  const jumpTo = (i) => { setSlideIdx(i); setShot(0); };

  return (
    <div className="learn">
      <aside className="learn-sidebar">
        <div className="learn-sidebar-head">
          <div className="eyebrow gold">Step 01 · Learn</div>
          <div className="learn-sidebar-progress">
            <div className="learn-bar"><div className="learn-bar-fill" style={{ width: pct + "%" }} /></div>
            <span className="learn-sidebar-shot">
              Shot <b>{shot + 1}</b> of {shotCount}
            </span>
          </div>
        </div>

        <nav className="learn-chips">
          {LEARN_SLIDES.map((s, i) => {
            const state = i === slideIdx ? "current" : (i < slideIdx ? "done" : "future");
            return (
              <button
                key={s.id}
                type="button"
                className={"learn-chip " + state}
                onClick={() => jumpTo(i)}
                title={s.title}
              >
                <span className="chip-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="chip-title">{s.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="learn-sidebar-foot">
          <button type="button" className="btn ghost sm" onClick={onBack} title="Exit to the step map">
            Exit ↩
          </button>
        </div>
      </aside>

      <main className="learn-main">
        <header className="learn-head">
          <button
            type="button"
            className="icon-btn learn-back"
            onClick={back}
            title={atStart ? "Exit to the steps" : "Step back"}
          >←</button>
          <div className="learn-head-titles">
            <h2 className="learn-h">{slide.title}</h2>
          </div>
          <button
            type="button"
            className="btn gold learn-advance"
            onClick={(e) => { e.stopPropagation(); advance(); }}
          >
            {atLastShot && atLastSlide ? "Prove yourself" :
             atLastShot                ? "Next slide"
                                        : "Advance"}
            <span className="arrow">→</span>
          </button>
        </header>

        <div className="learn-body slide-body" onClick={advance}>
          <Component key={slide.id} shot={shot} />
        </div>
      </main>
    </div>
  );
}

/* ─── QuizIntroScreen — splash before the quiz starts ──────────────── */
function QuizIntroScreen({ onBegin, onBack }) {
  return (
    <div className="quiz-intro">
      <div className="quiz-intro-art">
        <img src="assets/test.png" alt="Time to prove yourself" />
      </div>
      <div className="quiz-intro-text">
        <div className="eyebrow gold">Step 01 · Prove Your Knowledge</div>
        <h1 className="quiz-intro-h">Time to test what you've learned.</h1>
        <p className="quiz-intro-p">
          You'll face a mix of multiple-choice, sorting, and matching cards
          drawn from the six slides you just walked through.
        </p>
        <ul className="quiz-intro-rules">
          <li><b>Three hearts.</b> Each wrong answer costs one.</li>
          <li><b>Seventy percent</b> correct earns the step.</li>
          <li><b>Earlier material</b> may resurface in later levels.</li>
        </ul>
        <div className="quiz-intro-actions">
          <button type="button" className="btn ghost" onClick={onBack}>
            Back to the steps
          </button>
          <button type="button" className="btn gold lg" onClick={onBegin}>
            Begin <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Result screen — minimal, pending design of the testing stage ─── */
function ResultScreen({ passed, hearts, total, correct, onMap, onRetry }) {
  return (
    <div className="learn">
      <div className="learn-body">
        <div className="card" style={{ textAlign: "center" }}>
          <div className="eyebrow gold">Step 01 · Verdict</div>
          <h1 className="slide-title" style={{ marginTop: 10 }}>
            {passed ? "Proven." : "Not yet."}
          </h1>
          <p className="concept-a">
            {correct} of {total} correct · {hearts} {hearts === 1 ? "heart" : "hearts"} remaining.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <button className="btn ghost" onClick={onMap}>Back to the steps</button>
            <button className="btn gold"  onClick={onRetry}>Try again →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LearnScreen, QuizIntroScreen, ResultScreen });
