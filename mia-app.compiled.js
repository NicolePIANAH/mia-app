// MIA – Merken. Integrieren. Automatisieren.
// Cue-Delivery-System für orofaziale Transfer-Therapie
// PIA Produktfamilie | React 18 | Babel Classic | LocalStorage | PWA

const {
  useState,
  useEffect,
  useRef
} = React;

// ─── FARBEN (PIA Palette) ───
const C = {
  petrol: "#1a4d5c",
  navy: "#1e3a6e",
  blue: "#2e7da6",
  lightblue: "#a8cdd9",
  greyblue: "#6b8fa3",
  gold: "#c4a46b",
  white: "#f7f9fb",
  cream: "#deeaf0",
  sand: "#e8d5b0"
};

// ─── STORAGE ───
const sv = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
};
const ld = (k, def = null) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
};

// ─── DATUM ───
const heute = () => new Date().toISOString().split("T")[0];
const fmtD = d => new Date(d).toLocaleDateString("de-DE", {
  day: "2-digit",
  month: "2-digit"
});

// ─── DATEN ───
const ANKER = [{
  id: "zaehne",
  emoji: "🪥",
  label: "Zähneputzen"
}, {
  id: "kuehl",
  emoji: "🧊",
  label: "Kühlschrank öffnen"
}, {
  id: "handy",
  emoji: "📱",
  label: "Handy entsperren"
}, {
  id: "auto",
  emoji: "🚗",
  label: "Ins Auto einsteigen"
}, {
  id: "laptop",
  emoji: "💻",
  label: "Laptop aufklappen"
}, {
  id: "kaffee",
  emoji: "☕",
  label: "Kaffee oder Tee kochen"
}, {
  id: "essen",
  emoji: "🍽️",
  label: "Nach dem Essen"
}, {
  id: "schlafen",
  emoji: "🌙",
  label: "Vor dem Schlafen"
}, {
  id: "aufstehen",
  emoji: "🌅",
  label: "Morgens aufstehen"
}, {
  id: "tuer",
  emoji: "🔑",
  label: "Türen aufschließen"
}];
const FOKUS = [{
  id: "zunge",
  emoji: "👅",
  label: "Zungenruhelage",
  sub: "Zunge entspannt an den oberen Schneidezähnen"
}, {
  id: "schlucken",
  emoji: "💧",
  label: "Schlucken",
  sub: "Bewusstes Schlucken mit korrektem Muster"
}, {
  id: "atmung",
  emoji: "🌬️",
  label: "Nasenatmung",
  sub: "Ruhige Atmung durch die Nase"
}];
const CUE = {
  zunge: {
    frage: "Wo liegt deine Zunge gerade?",
    a: "Oben – an den Zähnen",
    b: "Irgendwo anders"
  },
  schlucken: {
    frage: "Wie hast du gerade geschluckt?",
    a: "Zunge nach oben – richtig",
    b: "Zunge vorne oder unten"
  },
  atmung: {
    frage: "Wie atmest du gerade?",
    a: "Durch die Nase",
    b: "Durch den Mund"
  }
};
const MIKRO = {
  zunge: {
    headline: "Kurze Pause",
    schritte: ["Lippen schließen", "Zunge hoch", "Ruhen lassen"],
    dauer: 20
  },
  schlucken: {
    headline: "Ein bewusstes Schlucken",
    schritte: ["Speichel sammeln", "Zunge hoch", "Jetzt schlucken"],
    dauer: 25
  },
  atmung: {
    headline: "Drei Atemzüge",
    schritte: ["Nase – einatmen", "Kurz halten", "Nase – ausatmen"],
    dauer: 20
  }
};

// ─── STYLES ───
const app = {
  maxWidth: 430,
  margin: "0 auto",
  minHeight: "100vh",
  background: C.white,
  position: "relative"
};
const scr = {
  padding: "24px 20px 100px",
  minHeight: "100vh"
};
const card = {
  background: C.white,
  borderRadius: 16,
  padding: "20px",
  boxShadow: "0 2px 12px rgba(26,77,92,0.08)",
  marginBottom: 16
};
const h1 = {
  fontFamily: "'Cormorant',Georgia,serif",
  fontSize: 28,
  fontWeight: 600,
  color: C.petrol,
  marginBottom: 8,
  lineHeight: 1.2
};
const sub = {
  fontSize: 14,
  color: C.greyblue,
  lineHeight: 1.5
};
const btn = (bg = C.petrol, col = "white") => ({
  display: "block",
  width: "100%",
  padding: "14px 24px",
  background: bg,
  color: col,
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "center"
});
const btnSec = {
  display: "block",
  width: "100%",
  padding: "12px 24px",
  background: "transparent",
  color: C.petrol,
  border: `1.5px solid ${C.lightblue}`,
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "center"
};

// ─── FORTSCHRITTSLEISTE ───
function Progress({
  step
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 20px 0",
      display: "flex",
      gap: 6
    }
  }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: i <= step ? C.petrol : C.cream
    }
  })));
}

// ═══════════════════════════
// ONBOARDING
// ═══════════════════════════
function Onboarding({
  onComplete
}) {
  const [step, setStep] = useState(1);
  const [fokus, setFokus] = useState(null);
  const [anker, setAnker] = useState([]);
  const [ersteDone, setErsteDone] = useState(false);
  const togAnker = id => setAnker(a => a.includes(id) ? a.filter(x => x !== id) : a.length < 5 ? [...a, id] : a);
  const finish = () => {
    const u = {
      fokus,
      anker,
      erstelltAm: new Date().toISOString(),
      pin: null
    };
    sv("mia_user", u);
    onComplete(u);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: app
  }, /*#__PURE__*/React.createElement(Progress, {
    step: step
  }), step === 1 && /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Schritt 1 von 4"), /*#__PURE__*/React.createElement("div", {
    style: h1
  }, "Was möchtest du einüben?"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 24
    }
  }, "Wähle einen Bereich. Du kannst ihn später ändern."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, FOKUS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFokus(f.id),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "18px 20px",
      background: fokus === f.id ? `${C.petrol}14` : C.white,
      border: `2px solid ${fokus === f.id ? C.petrol : C.cream}`,
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.2s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 32
    }
  }, f.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 18,
      fontWeight: 600,
      color: C.petrol
    }
  }, f.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.greyblue,
      marginTop: 2
    }
  }, f.sub))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      left: 0,
      right: 0,
      maxWidth: 430,
      margin: "0 auto",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => fokus && setStep(2),
    style: btn(fokus ? C.petrol : C.lightblue)
  }, "Weiter"))), step === 2 && /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Schritt 2 von 4"), /*#__PURE__*/React.createElement("div", {
    style: h1
  }, "Wann soll MIA dich erinnern?"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 20
    }
  }, "Wähle 2 bis 5 Momente aus deinem Alltag."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 80
    }
  }, ANKER.map(a => {
    const sel = anker.includes(a.id);
    return /*#__PURE__*/React.createElement("button", {
      key: a.id,
      onClick: () => togAnker(a.id),
      style: {
        padding: "14px 10px",
        background: sel ? `${C.petrol}14` : C.white,
        border: `2px solid ${sel ? C.petrol : C.cream}`,
        borderRadius: 14,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 28
      }
    }, a.emoji), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: sel ? C.petrol : C.greyblue,
        fontWeight: sel ? 600 : 400,
        textAlign: "center",
        lineHeight: 1.3
      }
    }, a.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      left: 0,
      right: 0,
      maxWidth: 430,
      margin: "0 auto",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 13,
      color: C.greyblue,
      marginBottom: 10
    }
  }, anker.length, " von 5 gewählt (min. 2)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => anker.length >= 2 && setStep(3),
    style: btn(anker.length >= 2 ? C.petrol : C.lightblue)
  }, "Weiter"))), step === 3 && /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Schritt 3 von 4"), /*#__PURE__*/React.createElement("div", {
    style: h1
  }, "Jetzt direkt ausprobieren"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 24
    }
  }, "Nur 20 Sekunden. Schau einfach, wie sich MIA anfühlt."), !ersteDone ? /*#__PURE__*/React.createElement(MikroScreen, {
    fokus: fokus,
    onDone: () => setErsteDone(true),
    eingebettet: true
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      textAlign: "center",
      padding: "32px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 12
    }
  }, "✓"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 22,
      color: C.petrol,
      marginBottom: 6
    }
  }, "Genau so."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: C.greyblue
    }
  }, "Das war MIA. Kurz, klar, im Alltag.")), ersteDone && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      left: 0,
      right: 0,
      maxWidth: 430,
      margin: "0 auto",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(4),
    style: btn()
  }, "Weiter"))), step === 4 && /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Schritt 4 von 4"), /*#__PURE__*/React.createElement("div", {
    style: h1
  }, "MIA auf deinen Homescreen"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 24
    }
  }, "So hast du MIA immer dabei, auch ohne Internet."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 10
    }
  }, "📱 iPhone / Safari"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: C.greyblue,
      lineHeight: 1.8
    }
  }, "1. Tippe das ", /*#__PURE__*/React.createElement("strong", null, "Teilen-Symbol"), " unten in der Mitte", /*#__PURE__*/React.createElement("br", null), "2. Wähle ", /*#__PURE__*/React.createElement("strong", null, "\"Zum Home-Bildschirm\""))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 10
    }
  }, "🤖 Android / Chrome"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: C.greyblue,
      lineHeight: 1.8
    }
  }, "1. Tippe das ", /*#__PURE__*/React.createElement("strong", null, "Menü (drei Punkte)"), " oben rechts", /*#__PURE__*/React.createElement("br", null), "2. Wähle ", /*#__PURE__*/React.createElement("strong", null, "\"Zum Startbildschirm hinzufügen\""))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      left: 0,
      right: 0,
      maxWidth: 430,
      margin: "0 auto",
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: finish,
    style: btn(C.gold)
  }, "Los geht's"))));
}

// ═══════════════════════════
// MIKRO-SCREEN
// ═══════════════════════════
function MikroScreen({
  fokus,
  onDone,
  eingebettet = false
}) {
  const m = MIKRO[fokus] || MIKRO.zunge;
  const [tick, setTick] = useState(0);
  const [done, setDone] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => {
        if (t >= m.dauer) {
          clearInterval(iv);
          setDone(true);
          return t;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [m.dauer]);
  useEffect(() => {
    if (done) setTimeout(() => onDone && onDone(), 600);
  }, [done]);
  const progress = Math.min(tick / m.dauer, 1);
  const aktiv = tick < m.dauer / 3 ? 0 : tick < 2 * m.dauer / 3 ? 1 : 2;
  const R = 44,
    C2 = 2 * Math.PI * R;
  const wrap = eingebettet ? {
    background: `linear-gradient(145deg,${C.navy}ee,${C.petrol}ee)`,
    borderRadius: 16,
    padding: "28px 20px"
  } : {
    minHeight: "100vh",
    background: `linear-gradient(180deg,${C.navy} 0%,${C.petrol} 100%)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 24px"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 24,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100",
    height: "100",
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: R,
    fill: "none",
    stroke: "rgba(255,255,255,0.15)",
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: R,
    fill: "none",
    stroke: C.gold,
    strokeWidth: "6",
    strokeDasharray: `${C2}`,
    strokeDashoffset: `${C2 * (1 - progress)}`,
    strokeLinecap: "round",
    style: {
      transition: "stroke-dashoffset 1s linear"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontFamily: "'Cormorant',Georgia,serif",
      fontWeight: 600,
      color: "white"
    }
  }, done ? "✓" : m.dauer - tick))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 22,
      fontWeight: 600,
      textAlign: "center",
      marginBottom: 24,
      color: "white"
    }
  }, m.headline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      width: "100%",
      maxWidth: 280
    }
  }, m.schritte.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      opacity: i === aktiv ? 1 : 0.35,
      transition: "opacity 0.4s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: i === aktiv ? C.gold : "rgba(255,255,255,0.4)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: "white"
    }
  }, s)))), /*#__PURE__*/React.createElement("audio", {
    ref: audioRef,
    src: `/assets/audio/${fokus}.mp3`,
    autoPlay: true,
    style: {
      display: "none"
    }
  }));
}

// ═══════════════════════════
// CUE-SCREEN
// ═══════════════════════════
function CueScreen({
  fokus,
  ankerLabel,
  onAntwort
}) {
  const cue = CUE[fokus] || CUE.zunge;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...app,
      background: `linear-gradient(160deg,${C.white} 0%,${C.cream} 100%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px 24px 32px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 32
    }
  }, ankerLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 30,
      fontWeight: 600,
      color: C.petrol,
      lineHeight: 1.25,
      marginBottom: 48
    }
  }, cue.frage), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onAntwort("a"),
    style: {
      ...btn(),
      fontSize: 17,
      padding: "16px 24px"
    }
  }, cue.a), /*#__PURE__*/React.createElement("button", {
    onClick: () => onAntwort("b"),
    style: {
      ...btnSec,
      fontSize: 17,
      padding: "16px 24px"
    }
  }, cue.b)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      fontSize: 12,
      color: C.lightblue
    }
  }, "Tippe auf deine Antwort")));
}

// ═══════════════════════════
// FEEDBACK-SCREEN
// ═══════════════════════════
function FeedbackScreen({
  onSave
}) {
  const [wahl, setWahl] = useState(null);
  const opt = [{
    v: 1,
    e: "😐"
  }, {
    v: 2,
    e: "🙂"
  }, {
    v: 3,
    e: "😊"
  }, {
    v: 4,
    e: "😌"
  }, {
    v: 5,
    e: "✨"
  }];
  useEffect(() => {
    if (wahl !== null) setTimeout(() => onSave(wahl), 600);
  }, [wahl]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...app,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "40px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 26,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 8
    }
  }, "Wie fühlt es sich an?"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 36
    }
  }, "Eine kurze Einschätzung – mehr nicht."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, opt.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.v,
    onClick: () => setWahl(o.v),
    style: {
      flex: 1,
      padding: "12px 4px",
      border: `2px solid ${wahl === o.v ? C.gold : "transparent"}`,
      background: wahl === o.v ? `${C.gold}20` : "transparent",
      borderRadius: 14,
      cursor: "pointer",
      transition: "all 0.2s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32
    }
  }, o.e)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      color: C.greyblue,
      padding: "0 8px"
    }
  }, /*#__PURE__*/React.createElement("span", null, "anstrengend"), /*#__PURE__*/React.createElement("span", null, "natürlich")), wahl && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 20,
      color: C.gold
    }
  }, "✓")));
}

// ═══════════════════════════
// HOME-SCREEN
// ═══════════════════════════
function HomeScreen({
  userData,
  eintraege,
  onStartCue
}) {
  const ankerObj = ANKER.filter(a => userData.anker.includes(a.id));
  const fokObj = FOKUS.find(f => f.id === userData.fokus) || FOKUS[0];
  const hEintraege = eintraege.filter(e => e.datum === heute());
  return /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 4
    }
  }, new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 26,
      fontWeight: 600,
      color: C.petrol,
      lineHeight: 1.2
    }
  }, "Merken.", /*#__PURE__*/React.createElement("br", null), "Integrieren.", /*#__PURE__*/React.createElement("br", null), "Automatisieren.")), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      borderLeft: `4px solid ${hEintraege.length > 0 ? C.gold : C.cream}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 18,
      color: C.petrol,
      marginBottom: 4
    }
  }, hEintraege.length > 0 ? `${hEintraege.length} Cue heute` : "Noch kein Cue heute"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.greyblue
    }
  }, fokObj.emoji, " ", fokObj.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 6
    }
  }, "Deine Alltagsanker"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 14
    }
  }, "Tippe, wenn du einen Anker erlebst."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, ankerObj.map(a => {
    const genutzt = hEintraege.filter(e => e.ankerId === a.id).length;
    return /*#__PURE__*/React.createElement("button", {
      key: a.id,
      onClick: () => onStartCue(a),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        background: C.white,
        border: `1.5px solid ${genutzt > 0 ? C.gold : C.cream}`,
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 28
      }
    }, a.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        color: C.petrol,
        fontWeight: 500
      }
    }, a.label), genutzt > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: C.gold
      }
    }, "Heute ", genutzt, "× genutzt")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: C.lightblue
      }
    }, "›"));
  })));
}

// ═══════════════════════════
// VERLAUF
// ═══════════════════════════
function VerlaufScreen({
  eintraege
}) {
  const tage = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toISOString().split("T")[0];
    const te = eintraege.filter(e => e.datum === k);
    tage.push({
      datum: k,
      anzahl: te.length,
      schnitt: te.length > 0 ? Math.round(te.reduce((s, e) => s + (e.wahrnehmung || 3), 0) / te.length) : null
    });
  }
  const maxA = Math.max(...tage.map(d => d.anzahl), 1);
  return /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 24,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 6
    }
  }, "Verlauf"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sub,
      marginBottom: 24
    }
  }, "Letzte 14 Tage"), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 14
    }
  }, "Cue-Momente pro Tag"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 4,
      height: 80
    }
  }, tage.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      background: d.anzahl > 0 ? C.petrol : C.cream,
      borderRadius: "3px 3px 0 0",
      height: `${d.anzahl / maxA * 64 + 4}px`,
      minHeight: 4,
      transition: "height 0.3s"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.greyblue,
      textAlign: "center"
    }
  }, fmtD(d.datum)))))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 12
    }
  }, "Körperwahrnehmung"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap"
    }
  }, tage.filter(d => d.schnitt !== null).map((d, i) => {
    const em = ["", "😐", "🙂", "😊", "😌", "✨"];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: "center",
        fontSize: 20,
        flex: 1
      }
    }, em[d.schnitt] || "");
  })), !eintraege.length && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.greyblue
    }
  }, "Noch keine Einträge.")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 13,
      color: C.greyblue
    }
  }, eintraege.length, " Einträge gesamt"));
}

// ═══════════════════════════
// AUSWERTUNG (Therapeuten)
// ═══════════════════════════
function AuswertungScreen({
  userData,
  eintraege
}) {
  const [pin, setPin] = useState("");
  const [offen, setOffen] = useState(false);
  const [zeitraum, setZeitraum] = useState(14);
  const [fehler, setFehler] = useState(false);
  const pruef = () => {
    if (pin === userData.pin) {
      setOffen(true);
      setFehler(false);
    } else {
      setFehler(true);
      setPin("");
    }
  };
  if (!userData.pin) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...scr,
        textAlign: "center",
        paddingTop: 60
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: h1
    }, "Auswertungsbereich"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...sub,
        marginBottom: 20
      }
    }, "Kein PIN gesetzt. Bitte in den Einstellungen einen 4-stelligen PIN vergeben."));
  }
  if (!offen) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...scr,
        paddingTop: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: `linear-gradient(145deg,${C.navy},${C.petrol})`,
        margin: "-24px -20px 28px",
        padding: "48px 24px 32px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Cormorant',Georgia,serif",
        fontSize: 28,
        fontWeight: 600,
        color: C.gold
      }
    }, "Auswertung"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.7)",
        marginTop: 4
      }
    }, "Für Therapeuten und Bezugspersonen")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...sub,
        textAlign: "center",
        marginBottom: 20
      }
    }, "Bitte PIN eingeben."), /*#__PURE__*/React.createElement("input", {
      type: "password",
      inputMode: "numeric",
      maxLength: 4,
      value: pin,
      onChange: e => setPin(e.target.value.replace(/\D/g, "").slice(0, 4)),
      onKeyDown: e => e.key === "Enter" && pruef(),
      style: {
        width: "100%",
        padding: "16px",
        fontSize: 24,
        textAlign: "center",
        border: `2px solid ${fehler ? "#c0392b" : C.lightblue}`,
        borderRadius: 12,
        outline: "none",
        marginBottom: 12,
        letterSpacing: 8,
        boxSizing: "border-box"
      },
      placeholder: "····"
    }), fehler && /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#c0392b",
        fontSize: 13,
        marginBottom: 12,
        textAlign: "center"
      }
    }, "Falscher Code. Bitte erneut versuchen."), /*#__PURE__*/React.createElement("button", {
      onClick: pruef,
      style: btn()
    }, "Entsperren"));
  }
  const von = new Date();
  von.setDate(von.getDate() - zeitraum);
  const gef = eintraege.filter(e => new Date(e.datum) >= von);
  const gesamt = gef.length;
  const tageAktiv = [...new Set(gef.map(e => e.datum))].length;
  const ankStats = {};
  gef.forEach(e => {
    ankStats[e.ankerId] = (ankStats[e.ankerId] || 0) + 1;
  });
  const topAnker = Object.entries(ankStats).sort((a, b) => b[1] - a[1]);
  const fokObj = FOKUS.find(f => f.id === userData.fokus);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...scr,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `linear-gradient(145deg,${C.navy},${C.petrol})`,
      margin: "-24px -20px 24px",
      padding: "40px 24px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 26,
      fontWeight: 600,
      color: C.gold
    }
  }, "Auswertung"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.7)",
      marginTop: 4
    }
  }, "Für Therapeuten und Bezugspersonen")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 20
    }
  }, [7, 14, 30].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setZeitraum(t),
    style: {
      flex: 1,
      padding: "10px",
      border: `1.5px solid ${zeitraum === t ? C.petrol : C.cream}`,
      background: zeitraum === t ? C.petrol : "transparent",
      color: zeitraum === t ? "white" : C.petrol,
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 14
    }
  }, t, " Tage"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 16
    }
  }, [{
    v: gesamt,
    l: "Cue-Momente"
  }, {
    v: tageAktiv,
    l: "Aktive Tage"
  }, {
    v: fokObj ? `${fokObj.emoji} ${fokObj.label}` : "–",
    l: "Fokus"
  }, {
    v: `seit ${fmtD(userData.erstelltAm)}`,
    l: "In Nutzung"
  }].map((k, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 20,
      fontWeight: 600,
      color: C.petrol
    }
  }, k.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.greyblue
    }
  }, k.l)))), /*#__PURE__*/React.createElement("div", {
    style: card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 12
    }
  }, "Häufig genutzte Anker"), topAnker.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.greyblue
    }
  }, "Noch keine Daten.") : topAnker.map(([id, count]) => {
    const a = ANKER.find(x => x.id === id);
    if (!a) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", null, a.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: C.petrol,
        marginBottom: 4
      }
    }, a.label), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        background: C.cream,
        borderRadius: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        width: `${count / (topAnker[0]?.[1] || 1) * 100}%`,
        background: C.petrol,
        borderRadius: 3
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: C.greyblue
      }
    }, count, "×"));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.print(),
    style: {
      ...btn(C.gold),
      marginTop: 8
    }
  }, "Bericht drucken / als PDF"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOffen(false),
    style: {
      ...btnSec,
      marginTop: 10
    }
  }, "Bereich schließen"));
}

// ═══════════════════════════
// EINSTELLUNGEN
// ═══════════════════════════
function EinstellungenScreen({
  userData,
  onUpdate,
  onReset
}) {
  const [fokus, setFokus] = useState(userData.fokus);
  const [anker, setAnker] = useState(userData.anker || []);
  const [neuerPin, setNeuerPin] = useState("");
  const togAnker = id => setAnker(a => a.includes(id) ? a.filter(x => x !== id) : a.length < 5 ? [...a, id] : a);
  const speichern = () => {
    const u = {
      ...userData,
      fokus,
      anker,
      ...(neuerPin.length === 4 ? {
        pin: neuerPin
      } : {})
    };
    sv("mia_user", u);
    onUpdate(u);
    setNeuerPin("");
    alert("Gespeichert.");
  };
  return /*#__PURE__*/React.createElement("div", {
    style: scr
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 24,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 20
    }
  }, "Einstellungen"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 8
    }
  }, "Fokus"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: 24
    }
  }, FOKUS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFokus(f.id),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      background: fokus === f.id ? `${C.petrol}14` : C.white,
      border: `2px solid ${fokus === f.id ? C.petrol : C.cream}`,
      borderRadius: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", null, f.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: C.petrol
    }
  }, f.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 8
    }
  }, "Alltagsanker (2–5)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 24
    }
  }, ANKER.map(a => {
    const sel = anker.includes(a.id);
    return /*#__PURE__*/React.createElement("button", {
      key: a.id,
      onClick: () => togAnker(a.id),
      style: {
        padding: "12px 8px",
        background: sel ? `${C.petrol}14` : C.white,
        border: `1.5px solid ${sel ? C.petrol : C.cream}`,
        borderRadius: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, a.emoji), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: sel ? C.petrol : C.greyblue
      }
    }, a.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.petrol,
      marginBottom: 8
    }
  }, "Auswertungs-PIN ", userData.pin ? "(gesetzt)" : "(noch kein PIN)"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    inputMode: "numeric",
    maxLength: 4,
    value: neuerPin,
    onChange: e => setNeuerPin(e.target.value.replace(/\D/g, "").slice(0, 4)),
    placeholder: "Neuen 4-stelligen PIN eingeben",
    style: {
      width: "100%",
      padding: "12px 14px",
      border: `1.5px solid ${C.lightblue}`,
      borderRadius: 10,
      fontSize: 16,
      marginBottom: 20,
      outline: "none",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: speichern,
    style: btn()
  }, "Speichern"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 20,
      borderTop: `1px solid ${C.cream}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.greyblue,
      marginBottom: 10
    }
  }, "Alle MIA-Daten auf diesem Gerät löschen? Diese Aktion kann nicht rückgängig gemacht werden."), /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    style: btn("#c0392b")
  }, "Alle Daten löschen")));
}

// ═══════════════════════════
// NAVIGATION
// ═══════════════════════════
function NavBar({
  tab,
  setTab
}) {
  const items = [{
    id: "home",
    emoji: "🏠",
    label: "Heute"
  }, {
    id: "verlauf",
    emoji: "📈",
    label: "Verlauf"
  }, {
    id: "auswertung",
    emoji: "📊",
    label: "Auswertung"
  }, {
    id: "einstellungen",
    emoji: "⚙️",
    label: "Einstellungen"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: 430,
      margin: "0 auto",
      background: "rgba(247,249,251,0.96)",
      backdropFilter: "blur(12px)",
      borderTop: `1px solid ${C.cream}`,
      display: "flex",
      zIndex: 100
    }
  }, items.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.id,
    onClick: () => setTab(i.id),
    style: {
      flex: 1,
      padding: "10px 4px 12px",
      background: "none",
      border: "none",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, i.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: tab === i.id ? C.petrol : C.greyblue,
      fontWeight: tab === i.id ? 600 : 400
    }
  }, i.label))));
}

// ═══════════════════════════
// APP ROOT
// ═══════════════════════════
function App() {
  const [userData, setUserData] = useState(null);
  const [eintraege, setEintraege] = useState([]);
  const [flow, setFlow] = useState(null);
  const [tab, setTab] = useState("home");
  const [geladen, setGeladen] = useState(false);
  useEffect(() => {
    const u = ld("mia_user");
    if (u) setUserData(u);
    const e = ld("mia_eintraege", []);
    setEintraege(e);
    setGeladen(true);
  }, []);
  if (!geladen) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: C.white
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant',Georgia,serif",
      fontSize: 22,
      color: C.petrol
    }
  }, "MIA"));
  if (!userData) return /*#__PURE__*/React.createElement(Onboarding, {
    onComplete: u => setUserData(u)
  });
  if (flow) {
    if (flow.schritt === "cue") return /*#__PURE__*/React.createElement(CueScreen, {
      fokus: userData.fokus,
      ankerLabel: flow.anker.label,
      onAntwort: a => setFlow(f => ({
        ...f,
        cueAntwort: a,
        schritt: "mikro"
      }))
    });
    if (flow.schritt === "mikro") return /*#__PURE__*/React.createElement(MikroScreen, {
      fokus: userData.fokus,
      onDone: () => setFlow(f => ({
        ...f,
        schritt: "feedback"
      }))
    });
    if (flow.schritt === "feedback") return /*#__PURE__*/React.createElement(FeedbackScreen, {
      onSave: w => {
        const neu = [...eintraege, {
          id: Date.now(),
          datum: heute(),
          ankerId: flow.anker.id,
          cueAntwort: flow.cueAntwort,
          wahrnehmung: w,
          ts: new Date().toISOString()
        }];
        setEintraege(neu);
        sv("mia_eintraege", neu);
        setFlow(null);
      }
    });
  }
  const onReset = () => {
    if (window.confirm("Alle MIA-Daten auf diesem Gerät löschen?")) {
      localStorage.removeItem("mia_user");
      localStorage.removeItem("mia_eintraege");
      setUserData(null);
      setEintraege([]);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: app
  }, tab === "home" && /*#__PURE__*/React.createElement(HomeScreen, {
    userData: userData,
    eintraege: eintraege,
    onStartCue: a => setFlow({
      anker: a,
      schritt: "cue",
      cueAntwort: null
    })
  }), tab === "verlauf" && /*#__PURE__*/React.createElement(VerlaufScreen, {
    eintraege: eintraege
  }), tab === "auswertung" && /*#__PURE__*/React.createElement(AuswertungScreen, {
    userData: userData,
    eintraege: eintraege
  }), tab === "einstellungen" && /*#__PURE__*/React.createElement(EinstellungenScreen, {
    userData: userData,
    onUpdate: u => setUserData(u),
    onReset: onReset
  }), /*#__PURE__*/React.createElement(NavBar, {
    tab: tab,
    setTab: setTab
  }));
}
ReactDOM.createRoot(document.getElementById('mia-root')).render(React.createElement(App, null));
