// Intro scenes: cold-open welcome → tutorial / step map.
// Uses real cartoon art:
//   assets/heichal-steps.png         — backdrop (Heichal + steps)
//   assets/kohen-gadol-teaching.png  — left figure on tutorial scene
//   assets/boy-learning.png          — right figure on tutorial scene

const { useState: useStateI, useEffect: useEffectI, useRef: useRefI } = React;

/* ─── Instruments — Beis HaMikdash Levi'im ensemble ─────────────────── */
// All five tracks are the same piece (Seikilos) per instrument, intended
// to layer. Unlocks: 1 instrument at L1, then +1 at levels 3, 6, 9, 12.
const INSTRUMENTS = [
  { id: "nevel",      he: "נֵבֶל",       en: "Nevel · Lute",        file: "assets/naval-Lute.mp3",          unlockLevel: 1  },
  { id: "kinnor",     he: "כִּנּוֹר",    en: "Kinnor · Harp",       file: "assets/kinor-Harp.mp3",          unlockLevel: 3  },
  { id: "chalil",     he: "חָלִיל",      en: "Chalil · Pipe",       file: "assets/chalil-Oboe.mp3",         unlockLevel: 6  },
  { id: "chatzotzra", he: "חֲצוֹצְרָה", en: "Chatzotzra · Trumpet", file: "assets/chatzotzrah-trumpet.mp3", unlockLevel: 9  },
  { id: "tziltzel",   he: "צֶלְצֶל",     en: "Tziltzel · Cymbals",  file: "assets/tziltzel-cymbals.mp3",    unlockLevel: 12 }
];
window.INSTRUMENTS = INSTRUMENTS;

/* ─── Welcome card ──────────────────────────────────────────────────── */
function WelcomeCard({ onContinue }) {
  return (
    <div className="intro-modal welcome-modal">
      <span className="brand-mark-big">קדשים</span>
      <div className="eyebrow gold welcome-eyebrow">Kodshim Training</div>
      <h1 className="modal-h">Are you ready for the Beis Hamikdash?</h1>
      <p className="modal-p">
        Kodshim is the order of Mishnah, and the corner of halacha, that
        covers the laws of <span className="em">korbanos</span> and the
        avodah of the Beis HaMikdash. We might not have one today, but we
        have a lot to learn if we want to be ready for it. But don't worry,
        if you come on in, we'll learn it slowly, and even get some rewards
        along the way.
      </p>
      <p className="modal-p">
        You don't have to be a kohen — or even a levi — to study these
        laws. <span className="em">The Torah belongs to all of us.</span>
      </p>
        <p className="modal-p">
        <strong>Welcome to Kodshim training school.</strong>
      </p>
      <button type="button" className="btn gold lg" onClick={onContinue}>
        <span>Let's GO!</span>
        <span className="arrow">→</span>
      </button>
      <div className="modal-foot">
        <span className="eyebrow">Kodshim</span>
        <span className="dot-sep">·</span>
        <span className="eyebrow">The World of Korbanos</span>
      </div>
    </div>
  );
}

/* ─── Tutorial card ─────────────────────────────────────────────────── */
function TutorialCard({ onBegin, onOpenMusic }) {
  return (
    <div className="intro-modal tutorial-modal">
      <div className="eyebrow gold">Kodshim Training Instructions</div>
      <h2 className="modal-h sm">Learn the Laws. Prove yourself. Climb up the stairs.</h2>
      <p className="modal-p">
        Kodshim training is organized into levels. Each one teaches a
        distinct area of the laws of korbanos — offerings brought to Hashem in the Beis haMikdash. 
        Each level teaches a set of laws, studying more and more as you climb each of the fifteen
        levels to get all the way up to the Ezras Yisrael (courtyard). You must complete a level to prove you
        are ready to take the next step.
      </p>
      <p className="modal-p">Every level has three parts:</p>
      <ol className="tutorial-list">
        <li>
          <span className="num">1</span>
          <div>
            <strong>Learning</strong>
            <p>Read through the concepts and the Hebrew terms for the level. Take your time — the kohen gadol won't rush you.</p>
          </div>
        </li>
        <li>
          <span className="num">2</span>
          <div>
            <strong>Proving</strong>
            <p>Question cards on everything you just studied — multiple choice, matching, sorting, tapping the right Hebrew word.</p>
          </div>
        </li>
        <li>
          <span className="num">3</span>
          <div>
            <strong>Reviewing</strong>
            <p>Cards from earlier levels mix in with the new ones, so old material doesn't quietly slip away.</p>
          </div>
        </li>
      </ol>
      <div className="tutorial-callout">
        <strong>Three hearts on your sleeve.</strong>
        <p>
          Each wrong answer costs a heart —{" "}
          <span className="he-inline-sm">וְהָיוּ הַדְּבָרִים הָאֵלֶּה… עַל לְבָבֶךָ</span>.
          Lose all three and you return to the home page — pick up
          again whenever you like.
        </p>
      </div>
      <div className="tutorial-cta">
        <button type="button" className="btn gold lg" onClick={onBegin}>
          <span>Got it!</span>
        </button>
        {onOpenMusic && (
          <button
            type="button"
            className="link-btn music-link"
            onClick={onOpenMusic}
          >
            <span className="link-ico" aria-hidden="true">♪</span>
            What's this music?
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Step indicator strip (tutorial only) ──────────────────────────── */
function StepsStrip({ levels, onSelectStep }) {
  return (
    <div className="steps-strip" aria-label="Fifteen steps">
      {levels.map((lvl) => {
        const isActive = lvl.state === "active";
        const isLocked = lvl.state === "locked";
        return (
          <button
            key={lvl.num}
            className={
              "step-chip " + (isActive ? "active" : isLocked ? "locked" : "")
            }
            disabled={isLocked}
            onClick={() => isActive && onSelectStep && onSelectStep(lvl.num)}
            title={`Step ${lvl.num}: ${lvl.name}`}
            style={{ "--idx": lvl.num }}
          >
            {String(lvl.num).padStart(2, "0")}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Welcome scene ─────────────────────────────────────────────────── */
function WelcomeScene({ levels, onContinue }) {
  return (
    <div className="intro intro-welcome">
      <div className="heichal-backdrop" />
      <div className="teaching-pane">
        <img
          src="assets/kohen-gadol-teaching.png"
          alt="The kohen gadol teaching a kohen hedyot"
          className="teaching-img"
        />
      </div>

      <div className="intro-brand">
        <span className="he">קדשים</span>
        <span className="sep" />
        <span className="en">THE WORLD OF KORBANOS</span>
      </div>

      <div className="scene-caption">
        <span className="he">בֵּית הַמִּקְדָּשׁ</span>
        <span className="en">Your journey to the Temple awaits</span>
      </div>

      <div className="intro-overlay">
        <WelcomeCard onContinue={onContinue} />
      </div>
    </div>
  );
}

/* ─── Tutorial scene ────────────────────────────────────────────────── */
function TutorialScene({ levels, showCard, onDismissCard, onShowCard, onSelectStep, music, onOpenMusic }) {
  return (
    <div className="intro intro-tutorial">
      <div className="heichal-backdrop" />

      <div className="figure figure-left">
        <img
          src="assets/kohen-gadol-teaching.png"
          alt="The kohen gadol teaching"
          className="figure-img"
        />
      </div>
      <div className="figure figure-right">
        <img
          src="assets/boy-learning.png"
          alt="A student learning"
          className="figure-img"
        />
      </div>

      <div className="intro-brand">
        <span className="he">קדשים</span>
        <span className="sep" />
        <span className="en">KODSHIM TRAINING</span>
      </div>

      <StepsStrip levels={levels} onSelectStep={onSelectStep} />

      {showCard && (
        <div className="intro-overlay">
          <TutorialCard onBegin={onDismissCard} onOpenMusic={onOpenMusic} />
        </div>
      )}

      {!showCard && (
        <>
          <ToolStrip
            onShowInstructions={onShowCard}
            music={music}
            onOpenMusic={onOpenMusic}
          />
          <StartHereArrow />
        </>
      )}
    </div>
  );
}

/* ─── Tool strip (visible after the tutorial card is dismissed) ─────── */
function ToolStrip({ onShowInstructions, music, onOpenMusic }) {
  const playing = music && music.enabled && music.unlockedCount > 0;

  return (
    <div className="tool-strip" aria-label="Tutorial tools">
      <button
        type="button"
        className="tool-btn"
        onClick={onShowInstructions}
        aria-label="Show instructions"
      >
        <span className="tool-ico" aria-hidden="true">?</span>
        <span className="tool-label">Instructions</span>
      </button>
      {onOpenMusic && (
        <button
          type="button"
          className="tool-btn"
          onClick={onOpenMusic}
          aria-label="Music"
        >
          <span className={"tool-ico" + (playing ? " playing" : "")} aria-hidden="true">♪</span>
          <span className="tool-label">Music</span>
        </button>
      )}
      <button
        type="button"
        className="tool-btn coming-soon"
        title="Coming soon"
        aria-label="Settings (coming soon)"
      >
        <span className="tool-ico" aria-hidden="true">⚙</span>
        <span className="tool-label">Settings</span>
      </button>
      <button
        type="button"
        className="tool-btn coming-soon"
        title="Coming soon"
        aria-label="About (coming soon)"
      >
        <span className="tool-ico" aria-hidden="true">i</span>
        <span className="tool-label">About</span>
      </button>
      <button
        type="button"
        className="tool-btn coming-soon"
        title="Coming soon"
        aria-label="Switch language (coming soon)"
      >
        <span className="tool-ico he" aria-hidden="true">עב</span>
        <span className="tool-label">⇄ EN</span>
      </button>
    </div>
  );
}

/* ─── Music card — centered modal with mixer + explanation ──────────── */
function MusicCard({ music, onClose }) {
  // Any interaction inside the card counts as a user gesture — start the
  // engine so the toggle / sliders take effect immediately if opened
  // before the user clicked Let's GO.
  const startIfNeeded = () => music.start();

  return (
    <div
      className="intro-overlay music-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="intro-modal music-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Music — the Levi'im ensemble"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >×</button>

        <div className="eyebrow gold">The Levi'im Ensemble</div>
        <h2 className="modal-h sm">Music in the Beis HaMikdash</h2>

        <div className="music-modal-body">
          <img
            src="assets/instruments.png"
            alt="The five instruments of the Levi'im"
            className="music-modal-img"
          />
          <div className="music-modal-text">
            <p className="modal-p">
              While the korbanos were offered, the Levi'im sang on the
              duchan and played five families of instruments — strings,
              winds, and percussion. The recording you're hearing is the
              ancient <em>Epitaph of Seikilos</em>, layered one instrument
              at a time as you climb the steps.
            </p>
            <p className="modal-p music-caveat">
              <strong>A caveat.</strong> We don't know exactly what these
              instruments looked like or how they sounded — these are
              reconstructions drawn from Tanach, Mishnah, and what little
              archaeology has uncovered.
            </p>
          </div>
        </div>

        <div className="music-mixer">
          <div className="music-mixer-head">
            <span className="eyebrow gold">Mixer</span>
            <button
              type="button"
              className={"music-toggle" + (music.enabled ? " on" : "")}
              onClick={() => { startIfNeeded(); music.setEnabled(!music.enabled); }}
              aria-pressed={music.enabled ? "true" : "false"}
            >
              <span className="dot" /> {music.enabled ? "On" : "Off"}
            </button>
          </div>
          <ul className="music-list">
            {INSTRUMENTS.map((inst, idx) => {
              const unlocked = idx < music.unlockedCount;
              const isPlaying = unlocked && music.enabled;
              return (
                <li
                  key={inst.id}
                  className={
                    "music-item" +
                    (unlocked ? "" : " locked") +
                    (isPlaying ? " playing" : "")
                  }
                >
                  <span className="music-icon" aria-hidden="true">
                    {unlocked ? "♪" : "🔒"}
                  </span>
                  <span className="music-name">
                    <span className="he">{inst.he}</span>
                    <span className="en">{inst.en}</span>
                  </span>
                  <span className="music-status">
                    {!unlocked
                      ? "Level " + inst.unlockLevel
                      : isPlaying ? "Playing" : "Ready"}
                  </span>
                  <input
                    type="range"
                    className="music-volume"
                    min="0"
                    max="100"
                    step="1"
                    value={Math.round(music.volumes[idx] * 100)}
                    onChange={(e) => {
                      startIfNeeded();
                      music.setVolume(idx, Number(e.target.value) / 100);
                    }}
                    disabled={!unlocked}
                    aria-label={inst.en + " volume"}
                  />
                </li>
              );
            })}
          </ul>
          <p className="music-modal-foot">
            Climb the steps to add more voices — kinnor at level 3, chalil
            at level 6, chatzotzra at level 9, and tziltzel at level 12.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Blinking "start here" arrow pointing to step 01 ───────────────── */
function StartHereArrow() {
  return (
    <div className="start-here" aria-hidden="true">
      <span className="start-here-text">Start here</span>
      <span className="start-here-arrow">→</span>
    </div>
  );
}

Object.assign(window, {
  WelcomeScene, TutorialScene, WelcomeCard, TutorialCard,
  StepsStrip, ToolStrip, StartHereArrow, MusicCard
});
