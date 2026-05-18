// Main App — welcome → tutorial → learn → quiz → result.

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp, useRef: useRefApp } = React;

/* ─── Music engine ─────────────────────────────────────────────────── */
// Five-instrument Levi'im ensemble. Tracks load on mount; playback waits
// for the user's first gesture (clicking through the welcome card).
// Only the first `unlockedCount` instruments are audible — locked ones
// stay paused even when music is enabled.
function unlockedCountForLevel(level) {
  if (level >= 12) return 5;
  if (level >= 9)  return 4;
  if (level >= 6)  return 3;
  if (level >= 3)  return 2;
  return 1;
}

function useMusicEngine(currentLevel) {
  const [enabled, setEnabled] = useStateApp(true);
  const [started, setStarted] = useStateApp(false);
  const [volumes, setVolumes] = useStateApp(() => INSTRUMENTS.map(() => 0.7));
  const refs = useRefApp({});
  const unlockedCount = unlockedCountForLevel(currentLevel);

  useEffectApp(() => {
    INSTRUMENTS.forEach((inst, i) => {
      const el = refs.current[inst.id];
      if (!el) return;
      el.volume = volumes[i];
      const shouldPlay = started && enabled && i < unlockedCount;
      if (shouldPlay) {
        const p = el.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [started, enabled, unlockedCount, volumes]);

  const setVolume = (i, v) =>
    setVolumes(prev => prev.map((x, j) => (j === i ? v : x)));

  return {
    enabled,
    setEnabled,
    start: () => setStarted(true),
    unlockedCount,
    volumes,
    setVolume,
    refs
  };
}

function App() {
  // Routing
  const [screen, setScreen] = useStateApp("welcome"); // welcome | tutorial | learn | quiz-intro | quiz | result
  const [tutorialDismissed, setTutorialDismissed] = useStateApp(false);
  const [musicCardOpen,    setMusicCardOpen]    = useStateApp(false);
  const [infoCardOpen,     setInfoCardOpen]     = useStateApp(false);
  const [settingsCardOpen, setSettingsCardOpen] = useStateApp(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useStateApp(0);
  const [hearts, setHearts] = useStateApp(3);
  const [correct, setCorrect] = useStateApp(0);
  const [status, setStatus] = useStateApp(null);
  const [qKey, setQKey] = useStateApp(0);

  const data = window.KODSHIM_DATA;
  const totalQ = data.quiz.length;

  // Highest non-locked level drives instrument unlocks.
  const currentLevel = useMemoApp(() => {
    const open = data.levels.filter(l => l.state !== "locked");
    return open.length ? Math.max(...open.map(l => l.num)) : 1;
  }, [data.levels]);
  const music = useMusicEngine(currentLevel);

  const resetQuiz = () => {
    setQuizIdx(0); setHearts(3); setCorrect(0);
    setStatus(null); setQKey((k) => k + 1);
  };

  const goWelcome   = () => setScreen("welcome");
  const goTutorial  = () => setScreen("tutorial");
  const goLearn     = () => { resetQuiz(); setScreen("learn"); };
  const goQuizIntro = () => { resetQuiz(); setScreen("quiz-intro"); };
  const goQuiz      = () => { resetQuiz(); setScreen("quiz"); };

  const handleResolve = (ok) => {
    setStatus({
      ok,
      msg: ok
        ? randomFrom(["Correct.", "Right.", "Yes.", "Spot on."])
        : randomFrom(["Not quite.", "Almost.", "Off by one.", "Try the next."])
    });
    if (ok) setCorrect((c) => c + 1);
    let newHearts = hearts;
    if (!ok) { newHearts = hearts - 1; setHearts(newHearts); }

    setTimeout(() => {
      setStatus(null);
      if (newHearts <= 0) { setScreen("result"); return; }
      if (quizIdx + 1 >= totalQ) { setScreen("result"); return; }
      setQuizIdx(quizIdx + 1);
      setQKey((k) => k + 1);
    }, 1200);
  };

  const isIntro = screen === "welcome" || screen === "tutorial";

  return (
    <div className="app" data-screen-label={"Kodshim · " + screen}>
      {!isIntro && (
        <TopBar
          screen={screen}
          levelTitle="Level 1: Animals for Korbanos"
          onInfo={() => setInfoCardOpen(true)}
          onMusic={() => setMusicCardOpen(true)}
          onSettings={() => setSettingsCardOpen(true)}
          onSkipToQuiz={goQuizIntro}
        />
      )}
      <div className="stage">
        {screen === "welcome" && (
          <WelcomeScene
            levels={data.levels}
            onContinue={() => { music.start(); setScreen("tutorial"); }}
            onOpenMusic={() => setMusicCardOpen(true)}
          />
        )}
        {screen === "tutorial" && (
          <TutorialScene
            levels={data.levels}
            showCard={!tutorialDismissed}
            onDismissCard={() => setTutorialDismissed(true)}
            onShowCard={() => setTutorialDismissed(false)}
            onSelectStep={(n) => { setTutorialDismissed(true); goLearn(); }}
            music={music}
            onOpenMusic={() => setMusicCardOpen(true)}
          />
        )}
        {screen === "learn" && (
          <LearnScreen data={data} onDone={goQuizIntro} onBack={goTutorial} />
        )}
        {screen === "quiz-intro" && (
          <QuizIntroScreen onBegin={goQuiz} onBack={goTutorial} />
        )}
        {screen === "quiz" && (
          <QuizScreen
            key={qKey}
            item={data.quiz[quizIdx]}
            qIdx={quizIdx}
            qTotal={totalQ}
            hearts={hearts}
            status={status}
            onResolve={handleResolve}
            onBack={goTutorial}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            passed={hearts > 0 && correct >= Math.ceil(totalQ * 0.7)}
            hearts={hearts}
            total={totalQ}
            correct={correct}
            onMap={goTutorial}
            onRetry={goQuiz}
          />
        )}
      </div>
      {musicCardOpen && (
        <MusicCard music={music} onClose={() => setMusicCardOpen(false)} />
      )}
      {infoCardOpen && (
        <InfoCard onClose={() => setInfoCardOpen(false)} />
      )}
      {settingsCardOpen && (
        <SettingsCard onClose={() => setSettingsCardOpen(false)} />
      )}
      <AudioRack music={music} />
    </div>
  );
}

/* ─── Hidden <audio> elements managed by the music engine ───────────── */
function AudioRack({ music }) {
  return (
    <div aria-hidden="true" className="audio-rack">
      {INSTRUMENTS.map(inst => (
        <audio
          key={inst.id}
          ref={el => { music.refs.current[inst.id] = el; }}
          src={encodeURI(inst.file)}
          loop
          preload="auto"
        />
      ))}
    </div>
  );
}

/* ─── Top bar (non-intro screens) ───────────────────────────────────── */
function TopBar({ screen, levelTitle, onInfo, onMusic, onSettings, onSkipToQuiz }) {
  const showSkip = screen === "learn";
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button type="button" className="top-icon-btn" onClick={onInfo}     aria-label="Information" title="Information">i</button>
        <button type="button" className="top-icon-btn" onClick={onMusic}    aria-label="Music"       title="Music">♪</button>
        <button type="button" className="top-icon-btn" onClick={onSettings} aria-label="Settings"    title="Settings">⚙</button>
      </div>
      <div className="top-bar-center">
        {showSkip && (
          <button type="button" className="top-skip" onClick={onSkipToQuiz}>
            Skip to quiz <span className="arrow">→</span>
          </button>
        )}
      </div>
      <div className="top-bar-right">
        <span className="level-title">
          <span className="level-num">Level 01</span>
          <span className="level-name">{(levelTitle || "").replace(/^Level\s+\d+:\s*/i, "")}</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Info & Settings cards — minimal placeholders ──────────────────── */
function InfoCard({ onClose }) {
  return (
    <div className="intro-overlay" onClick={onClose} role="presentation">
      <div
        className="intro-modal info-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="About this app"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="eyebrow gold">About</div>
        <h2 className="modal-h sm">Kodshim Training</h2>
        <p className="modal-p">
          A self-paced course in the laws of korbanos — the offerings of the Beis HaMikdash —
          organized as fifteen steps climbing toward the Ezras Yisrael.
        </p>
        <p className="modal-p">
          Each level has a Learn section (slides), a Prove-Yourself quiz, and review cards that
          fold in earlier material. The kohen gadol won't rush you.
        </p>
      </div>
    </div>
  );
}

function SettingsCard({ onClose }) {
  return (
    <div className="intro-overlay" onClick={onClose} role="presentation">
      <div
        className="intro-modal settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Settings"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="eyebrow gold">Settings</div>
        <h2 className="modal-h sm">Coming soon</h2>
        <p className="modal-p">
          Theme, type size, transliteration style, and learning pace controls will live here.
        </p>
      </div>
    </div>
  );
}

/* ─── Quiz screen wrapper ───────────────────────────────────────────── */
function QuizScreen({ item, qIdx, qTotal, hearts, status, onResolve, onBack }) {
  const pct = (qIdx / qTotal) * 100;

  return (
    <div className="quiz">
      <div className="quiz-head">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="icon-btn"
            onClick={onBack}
            title="Back to the steps"
            style={{ width: 32, height: 32, fontSize: 14 }}
          >←</button>
          <span className="eyebrow">
            Step 01 <span className="sep"></span> <b>Quiz</b>
          </span>
        </div>
        <div className="quiz-bar"><div className="quiz-bar-fill" style={{ width: pct + "%" }} /></div>
        <div className="quiz-counter">
          <b style={{ color: "var(--ink)" }}>{String(qIdx + 1).padStart(2, "0")}</b> / {String(qTotal).padStart(2, "0")}
        </div>
        <div className="hearts">
          {[0, 1, 2].map((i) => (
            <span key={i} className={"heart" + (i >= hearts ? " lost" : "")} />
          ))}
        </div>
      </div>

      <div className="quiz-body">
        {item.kind === "mc"    && <MCQuestion item={item} onResolve={onResolve} />}
        {item.kind === "tap"   && <MCQuestion item={item} onResolve={onResolve} tap />}
        {item.kind === "match" && <MatchQuestion item={item} onResolve={onResolve} />}
        {item.kind === "sort"  && <SortQuestion item={item} onResolve={onResolve} />}
      </div>

      <div className="quiz-foot">
        <span className="quiz-hint">
          {item.kind === "sort" ? "Place every chip, then press Check." : "One wrong answer costs a heart."}
        </span>
        {status && (
          <div className={"quiz-status " + (status.ok ? "correct" : "wrong")}>
            <span className={"feedback-dot" + (status.ok ? "" : " x")}>{status.ok ? "✓" : "✕"}</span>
            <span>{status.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
