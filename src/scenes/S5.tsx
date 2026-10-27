import React from "react";
import { AbsoluteFill } from "remotion";
import { CheckCircle2, File as FileIcon, GraduationCap, HelpCircle, Layers, BarChart3, Link2 } from "lucide-react";
import { Background, Cursor, Doc, Glass, Grad, RainbowText, Sfx, Title } from "../fx";
import {keys, prog, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { SCENES, VOICE_DUR } from "../timeline";
import { C, INTER, SPECTRUM } from "../theme";
import { AppWindow, Dashboard, DROP, FORMATS, NAV_NEW, NEXT_BTN, NewAdaptation, NewState, OPTIONS, Result, SCROLL2, TAB, WIN, optionCenter } from "../ui/App";

// Product demo driven by a virtual user (voice 5A) and the conceptual wrap-up (voice 5B)
const PRE = scenePre("s5");
const v = (c: Cue) => PRE + cueAt("v5a", c);
const V5B = SCENES.find((s) => s.id === "s5")!.extraAt;
const vb = (c: Cue) => V5B + cueAt("v5b", c);

const txt = (size: number, color: string, weight = 400): React.CSSProperties => ({ fontFamily: INTER, fontSize: size, color, fontWeight: weight });

export const S5: React.FC = () => {
  const t = useT();

  // ── key times, synced to voice 5A ──
  const tNav = v(cue("s5Nav")) + 0.2;
  const tNavClick = tNav + 0.7;
  const tDragStart = tNavClick + 0.6;
  const tDrop = tDragStart + 1.4;
  const tUploaded = tDrop + 0.9;
  const tScroll = tUploaded + 0.4;
  const tJunior = tScroll + 0.9;
  const tNext1 = tJunior + 0.5;
  const hoverT = cues("s5Hover").map(v);
  const hoverK = [1, 2, 0, 3]; // Tutorial, Quiz, Flashcards, Executive Summary
  const tPickFmt = v(cue("s5Pick"));
  const tNext2 = tPickFmt + 0.3;
  const tNext3 = tNext2 + 0.3;
  const tNext4 = tNext3 + 0.3;
  const tGen = tNext4 + 0.3;
  const tRes = tGen + 0.9;
  const tQuizAns = v(cue("s5Ans"));
  const tFlashTab = v(cue("s5Flash")) + 0.3;
  const tFlip = v(cue("s5Flip"));
  const tSumTab = v(cue("s5Sum")) + 0.3;
  const tKnow = v(cue("s5Know"));
  const tCycle = v(cue("s5Cycle"));
  const tSource = v(cue("s5Source"));
  const tOut = PRE + VOICE_DUR.v5a + 0.2;
  // tabs: Quiz → Flashcards → Summary → quick cycle through all four
  const tabSeq: [number, number][] = [[tRes, 1], [tFlashTab, 2], [tSumTab, 3], [tCycle, 0], [tCycle + 0.8, 1], [tCycle + 1.6, 2], [tCycle + 2.4, 3]];
  const cur = tabSeq.filter(([x]) => t >= x).pop() ?? tabSeq[0];
  const tab = cur[1];
  const tabLocal = t - cur[0] + (cur[0] >= tCycle ? 5 : 0);

  // ── UI state ──
  const view = t < tNavClick ? "dashboard" : t < tRes ? "new" : "result";
  const step = t < tNext1 ? 0 : t < tNext2 ? 1 : t < tNext3 ? 2 : 3;
  const selected: Record<string, string> = { industry: "General", detail: L.t.detailSelected };
  if (t >= tJunior) selected.profile = "Junior";
  if (t >= tPickFmt) selected.format = "Quiz";
  let hover = -1;
  hoverT.forEach((h, i) => { if (t >= h && step === 1 && t < tPickFmt) hover = hoverK[i]; });
  const s: NewState = {
    scroll: SCROLL2 * prog(t, tScroll, 0.7),
    dragging: t > tDragStart + 0.9 && t < tDrop,
    uploading: t >= tDrop && t < tUploaded,
    uploaded: t >= tUploaded,
    step,
    selected,
    hover,
    generating: t >= tGen ? prog(t, tGen, 0.85, (x) => x) : -1,
  };
  const sourceGlow = Math.max(prog(t, tKnow, 0.5) * (1 - prog(t, tCycle - 0.5, 0.5)), prog(t, tSource, 0.4) * (1 - prog(t, tOut, 0.4)));

  // ── cursor (window coordinates) ──
  const opt = (k: number) => optionCenter(k);
  const path: [number, number, number][] = [
    [0, 980, 620], [tNav, 980, 620], [tNavClick - 0.05, NAV_NEW.x, NAV_NEW.y],
    [tDragStart, 1500, 360], [tDrop - 0.1, DROP.x + DROP.w / 2, DROP.y + 70], [tDrop + 0.3, DROP.x + DROP.w / 2 + 30, DROP.y + 90],
    [tJunior - 0.1, opt(1).x + 60, opt(1).y + 10], [tNext1 - 0.05, NEXT_BTN.x, NEXT_BTN.y],
    ...hoverT.map((h, i) => [h + 0.25, opt(hoverK[i]).x + 60, opt(hoverK[i]).y + 10] as [number, number, number]),
    [tPickFmt - 0.05, opt(2).x + 60, opt(2).y + 10], [tNext2 - 0.05, NEXT_BTN.x, NEXT_BTN.y], [tGen - 0.05, NEXT_BTN.x, NEXT_BTN.y],
    [tRes + 0.8, 1100, 620], [tQuizAns - 0.05, 930, 434],
    [tFlashTab - 0.05, TAB(2).x, TAB(2).y], [tFlip - 0.05, 1090, 520], [tSumTab - 0.05, TAB(3).x, TAB(3).y], [tSumTab + 1.5, 1300, 700],
    [tKnow + 0.3, 440, 330], [tCycle - 0.6, 440, 330],
    [tCycle - 0.05, TAB(0).x, TAB(0).y], [tCycle + 0.75, TAB(1).x, TAB(1).y], [tCycle + 1.55, TAB(2).x, TAB(2).y], [tCycle + 2.35, TAB(3).x, TAB(3).y],
  ];
  const cx = keys(t, path.map((p) => [p[0], p[1]]));
  const cy = keys(t, path.map((p) => [p[0], p[2]]));
  const clicks = [tNavClick, tDrop, tJunior, tNext1, tPickFmt, tNext2, tNext3, tNext4, tGen, tQuizAns, tFlashTab, tFlip, tSumTab, tCycle, tCycle + 0.8, tCycle + 1.6, tCycle + 2.4];

  // dragged file
  const dragP = prog(t, tDragStart, 0.4);

  // ── camera ──
  const camS = keys(t, [[1.3, 0.86], [2.8, 0.92], [tDragStart, 0.92], [tDragStart + 0.6, 1.18], [tUploaded + 0.4, 1.18], [tScroll + 0.6, 1.1], [tGen, 1.1], [tGen + 0.8, 0.95], [tRes + 1, 1.24], [tOut, 1.24], [tOut + 1.6, 0.5]]);
  const focusX = keys(t, [[0, 800], [tDragStart, 800], [tDragStart + 0.6, 930], [tScroll + 0.6, 920], [tGen + 0.8, 800], [tRes + 1, 1000], [tKnow - 0.3, 1000], [tKnow + 0.6, 780], [tCycle - 0.6, 780], [tCycle, 1000], [tOut, 1000], [tOut + 1.6, 800]]);
  const focusY = keys(t, [[0, 450], [tDragStart, 450], [tDragStart + 0.6, 360], [tScroll + 0.6, 470], [tGen + 0.8, 450], [tRes + 1, 470], [tOut, 470], [tOut + 1.6, 450]]);
  const enter = prog(t, 1.3, 1.5);
  const rotX = (1 - enter) * 28 + keys(t, [[tOut, 0], [tOut + 1.6, 6]]);
  const winX = keys(t, [[tOut, 0], [tOut + 1.6, -420]]);
  const winY = (1 - enter) * 260 + keys(t, [[tOut, 0], [tOut + 1.6, 30]]);

  const content = (() => {
    if (view === "dashboard") return <Dashboard />;
    if (view === "new") return <NewAdaptation s={s} />;
    return (
      <Result tab={tab} anchor={prog(t, tRes + 0.4, 1.4)} glow={sourceGlow}>
        {tab === 0 && <Tutorial t={tabLocal} />}
        {tab === 1 && <Quiz t={tabLocal} ans={t >= tQuizAns} />}
        {tab === 2 && <Flashcard t={t - tFlip} />}
        {tab === 3 && <Summary t={tabLocal} />}
      </Result>
    );
  })();

  const outP = prog(t, tOut + 0.3, 1.2);

  return (
    <AbsoluteFill style={{ perspective: 2200 }}>
      <Background hue="#4f46e5" />
      <Title p={prog(t, 0.1, 0.6) * (1 - prog(t, 1.5, 0.4))} y={460} size={72}>
        {L.t.s5Title}
      </Title>
      <div style={{ position: "absolute", left: 960 - focusX, top: 540 - focusY, width: WIN.w, height: WIN.h, transformOrigin: `${focusX}px ${focusY}px`, transform: `translate(${winX}px, ${winY}px) scale(${camS}) rotateX(${rotX}deg)`, opacity: enter }}>
        <AppWindow url={view === "result" ? "nuevamente.app/result/34" : view === "new" ? "nuevamente.app/new" : "nuevamente.app"} active={view === "dashboard" ? "dashboard" : "new"}>
          {content}
        </AppWindow>
        {/* file being dragged onto the drop zone */}
        {t >= tDragStart && t < tDrop + 0.1 && (
          <div style={{ position: "absolute", left: cx - 20, top: cy - 20, opacity: dragP, transform: `rotate(${(1 - prog(t, tDrop - 0.4, 0.4)) * -6}deg) scale(${0.9 + 0.1 * dragP})`, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 12, background: "rgba(30,41,59,.95)", border: `1px solid ${C.brand500}`, boxShadow: `0 20px 40px rgba(0,0,0,.5), 0 0 30px ${C.brand600}66`, zIndex: 40 }}>
            <FileIcon size={22} color={C.brand400} />
            <span style={txt(15, C.slate200, 600)}>{L.t.fileName}</span>
          </div>
        )}
        <Cursor x={cx} y={cy} clicks={clicks} t={t} opacity={enter * (1 - prog(t, tOut, 0.4))} />
      </div>

      {/* wrap-up: one source, many ways to learn */}
      <OutroFan t={t} t0={tOut + 0.3} p={outP} hl={cues("s5bHl").map(vb)} tPeople={vb(cue("s5bPeople"))} tTitle={vb(cue("s5bTitle"))} tEnd={vb(cue("s5bEnd"))} />

      <Sfx at={1.3} name="whoosh" vol={0.45} />
      <Sfx at={tDrop} name="pop" vol={0.4} />
      <Sfx at={tUploaded} name="ding" vol={0.35} />
      <Sfx at={tScroll} name="whoosh" vol={0.15} />
      {clicks.filter((c) => c !== tDrop).map((c, i) => <Sfx key={i} at={c} name="click" vol={0.55} />)}
      {hoverT.map((h, i) => <Sfx key={`h${i}`} at={h + 0.25} name="pop" vol={0.18} />)}
      <Sfx at={tGen} name="rise" vol={0.3} />
      <Sfx at={tRes} name="ding" vol={0.4} />
      <Sfx at={tQuizAns + 0.1} name="ding" vol={0.35} />
      <Sfx at={tKnow} name="shimmer" vol={0.25} />
      <Sfx at={tFlip} name="whoosh" vol={0.25} />
      <Sfx at={tOut} name="whoosh" vol={0.35} />
      <Sfx at={tOut + 1.2} name="shimmer" vol={0.4} />
    </AbsoluteFill>
  );
};

// ── Result views (sample content based on the product repo's IAM corpus) ──

const Head: React.FC<{ Icon: any; title: string; sub: string }> = ({ Icon, title, sub }) => (
  <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "28px 34px 0" }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(79,70,229,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={24} color={C.brand400} /></div>
    <div>
      <div style={txt(24, "#f8fafc", 700)}>{title}</div>
      <div style={txt(14, C.slate400)}>{sub}</div>
    </div>
  </div>
);
const Src: React.FC<{ s: string }> = ({ s }) => (
  <span style={{ marginLeft: 10, padding: "3px 9px", borderRadius: 99, background: "rgba(250,204,21,.12)", border: "1px solid rgba(250,204,21,.35)", ...txt(11.5, C.yellow, 600), whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4 }}><Link2 size={11} /> {s}</span>
);

const Tutorial: React.FC<{ t: number }> = ({ t }) => {
  const steps = L.t.tutorial.steps;
  return (
    <>
      <Head Icon={GraduationCap} title={L.t.tutorial.title} sub={L.t.tutorial.sub} />
      <div style={{ padding: "18px 34px 0", ...txt(15.5, C.slate300), lineHeight: 1.55, opacity: prog(t, 0.3, 0.5) }}>{L.t.tutorial.intro}</div>
      {steps.map(([h, d, p], i) => {
        const a = prog(t, 0.8 + i * 0.7, 0.5);
        return (
          <div key={h} style={{ margin: "16px 34px 0", padding: "16px 18px", borderRadius: 12, background: "rgba(15,23,42,.6)", border: "1px solid #334155", display: "flex", gap: 14, alignItems: "flex-start", opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: a > 0.9 ? "rgba(52,211,153,.2)" : "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", ...txt(14, C.emerald, 700), flexShrink: 0 }}>{a > 0.9 ? <CheckCircle2 size={18} /> : i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={txt(16, "#f1f5f9", 600)}>{h}<Src s={p} /></div>
              <div style={{ ...txt(14, C.slate400), marginTop: 4 }}>{d}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Quiz: React.FC<{ t: number; ans: boolean }> = ({ t, ans }) => {
  const opts = L.t.quiz.options;
  return (
    <>
      <Head Icon={HelpCircle} title={L.t.quiz.title} sub={L.t.quiz.sub} />
      <div style={{ padding: "26px 34px 0", ...txt(21, "#f1f5f9", 600), lineHeight: 1.4 }}>{L.t.quiz.question}</div>
      {opts.map((o, i) => {
        const a = prog(t, 0.4 + i * 0.25, 0.4);
        const ok = ans && i === 1;
        return (
          <div key={o} style={{ margin: "14px 34px 0", height: 62, borderRadius: 12, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", border: `1px solid ${ok ? C.emerald : "#334155"}`, background: ok ? "rgba(52,211,153,.12)" : "rgba(15,23,42,.6)", opacity: a, ...txt(16, ok ? "#ecfdf5" : C.slate300, 500) }}>
            <span style={{ width: 28, height: 28, borderRadius: 14, border: `1px solid ${ok ? C.emerald : "#475569"}`, display: "flex", alignItems: "center", justifyContent: "center", ...txt(13, ok ? C.emerald : C.slate400, 700) }}>{"ABCD"[i]}</span>
            {o}
            {ok && <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, ...txt(14, C.emerald, 600) }}><CheckCircle2 size={18} /> {L.t.quiz.correct}</span>}
          </div>
        );
      })}
      <div style={{ margin: "20px 34px 0", ...txt(14, C.slate400), opacity: ans ? 1 : 0 }}>{L.t.quiz.explanation}<Src s={L.t.quiz.explanationSrc} /></div>
    </>
  );
};

const Flashcard: React.FC<{ t: number }> = ({ t }) => {
  const flip = prog(t, 0, 0.8);
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 18, backfaceVisibility: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, boxSizing: "border-box", textAlign: "center" };
  return (
    <>
      <Head Icon={Layers} title={L.t.flash.title} sub={L.t.flash.sub} />
      <div style={{ position: "absolute", left: 170, top: 130, width: 600, height: 380, perspective: 1400 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
          <div style={{ ...face, background: "linear-gradient(160deg, #1e293b, #0f172a)", border: `1px solid ${C.brand500}66` }}>
            <div style={{ ...txt(13, C.brand400, 600), letterSpacing: 1.4 }}>{L.t.flash.qLabel}</div>
            <div style={{ ...txt(28, "#f8fafc", 700), marginTop: 16 }}>{L.t.flash.question}</div>
          </div>
          <div style={{ ...face, transform: "rotateY(180deg)", background: `linear-gradient(160deg, rgba(79,70,229,.35), rgba(139,92,246,.2))`, border: `1px solid ${C.accent400}` }}>
            <div style={{ ...txt(13, C.accent400, 600), letterSpacing: 1.4 }}>{L.t.flash.aLabel}</div>
            <div style={{ ...txt(22, "#f8fafc", 600), marginTop: 16, lineHeight: 1.45 }}>{L.t.flash.answer}</div>
            <div style={{ ...txt(14, C.slate300), marginTop: 18 }}>{L.t.flash.hint}<Src s="p. 6" /></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 10 }}>
        {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ width: i === 2 ? 26 : 9, height: 9, borderRadius: 5, background: i === 2 ? C.brand500 : "#334155" }} />)}
      </div>
    </>
  );
};

const Summary: React.FC<{ t: number }> = ({ t }) => {
  const rows = L.t.summary.rows.map(([k, d], i) => [k, d, [0.82, 0.64, 0.74][i], ["#f87171", C.manager, C.emerald][i]] as const);
  return (
    <>
      <Head Icon={BarChart3} title={L.t.summary.title} sub={L.t.summary.sub} />
      {rows.map(([k, d, val, col], i) => {
        const a = prog(t, 0.4 + i * 0.5, 0.5);
        return (
          <div key={k} style={{ margin: "22px 34px 0", padding: "18px 20px", borderRadius: 12, background: "rgba(15,23,42,.6)", border: "1px solid #334155", opacity: a }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...txt(15, C.slate400, 600) }}><span style={{ color: col }}>{k}</span><span>{Math.round(val * a * 100)}%</span></div>
            <div style={{ ...txt(17, "#f1f5f9", 500), marginTop: 6 }}>{d}</div>
            <div style={{ marginTop: 12, height: 8, borderRadius: 4, background: "#1e293b" }}><div style={{ width: `${val * 100 * a}%`, height: "100%", borderRadius: 4, background: col }} /></div>
          </div>
        );
      })}
      <div style={{ margin: "22px 34px 0", display: "flex", gap: 10, flexWrap: "wrap", opacity: prog(t, 2.2, 0.5) }}>
        {L.t.summary.chips.map((c) => <span key={c} style={{ padding: "6px 12px", borderRadius: 99, background: "rgba(79,70,229,.15)", border: "1px solid rgba(99,102,241,.3)", ...txt(13, "#c7d2fe", 500) }}>{c}</span>)}
      </div>
    </>
  );
};

// Final fan: the source in the center and the four formats, each lit when named (voice 5B)
const OutroFan: React.FC<{ t: number; t0: number; p: number; hl: number[]; tPeople: number; tTitle: number; tEnd: number }> = ({ t, t0, p, hl, tPeople, tTitle, tEnd }) => {
  if (p <= 0) return null;
  const icons = [GraduationCap, HelpCircle, Layers, BarChart3];
  const verbs = L.t.fanVerbs;
  const src = { x: 1120, y: 520 };
  const pos = [[1480, 250], [1640, 450], [1640, 650], [1480, 850]];
  const on = hl.map((h, i) => prog(t, h, 0.35) * (i < 3 ? 1 - prog(t, hl[i + 1], 0.35) : 1 - prog(t, tEnd, 0.5)));
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><filter id="s5o"><feGaussianBlur stdDeviation="8" /></filter></defs>
        {pos.map(([x, y], i) => {
          const a = prog(t, t0 + i * 0.25, 0.6);
          return (
            <g key={i}>
              <line x1={src.x} y1={src.y} x2={src.x + (x - src.x) * a} y2={src.y + (y - src.y) * a} stroke={SPECTRUM[i]} strokeWidth={10 + on[i] * 14} opacity={0.6} filter="url(#s5o)" />
              <line x1={src.x} y1={src.y} x2={src.x + (x - src.x) * a} y2={src.y + (y - src.y) * a} stroke={SPECTRUM[i]} strokeWidth={2.5 + on[i] * 2} />
            </g>
          );
        })}
      </svg>
      <Doc x={src.x} y={src.y} w={110} glow={1} opacity={p} label={L.t.oneSource} />
      {pos.map(([x, y], i) => {
        const a = prog(t, t0 + 0.3 + i * 0.25, 0.5);
        const Icon = icons[i];
        const pp = prog(t, tPeople + i * 0.15, 0.5);
        return (
          <React.Fragment key={i}>
            <Glass rainbow={0.5 + on[i] * 0.5} tint={on[i] > 0.3 ? SPECTRUM[i] : undefined} style={{ left: x - 140, top: y - 36, width: 280, height: 72, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", boxSizing: "border-box", opacity: a, transform: `scale(${0.8 + 0.2 * a + on[i] * 0.1})` }}>
              <Icon size={24} color={SPECTRUM[i]} />
              <span style={txt(19, "#f8fafc", 600)}>{FORMATS[i]}</span>
            </Glass>
            <div style={{ position: "absolute", left: x - 130, top: y + 42, width: 260, textAlign: "center", opacity: on[i], ...txt(17, SPECTRUM[i], 600) }}>{verbs[i]}</div>
            <div style={{ position: "absolute", left: x + 150, top: y - 34, width: 60, height: 70, opacity: pp }}>
              <svg width={60} height={70} viewBox="0 0 60 70"><circle cx={30} cy={20} r={14} fill={SPECTRUM[i]} opacity={0.85} /><path d="M6 70 Q6 40 30 38 Q54 40 54 70Z" fill={SPECTRUM[i]} opacity={0.55} /></svg>
            </div>
          </React.Fragment>
        );
      })}
      <Title p={prog(t, tTitle, 0.7) * (1 - prog(t, tEnd - 0.3, 0.4))} y={70} size={58}>
        {L.t.fanTitle1}
      </Title>
      <Title p={prog(t, tEnd, 0.7)} y={70} size={58}>
        {L.t.fanTitle2}
      </Title>
    </>
  );
};
