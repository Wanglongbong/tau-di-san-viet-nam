"use client";

import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { getSource, stops } from "@/lib/heritage";
import type { GuideResponse, HeritageStop, Hotspot, Language } from "@/lib/types";

const copy = {
  vi: {
    brand: "TÀU DI SẢN",
    brandSub: "Một Việt Nam đang sống",
    board: "LÊN TÀU",
    introKicker: "HÀNH TRÌNH BẮC — NAM / 05 GA",
    introTitleA: "Đi qua Việt Nam.",
    introTitleB: "Lắng nghe điều còn ở lại.",
    introBody: "Đứng trong một toa tàu, mở năm cánh cửa và chạm vào những ký ức đang được truyền từ người sang người. Mọi câu chuyện đều đi cùng nguồn.",
    start: "Khởi hành từ Kinh Bắc",
    instruction: "Di chuột gần một vật để đánh thức câu chuyện",
    explored: "đã mở",
    archive: "Sổ di sản",
    verified: "Nguồn đã duyệt",
    sound: "Âm thanh",
    source: "Mở nguồn gốc",
    officialRecording: "Nghe tại hồ sơ chính thức",
    next: "Ga kế tiếp",
    previous: "Ga trước",
    askTitle: "Hỏi Trưởng tàu AI",
    askHint: "Chỉ trả lời từ hồ sơ đang mở và luôn dẫn nguồn.",
    askPlaceholder: "Vì sao chi tiết này quan trọng?",
    ask: "Hỏi",
    asking: "Đang đối chiếu nguồn…",
    close: "Đóng",
    rights: "Quyền sử dụng",
    reviewedBy: "Đối chiếu bởi",
    export: "Xuất metadata JSON",
    emptyArchive: "Hãy chạm vào một vật trong cảnh để bắt đầu Sổ di sản.",
    archiveIntro: "Những hồ sơ bạn đã mở — kèm nguồn, quyền sử dụng và trạng thái kiểm duyệt.",
    illustration: "Minh họa pixel dựa trên dữ kiện công khai — không thay thế lời nghệ nhân.",
    animationNote: "Hoạt ảnh khái quát, không phải hướng dẫn tay nghề hay tái tạo nghi lễ.",
    localAudio: "Bản ghi có giấy phép",
    officialAudio: "Bản ghi chưa được sao chép vào game; mở tại nguồn chính thức.",
    aiFallback: "Chế độ tư liệu kiểm chứng",
    aiLive: "OpenAI · câu trả lời có rào nguồn",
    arrival: "TÀU ĐANG VÀO GA",
    allStops: "Tuyến di sản",
    mute: "Tắt tiếng",
    unmute: "Bật tiếng",
  },
  en: {
    brand: "HERITAGE EXPRESS",
    brandSub: "A living Viet Nam",
    board: "BOARD TRAIN",
    introKicker: "NORTH — SOUTH / 05 STOPS",
    introTitleA: "Cross Viet Nam.",
    introTitleB: "Listen to what remains.",
    introBody: "Stand inside a train carriage, open five doors and touch memories passed from person to person. Every story travels with its source.",
    start: "Depart from Kinh Bắc",
    instruction: "Move close to an object to wake its story",
    explored: "opened",
    archive: "Heritage journal",
    verified: "Approved source",
    sound: "Sound",
    source: "Open primary source",
    officialRecording: "Listen at the official file",
    next: "Next stop",
    previous: "Previous stop",
    askTitle: "Ask the AI conductor",
    askHint: "Answers only from the open record, with sources.",
    askPlaceholder: "Why does this detail matter?",
    ask: "Ask",
    asking: "Checking the source…",
    close: "Close",
    rights: "Usage rights",
    reviewedBy: "Cross-checked by",
    export: "Export metadata JSON",
    emptyArchive: "Touch an object in the scene to begin your heritage journal.",
    archiveIntro: "The records you opened — with sources, rights and review status.",
    illustration: "Pixel illustration based on public facts — not a substitute for artisan testimony.",
    animationNote: "A high-level animation, not craft instruction or ritual reconstruction.",
    localAudio: "Licensed recording",
    officialAudio: "The recording is not copied into the game; open it at the official source.",
    aiFallback: "Verified archive mode",
    aiLive: "OpenAI · source-bounded answer",
    arrival: "NOW ARRIVING",
    allStops: "Heritage line",
    mute: "Mute",
    unmute: "Sound on",
  },
};

export function HeritageGame() {
  const [language, setLanguage] = useState<Language>("vi");
  const [started, setStarted] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [openHotspot, setOpenHotspot] = useState<Hotspot | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [travelling, setTravelling] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ui = copy[language];
  const stop = stops[stopIndex];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("heritage-language");
    const savedVisited = window.localStorage.getItem("heritage-visited");
    const restore = window.setTimeout(() => {
      if (savedLanguage === "vi" || savedLanguage === "en") setLanguage(savedLanguage);
      if (savedVisited) {
        try { setVisited(new Set(JSON.parse(savedVisited) as string[])); } catch { /* ignore invalid local state */ }
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("heritage-language", language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("heritage-visited", JSON.stringify([...visited]));
  }, [visited]);

  function openRecord(hotspot: Hotspot) {
    setVisited((current) => new Set(current).add(`${stop.id}:${hotspot.id}`));
    setOpenHotspot(hotspot);
  }

  function travelTo(index: number) {
    if (index === stopIndex || travelling) return;
    setOpenHotspot(null);
    setActiveHotspotId(null);
    setTravelling(true);
    window.setTimeout(() => {
      setStopIndex(index);
      window.setTimeout(() => setTravelling(false), 520);
    }, 520);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const buttons = sceneRef.current?.querySelectorAll<HTMLButtonElement>("[data-hotspot]");
    if (!buttons) return;
    let closest: { id: string; distance: number } | null = null;
    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) - Math.max(rect.width, rect.height) / 2;
      if (!closest || distance < closest.distance) closest = { id: button.dataset.hotspot || "", distance };
    });
    setActiveHotspotId(closest && closest.distance < 94 ? closest.id : null);
  }

  const visitedCount = visited.size;
  const stopVisited = stop.hotspots.filter((hotspot) => visited.has(`${stop.id}:${hotspot.id}`)).length;

  return (
    <main className="game-shell" style={{ "--stop-accent": stop.palette } as React.CSSProperties}>
      <header className="topbar">
        <button className="wordmark" onClick={() => setStarted(false)} aria-label={ui.brand}>
          <span className="wordmark-mark">T</span>
          <span><b>{ui.brand}</b><small>{ui.brandSub}</small></span>
        </button>
        <div className="journey-status">
          <span>{stop.number} / 05</span>
          <b>{stop.location[language]}</b>
        </div>
        <div className="top-actions">
          <button onClick={() => setMuted((value) => !value)} aria-label={muted ? ui.unmute : ui.mute} className="icon-button">{muted ? "◌" : "♪"}</button>
          <button className="language-switch" onClick={() => setLanguage(language === "vi" ? "en" : "vi")}>{language === "vi" ? "EN" : "VI"}</button>
          <button className="archive-button" onClick={() => setArchiveOpen(true)}><span>{visitedCount.toString().padStart(2, "0")}</span>{ui.archive}</button>
        </div>
      </header>

      <section className="route-bar" aria-label={ui.allStops}>
        <span className="route-rail" aria-hidden="true" />
        {stops.map((item, index) => {
          const completed = item.hotspots.every((hotspot) => visited.has(`${item.id}:${hotspot.id}`));
          return <button key={item.id} className={`${index === stopIndex ? "current" : ""} ${completed ? "completed" : ""}`} onClick={() => travelTo(index)}>
            <i />
            <span>{item.location[language].split("·")[0]}</span>
          </button>;
        })}
      </section>

      <section className={`scene-wrap ${travelling ? "travelling" : ""}`}>
        <div className="train-frame" aria-hidden="true"><span className="frame-top" /><span className="frame-left" /><span className="frame-right" /><span className="frame-bottom" /></div>
        <div
          ref={sceneRef}
          className="scene"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveHotspotId(null)}
          style={{ backgroundImage: `linear-gradient(180deg, transparent 68%, rgba(8, 8, 7, .2)), url(${stop.scene})` }}
          aria-label={`${stop.title[language]} — ${stop.description[language]}`}
        >
          <div className="scene-heading">
            <span>GA {stop.number} · {stop.location[language]}</span>
            <h1>{stop.title[language]}</h1>
            <p>{stop.subtitle[language]}</p>
          </div>
          <div className="instruction"><i className="mouse-glyph" /> {ui.instruction}</div>
          {stop.hotspots.map((hotspot, index) => {
            const active = activeHotspotId === hotspot.id;
            const seen = visited.has(`${stop.id}:${hotspot.id}`);
            return <button
              key={hotspot.id}
              data-hotspot={hotspot.id}
              className={`hotspot ${active ? "near" : ""} ${seen ? "seen" : ""}`}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, "--radius": `${hotspot.radius * 8}px` } as React.CSSProperties}
              onPointerEnter={() => setActiveHotspotId(hotspot.id)}
              onFocus={() => setActiveHotspotId(hotspot.id)}
              onBlur={() => setActiveHotspotId(null)}
              onClick={() => openRecord(hotspot)}
              aria-label={hotspot.label[language]}
            >
              <span className="hotspot-orbit" />
              <span className="hotspot-dot">{seen ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <span className="hotspot-label"><small>{hotspot.kicker[language]}</small><b>{hotspot.label[language]}</b></span>
            </button>;
          })}
        </div>
        <div className="scene-footer">
          <div><b>{stopVisited}/3</b><span>{ui.explored}</span></div>
          <p>{ui.illustration}</p>
          <div className="station-controls">
            <button disabled={stopIndex === 0 || travelling} onClick={() => travelTo(stopIndex - 1)}>← {ui.previous}</button>
            <button disabled={stopIndex === stops.length - 1 || travelling} onClick={() => travelTo(stopIndex + 1)}>{ui.next} →</button>
          </div>
        </div>
        <div className="travel-curtain" aria-hidden={!travelling}><div className="passing-landscape" /><span>{ui.arrival}</span><b>{stops[stopIndex].location[language]}</b></div>
      </section>

      {!started && <Intro language={language} onLanguage={setLanguage} onStart={() => setStarted(true)} />}
      {openHotspot && <RecordDrawer key={`${stop.id}:${openHotspot.id}`} stop={stop} hotspot={openHotspot} language={language} muted={muted} onClose={() => setOpenHotspot(null)} />}
      {archiveOpen && <Archive language={language} visited={visited} onClose={() => setArchiveOpen(false)} />}
    </main>
  );
}

function Intro({ language, onLanguage, onStart }: { language: Language; onLanguage: (language: Language) => void; onStart: () => void }) {
  const ui = copy[language];
  return <div className="intro-screen">
    <div className="intro-noise" />
    <div className="intro-copy">
      <span className="intro-kicker"><i /> {ui.introKicker}</span>
      <h1>{ui.introTitleA}<br /><em>{ui.introTitleB}</em></h1>
      <p>{ui.introBody}</p>
      <div className="intro-actions">
        <button onClick={onStart}>{ui.start}<span>→</span></button>
        <div className="intro-language"><button className={language === "vi" ? "active" : ""} onClick={() => onLanguage("vi")}>VI</button><button className={language === "en" ? "active" : ""} onClick={() => onLanguage("en")}>EN</button></div>
      </div>
    </div>
    <div className="intro-train-art" aria-hidden="true">
      <div className="train-window"><div className="window-sky" /><div className="window-fields" /><div className="window-sun" /><div className="window-track" /></div>
      <div className="ticket"><small>{ui.board}</small><b>HÀ NỘI</b><i /> <b>SÀI GÒN</b><span>05 GA · 1,726 KM</span></div>
    </div>
    <div className="intro-source"><span>●</span> 05 UNESCO FILES <i /> 15 VERIFIED RECORDS <i /> NO CULTURAL FABRICATION</div>
  </div>;
}

function RecordDrawer({ stop, hotspot, language, muted, onClose }: { stop: HeritageStop; hotspot: Hotspot; language: Language; muted: boolean; onClose: () => void }) {
  const ui = copy[language];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<GuideResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const sourceRecords = hotspot.sourceIds.map(getSource).filter(Boolean);

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stopId: stop.id, hotspotId: hotspot.id, question: question.trim(), language }),
      });
      setAnswer(await response.json() as GuideResponse);
    } catch {
      setAnswer({ answer: language === "vi" ? "Hiện chưa kết nối được kho tư liệu. Hãy đọc thẻ nguồn bên dưới." : "The archive is temporarily unavailable. Please use the source card below.", sourceIds: [], grounded: false, refusalReason: "network", mode: "refusal" });
    } finally { setLoading(false); }
  }

  return <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="record-drawer" role="dialog" aria-modal="true" aria-label={hotspot.label[language]}>
      <div className="drawer-top"><span>{stop.number} / {stop.location[language]}</span><button onClick={onClose} aria-label={ui.close}>×</button></div>
      <div className="record-heading"><span>{hotspot.kicker[language]}</span><h2>{hotspot.label[language]}</h2><p>{hotspot.story[language]}</p></div>
      <div className="fact-list">{hotspot.facts.map((fact, index) => <div key={fact.vi}><span>0{index + 1}</span><p>{fact[language]}</p></div>)}</div>

      {hotspot.media?.kind === "audio" && <div className="media-card">
        <span>♪ {ui.localAudio}</span>
        <audio controls preload="metadata" muted={muted} src={hotspot.media.src} />
        <small>{hotspot.media.credit?.[language]}</small>
      </div>}
      {hotspot.media?.kind === "official-link" && <div className="media-card official-media"><div className="sound-wave"><i /><i /><i /><i /><i /><i /></div><p>{ui.officialAudio}</p><a href={hotspot.media.sourceUrl} target="_blank" rel="noreferrer">{ui.officialRecording} ↗</a></div>}
      {hotspot.media?.kind === "animation" && <div className={`craft-animation ${stop.id === "cham-pottery" ? "pottery-animation" : "rhythm-animation"}`} aria-label={ui.animationNote}><div className="animation-stage"><i /><i /><i /><i /><span /></div><small>{ui.animationNote}</small></div>}

      <form className="guide-box" onSubmit={ask}>
        <div><span className="conductor-mark">AI</span><p><b>{ui.askTitle}</b><small>{ui.askHint}</small></p></div>
        <label><span className="sr-only">{ui.askTitle}</span><input maxLength={300} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={ui.askPlaceholder} /><button disabled={loading || !question.trim()}>{loading ? "···" : "→"}</button></label>
        {loading && <span className="checking">{ui.asking}</span>}
        {answer && <div className={`guide-answer ${answer.grounded ? "grounded" : "refused"}`}><span>{answer.mode === "ai" ? ui.aiLive : ui.aiFallback}</span><p>{answer.answer}</p>{answer.sourceIds.length > 0 && <small>{ui.verified}: {answer.sourceIds.join(", ")}</small>}</div>}
      </form>

      <section className="source-stack">
        {sourceRecords.map((source) => source && <article key={source.id}>
          <div><span className="approval-dot" /><small>{ui.verified}</small></div>
          <h3>{source.title[language]}</h3>
          <p>{source.institution}</p>
          <dl><div><dt>{ui.reviewedBy}</dt><dd>{source.reviewedBy}</dd></div><div><dt>{ui.rights}</dt><dd>{source.rights[language]}</dd></div></dl>
          <a href={source.url} target="_blank" rel="noreferrer">{ui.source} ↗</a>
        </article>)}
      </section>
    </aside>
  </div>;
}

function Archive({ language, visited, onClose }: { language: Language; visited: Set<string>; onClose: () => void }) {
  const ui = copy[language];
  const records = useMemo(() => stops.flatMap((stop) => stop.hotspots.filter((hotspot) => visited.has(`${stop.id}:${hotspot.id}`)).map((hotspot) => ({ stop, hotspot }))), [visited]);

  function exportArchive() {
    const payload = records.map(({ stop, hotspot }) => ({
      stop: stop.title,
      location: stop.location,
      record: { id: hotspot.id, label: hotspot.label, story: hotspot.story, sourceIds: hotspot.sourceIds },
      sources: hotspot.sourceIds.map(getSource),
      exportedAt: new Date().toISOString(),
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "tau-di-san-archive.json"; anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div className="archive-overlay" role="dialog" aria-modal="true" aria-label={ui.archive}>
    <header><div><span>ARCHIVE / {records.length.toString().padStart(2, "0")}</span><h2>{ui.archive}</h2><p>{ui.archiveIntro}</p></div><button onClick={onClose}>×</button></header>
    {records.length === 0 ? <div className="archive-empty"><i>◇</i><p>{ui.emptyArchive}</p></div> : <div className="archive-grid">{records.map(({ stop, hotspot }, index) => <article key={`${stop.id}:${hotspot.id}`}>
      <span>{String(index + 1).padStart(2, "0")} · {stop.location[language]}</span>
      <h3>{hotspot.label[language]}</h3>
      <p>{hotspot.story[language]}</p>
      <small>✓ {hotspot.sourceIds.join(" · ")}</small>
    </article>)}</div>}
    <footer><button disabled={records.length === 0} onClick={exportArchive}>{ui.export} ↓</button><span>LOCAL ONLY · NO CAMERA · NO PERSONAL DATA</span></footer>
  </div>;
}
