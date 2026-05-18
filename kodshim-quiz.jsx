// Quiz item components — MC, Tap, Match, Sort (drag-and-drop).
// English prompts only; Hebrew lives inside terms/options where it's a term.

const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ─── Multiple-choice & Tap-Hebrew ──────────────────────────────────── */
function MCQuestion({ item, onResolve, tap }) {
  const [picked, setPicked] = useState(null);
  const locked = picked !== null;

  const choose = (i) => {
    if (locked) return;
    setPicked(i);
    setTimeout(() => onResolve(i === item.answer), 650);
  };

  const letters = ["A", "B", "C", "D", "E"];

  return (
    <>
      <h2 className="q-prompt">{item.prompt}</h2>
      <div className="q-sub">{tap ? "Tap the right Hebrew word" : "Pick the correct answer"}</div>
      <div className="mc-grid">
        {item.options.map((opt, i) => {
          let cls = "mc-option";
          if (tap) cls += " tap-style";
          if (locked && i === item.answer) cls += " correct";
          else if (locked && i === picked) cls += " wrong";
          return (
            <button
              key={i}
              className={cls}
              disabled={locked}
              onClick={() => choose(i)}
            >
              {!tap && <span className="mc-key">{letters[i]}</span>}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ─── Match pairs — click Hebrew, then click English ────────────────── */
function MatchQuestion({ item, onResolve }) {
  const heOrder  = useMemo(() => shuffle(item.pairs.map((_, i) => i)), [item]);
  const enOrder  = useMemo(() => shuffle(item.pairs.map((_, i) => i)), [item]);

  const [matched, setMatched] = useState({});
  const [selectedHe, setSelectedHe] = useState(null);
  const [selectedEn, setSelectedEn] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [errCount, setErrCount] = useState(0);

  useEffect(() => {
    if (selectedHe === null || selectedEn === null) return;
    if (selectedHe === selectedEn) {
      setMatched((m) => ({ ...m, [selectedHe]: true }));
      setSelectedHe(null);
      setSelectedEn(null);
    } else {
      setWrong({ he: selectedHe, en: selectedEn });
      setErrCount((n) => n + 1);
      const t = setTimeout(() => {
        setWrong(null); setSelectedHe(null); setSelectedEn(null);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [selectedHe, selectedEn]);

  useEffect(() => {
    if (Object.keys(matched).length === item.pairs.length) {
      const t = setTimeout(() => onResolve(errCount === 0), 500);
      return () => clearTimeout(t);
    }
  }, [matched]);

  const cardClass = (idx, side) => {
    let c = "match-card" + (side === "he" ? " he" : "");
    if (matched[idx]) c += " matched";
    if (side === "he" && wrong?.he === idx) c += " wrong";
    if (side === "en" && wrong?.en === idx) c += " wrong";
    if (side === "he" && selectedHe === idx) c += " selected";
    if (side === "en" && selectedEn === idx) c += " selected";
    return c;
  };

  return (
    <>
      <h2 className="q-prompt">{item.prompt}</h2>
      <div className="q-sub">Tap a Hebrew word, then tap its meaning</div>
      <div className="match-grid">
        <div>
          <div className="match-col-title">Hebrew</div>
          <div className="match-stack">
            {heOrder.map((idx) => (
              <button
                key={"h" + idx}
                className={cardClass(idx, "he")}
                onClick={() => !matched[idx] && setSelectedHe(idx)}
              >{item.pairs[idx].hebrew}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="match-col-title">Meaning</div>
          <div className="match-stack">
            {enOrder.map((idx) => (
              <button
                key={"e" + idx}
                className={cardClass(idx, "en")}
                onClick={() => !matched[idx] && setSelectedEn(idx)}
              >{item.pairs[idx].english}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Sort: drag chips from bank into buckets ───────────────────────── */
function SortQuestion({ item, onResolve }) {
  const initialOrder = useMemo(() => shuffle(item.items.map((_, i) => i)), [item]);
  const [placements, setPlacements] = useState(() =>
    Object.fromEntries(item.items.map((_, i) => [i, null]))
  );
  const [dragId, setDragId] = useState(null);
  const [overBucket, setOverBucket] = useState(null);
  const [checked, setChecked] = useState(false);

  const remaining = initialOrder.filter((i) => placements[i] === null);
  const allPlaced = remaining.length === 0;

  const onDragStart = (i) => () => setDragId(i);
  const onDragEnd = () => { setDragId(null); setOverBucket(null); };

  const onDrop = (bid) => (e) => {
    e.preventDefault();
    if (dragId === null) return;
    setPlacements((p) => ({ ...p, [dragId]: bid }));
    setDragId(null);
    setOverBucket(null);
  };
  const onDropBank = (e) => {
    e.preventDefault();
    if (dragId === null) return;
    setPlacements((p) => ({ ...p, [dragId]: null }));
    setDragId(null);
    setOverBucket(null);
  };

  const check = () => {
    if (!allPlaced) return;
    setChecked(true);
    const allRight = item.items.every((it, i) => placements[i] === it.bucket);
    setTimeout(() => onResolve(allRight), 1200);
  };

  const chipClass = (i) => {
    let c = "sort-chip";
    if (dragId === i) c += " dragging";
    if (checked) {
      const right = placements[i] === item.items[i].bucket;
      c += right ? " correct" : " wrong";
    }
    return c;
  };

  return (
    <>
      <h2 className="q-prompt">{item.prompt}</h2>
      <div className="q-sub">Drag each chip into its bucket</div>
      <div className="sort-wrap">
        <div
          className="sort-bank"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropBank}
        >
          {remaining.length === 0 && (
            <span className="sort-bank-empty">All placed — press Check answer</span>
          )}
          {remaining.map((i) => (
            <div
              key={i}
              className={chipClass(i)}
              draggable={!checked}
              onDragStart={onDragStart(i)}
              onDragEnd={onDragEnd}
            >
              <span className="he">{item.items[i].hebrew}</span>
              <span className="tl">{item.items[i].translit}</span>
            </div>
          ))}
        </div>

        <div className="sort-buckets" style={{ "--n": item.buckets.length }}>
          {item.buckets.map((b) => (
            <div
              key={b.id}
              className={"sort-bucket" + (overBucket === b.id ? " over" : "")}
              onDragOver={(e) => { e.preventDefault(); setOverBucket(b.id); }}
              onDragLeave={() => setOverBucket((v) => v === b.id ? null : v)}
              onDrop={onDrop(b.id)}
            >
              <div className="sort-bucket-title">
                <span className="en">{b.en}</span>
                <span className="he">{b.he}</span>
              </div>
              <div className="sort-bucket-items">
                {item.items.map((it, i) =>
                  placements[i] === b.id ? (
                    <div
                      key={i}
                      className={chipClass(i)}
                      draggable={!checked}
                      onDragStart={onDragStart(i)}
                      onDragEnd={onDragEnd}
                    >
                      <span className="he">{it.hebrew}</span>
                      <span className="tl">{it.translit}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <button
            className="btn gold"
            disabled={!allPlaced || checked}
            onClick={check}
          >Check answer →</button>
        </div>
      </div>
    </>
  );
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Object.assign(window, { MCQuestion, MatchQuestion, SortQuestion });
