// Visual replica of the NuevaMente frontend (newmind-learning-frontend):
// same tokens (slate-950, indigo brand, violet accent, Inter) and lucide icons.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  LayoutDashboard, PlusCircle, History, BookOpen, Cpu, ChevronRight, UploadCloud, Settings, File as FileIcon,
  CheckCircle2, LoaderCircle, User, FileText, Building2, Layers, Lightbulb, ArrowLeft, Link2, Clock, Sparkles,
} from "lucide-react";
import { C, INTER } from "../theme";
import { L } from "../locale";

export const WIN = { w: 1600, h: 900 };
export const SIDEBAR = 256;
export const COL = { x: 478, w: 900 }; // content column (centered max-w-3xl)
export const GRID = { top: 350, rowH: 96, colW: 434, boxW: 418, boxH: 80 };
export const NAV_NEW = { x: 128, y: 230 };
export const DROP = { x: 502, y: 275, w: 852, h: 140 };
export const SCROLL2 = 250;

export const STEPS = [
  { id: "profile", label: L.t.ui.steps[0], Icon: User },
  { id: "format", label: L.t.ui.steps[1], Icon: FileText },
  { id: "industry", label: L.t.ui.steps[2], Icon: Building2 },
  { id: "detail", label: L.t.ui.steps[3], Icon: Layers },
];

export const OPTIONS = L.t.ui.options;

export const optionCenter = (k: number, scroll = SCROLL2) => ({
  x: COL.x + 24 + (k % 2) * GRID.colW + GRID.boxW / 2,
  y: GRID.top + Math.floor(k / 2) * GRID.rowH + GRID.boxH / 2 - (SCROLL2 - scroll),
});
export const NEXT_BTN = { x: COL.x + COL.w - 110, y: 690 };

const card: React.CSSProperties = { position: "absolute", left: COL.x, width: COL.w, background: "rgba(30,41,59,.6)", border: "1px solid rgba(51,65,85,.5)", borderRadius: 14 };
const txt = (size: number, color: string, weight = 400): React.CSSProperties => ({ fontFamily: INTER, fontSize: size, color, fontWeight: weight });

const Spin: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const f = useCurrentFrame();
  return <LoaderCircle size={size} color={color} style={{ transform: `rotate(${f * 12}deg)` }} />;
};

// ── Window + sidebar ──────────────────────────────────────────────────

export const AppWindow: React.FC<{ url: string; active: "dashboard" | "new" | "history"; children: React.ReactNode }> = ({ url, active, children }) => (
  <div style={{ position: "absolute", width: WIN.w, height: WIN.h, borderRadius: 18, overflow: "hidden", background: C.bg, border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 50px 140px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04), 0 0 120px rgba(99,102,241,.18)" }}>
    <div style={{ height: 44, background: "rgba(15,23,42,.95)", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", padding: "0 18px", gap: 8 }}>
      {["#f87171", "#fbbf24", "#34d399"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.8 }} />)}
      <div style={{ marginLeft: 24, height: 28, flex: 0.5, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", padding: "0 14px", ...txt(14, C.slate400) }}>{url}</div>
    </div>
    <div style={{ position: "absolute", top: 44, left: 0, bottom: 0, width: SIDEBAR, background: C.slate900, borderRight: "1px solid #1e293b" }}>
      <div style={{ height: 76, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 12, padding: "0 20px" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.brand500}, ${C.accent500})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cpu size={16} color="#fff" />
        </div>
        <div>
          <div style={txt(16, "#f8fafc", 700)}>NuevaMente</div>
          <div style={txt(10, C.slate500)}>{L.t.ui.program}</div>
        </div>
      </div>
      <div style={{ padding: "16px 12px" }}>
        <div style={{ ...txt(10, "#475569", 600), letterSpacing: 1.2, padding: "0 8px 8px" }}>{L.t.ui.menu}</div>
        {[["dashboard", LayoutDashboard, "Dashboard"], ["new", PlusCircle, L.t.ui.navNew], ["history", History, L.t.ui.navHistory]].map(([id, Icon, label]: any) => {
          const on = id === active;
          return (
            <div key={id} style={{ height: 44, marginBottom: 4, borderRadius: 8, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", background: on ? "rgba(79,70,229,.2)" : "transparent", border: on ? "1px solid rgba(79,70,229,.3)" : "1px solid transparent", ...txt(14, on ? "#a5b4fc" : C.slate400, 500) }}>
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {on && <ChevronRight size={12} style={{ opacity: 0.6 }} />}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px", borderTop: "1px solid #1e293b", display: "flex", gap: 8, alignItems: "center", ...txt(12, C.slate500) }}>
        <BookOpen size={16} /> {L.t.ui.footer}
      </div>
    </div>
    <div style={{ position: "absolute", top: 44, left: SIDEBAR, right: 0, bottom: 0, overflow: "hidden" }}>{children}</div>
  </div>
);

// Children of main are positioned in window coordinates
export const Main: React.FC<{ children: React.ReactNode; scroll?: number }> = ({ children, scroll = 0 }) => (
  <div style={{ position: "absolute", left: -SIDEBAR, top: -44 - scroll, width: WIN.w, height: 2000 }}>{children}</div>
);

// ── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => (
  <Main>
    <div style={{ position: "absolute", left: COL.x - 100, top: 90, ...txt(30, "#f8fafc", 700) }}>Dashboard</div>
    <div style={{ position: "absolute", left: COL.x - 100, top: 134, ...txt(16, C.slate400) }}>{L.t.ui.dashSub}</div>
    {L.t.ui.stats.map(([l, n], i) => (
      <div key={l} style={{ ...card, left: COL.x - 100 + i * 370, width: 350, top: 190, height: 120, padding: 24 }}>
        <div style={txt(14, C.slate400)}>{l}</div>
        <div style={{ ...txt(40, "#f8fafc", 700), marginTop: 6 }}>{n}</div>
      </div>
    ))}
    <div style={{ ...card, left: COL.x - 100, width: 1090, top: 340, height: 420, padding: 24 }}>
      <div style={txt(18, C.slate200, 600)}>{L.t.ui.recent}</div>
      {L.t.ui.recentRows.map((r, i) => (
        <div key={r} style={{ marginTop: 16, height: 62, borderRadius: 10, background: "#1e293b", border: "1px solid #334155", display: "flex", alignItems: "center", gap: 14, padding: "0 18px", ...txt(15, C.slate300) }}>
          <FileIcon size={18} color={C.brand400} /> {r}
          <span style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 99, background: "rgba(52,211,153,.15)", ...txt(12, C.emerald, 600) }}>{L.t.ui.completed}</span>
        </div>
      ))}
    </div>
  </Main>
);

// ── New adaptation ─────────────────────────────────────────────────────────

const StepHeader: React.FC<{ n: number; Icon: any; title: string; sub: string; active: boolean; top: number }> = ({ n, Icon, title, sub, active, top }) => (
  <div style={{ position: "absolute", left: COL.x + 24, top, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${active ? "rgba(79,70,229,.3)" : "#334155"}`, background: active ? "rgba(79,70,229,.2)" : "#1e293b", ...txt(14, active ? C.brand400 : "#475569", 700) }}>{n}</div>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, ...txt(16, "#f1f5f9", 600) }}><Icon size={16} /> {title}</div>
      <div style={txt(12, C.slate300)}>{sub}</div>
    </div>
  </div>
);

export type NewState = {
  scroll: number;
  dragging: boolean;
  uploading: boolean;
  uploaded: boolean;
  step: number; // 0..3
  selected: Record<string, string>;
  hover: number; // index of the hovered option (-1 = none)
  generating: number; // 0..1 generation progress (-1 = not generating)
};

export const NewAdaptation: React.FC<{ s: NewState }> = ({ s }) => {
  const stepId = STEPS[s.step].id;
  const opts = OPTIONS[stepId];
  return (
    <Main scroll={s.scroll}>
      <div style={{ position: "absolute", left: COL.x, top: 66, display: "flex", gap: 6, alignItems: "center", ...txt(14, C.slate400) }}><ArrowLeft size={16} /> {L.t.ui.back}</div>
      <div style={{ position: "absolute", left: COL.x, top: 104, ...txt(30, "#f8fafc", 700) }}>{L.t.ui.newTitle}</div>
      <div style={{ position: "absolute", left: COL.x, top: 148, ...txt(16, C.slate400) }}>{L.t.ui.newSub}</div>

      {/* Step 1 */}
      <div style={{ ...card, top: 195, height: 250 }} />
      <StepHeader n={1} Icon={UploadCloud} title={L.t.ui.uploadTitle} sub={L.t.ui.uploadSub} active top={215} />
      {!s.uploaded ? (
        <div style={{ position: "absolute", left: DROP.x, top: DROP.y, width: DROP.w, height: DROP.h, borderRadius: 12, border: `2px dashed ${s.dragging ? C.brand500 : "#475569"}`, background: s.dragging ? "rgba(79,70,229,.10)" : "rgba(30,41,59,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {s.uploading ? <Spin size={40} color={C.brand400} /> : <UploadCloud size={40} color={s.dragging ? C.brand400 : C.slate500} />}
          <div style={txt(14, C.slate300, 500)}>{s.uploading ? L.t.ui.uploading : s.dragging ? L.t.ui.drop : L.t.ui.drag}</div>
          <div style={txt(12, C.slate500)}>{L.t.ui.fileTypes}</div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: DROP.x, top: DROP.y, width: DROP.w, height: 76, borderRadius: 12, border: "2px dashed rgba(52,211,153,.5)", background: "rgba(52,211,153,.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <CheckCircle2 size={34} color={C.emerald} />
            <span style={txt(15, C.slate200, 500)}>{L.t.ui.uploaded}</span>
          </div>
          <div style={{ position: "absolute", left: DROP.x, top: DROP.y + 92, display: "flex", gap: 8, alignItems: "center", ...txt(14, C.emerald) }}>
            <CheckCircle2 size={16} /> <b>{L.t.fileName}</b>&nbsp;{L.t.ui.ready}
          </div>
        </>
      )}

      {/* Step 2 */}
      <div style={{ ...card, top: 470, height: 540 }} />
      <StepHeader n={2} Icon={Settings} title={L.t.ui.configTitle} sub={L.t.ui.configSub} active={s.uploaded} top={490} />
      {!s.uploaded ? (
        <div style={{ position: "absolute", left: COL.x, width: COL.w, top: 560, textAlign: "center", ...txt(14, C.slate400) }}>{L.t.ui.uploadFirst}</div>
      ) : s.generating >= 0 ? (
        <Generating p={s.generating} />
      ) : (
        <>
          {/* step indicator */}
          <div style={{ position: "absolute", left: COL.x + 24, top: 548, display: "flex", gap: 8, alignItems: "center" }}>
            {STEPS.map((st, i) => {
              const on = i === s.step, done = i < s.step;
              return (
                <React.Fragment key={st.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, background: on ? C.brand600 : done ? "rgba(5,150,105,.2)" : "#1e293b", ...txt(12, on ? "#fff" : done ? C.emerald : C.slate500, 500) }}>
                    <st.Icon size={14} /> {st.label}
                  </div>
                  {i < STEPS.length - 1 && <ChevronRight size={12} color="#475569" />}
                </React.Fragment>
              );
            })}
          </div>
          {opts.map(([name, desc], k) => {
            const c = optionCenter(k, SCROLL2);
            const sel = s.selected[stepId] === name;
            const hov = s.hover === k;
            return (
              <div key={name} style={{ position: "absolute", left: c.x - GRID.boxW / 2, top: c.y - GRID.boxH / 2 + SCROLL2, width: GRID.boxW, height: GRID.boxH, borderRadius: 12, padding: "14px 16px", boxSizing: "border-box", border: `1px solid ${sel ? C.brand500 : hov ? C.brand400 : "#334155"}`, background: sel ? "rgba(79,70,229,.18)" : hov ? "rgba(79,70,229,.08)" : "rgba(30,41,59,.5)", boxShadow: hov || sel ? `0 0 24px rgba(99,102,241,${sel ? 0.35 : 0.2})` : "none", transform: `scale(${hov ? 1.02 : 1})` }}>
                <div style={txt(15, "#f1f5f9", 600)}>{name}</div>
                <div style={{ ...txt(12.5, C.slate400), marginTop: 4 }}>{desc}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: NEXT_BTN.x - 95, top: NEXT_BTN.y - 20 + SCROLL2, width: 190, height: 40, borderRadius: 8, background: C.brand600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...txt(14, "#fff", 500) }}>
            {s.step === 3 ? <><Sparkles size={16} /> {L.t.ui.generate}</> : <>{L.t.ui.next} <ChevronRight size={14} /></>}
          </div>
          <div style={{ position: "absolute", left: COL.x + 24, top: NEXT_BTN.y - 20 + SCROLL2, height: 40, display: "flex", alignItems: "center", gap: 8, ...txt(13, C.slate500) }}>
            <Lightbulb size={16} color={C.brand400} /> {L.t.ui.stepOf(s.step + 1)}
          </div>
        </>
      )}
    </Main>
  );
};

const Generating: React.FC<{ p: number }> = ({ p }) => {
  const lines = L.t.ui.genLines;
  return (
    <div style={{ position: "absolute", left: COL.x + 24, top: 560, width: COL.w - 48, borderRadius: 12, border: "1px solid rgba(79,70,229,.3)", background: "rgba(79,70,229,.10)", padding: 22, boxSizing: "border-box" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Spin size={22} color={C.brand400} />
        <div style={txt(16, C.slate200, 600)}>{L.t.ui.genTitle}</div>
      </div>
      <div style={{ marginTop: 18, height: 8, borderRadius: 4, background: "#1e293b", overflow: "hidden" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.brand500}, ${C.accent400}, ${C.mente2})` }} />
      </div>
      {lines.map((l, i) => {
        const done = p > (i + 1) / 3.2;
        const on = p > i / 3.2;
        return (
          <div key={l} style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", opacity: on ? 1 : 0.3, ...txt(14, done ? C.emerald : C.slate300) }}>
            {done ? <CheckCircle2 size={16} /> : <Spin size={16} color={C.slate400} />} {l}
          </div>
        );
      })}
    </div>
  );
};

// ── Result ────────────────────────────────────────────────────────────────

export const FORMATS = L.t.ui.formats;
export const TAB = (i: number) => ({ x: 640 + i * 200 + 90, y: 150 });

export const Result: React.FC<{ tab: number; children: React.ReactNode; anchor: number; glow?: number }> = ({ tab, children, anchor, glow = 0 }) => {
  const f = useCurrentFrame();
  return (
    <Main>
      <div style={{ position: "absolute", left: 290, top: 66, display: "flex", gap: 6, alignItems: "center", ...txt(14, C.slate400) }}><ArrowLeft size={16} /> {L.t.ui.resultBack}</div>
      {/* source panel: always pinned */}
      <div style={{ ...card, left: 290, width: 300, top: 120, height: 740, padding: 22, boxSizing: "border-box", borderColor: glow > 0.05 ? `rgba(250,204,21,${0.3 + 0.5 * glow})` : undefined, boxShadow: `0 0 ${50 * glow}px rgba(250,204,21,${0.35 * glow})` }}>
        <div style={{ ...txt(11, C.slate500, 600), letterSpacing: 1.4 }}>{L.t.ui.source}</div>
        <div style={{ marginTop: 18, height: 200, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={100} height={130} viewBox="0 0 100 130"><path d="M6 0 H74 L100 26 V124 Q100 130 94 130 H6 Q0 130 0 124 V6 Q0 0 6 0Z" fill="#e2e8f0" /><path d="M74 0 V26 H100Z" fill="#94a3b8" />{[40, 54, 68, 82, 96].map((y, i) => <rect key={y} x={16} y={y} width={i % 2 ? 50 : 68} height={4} rx={2} fill="#64748b" />)}</svg>
        </div>
        <div style={{ marginTop: 16, ...txt(15, "#f1f5f9", 600) }}>{L.t.fileName}</div>
        <div style={{ marginTop: 4, ...txt(13, C.slate400) }}>{L.t.ui.pages}</div>
        <div style={{ marginTop: 26, ...txt(12, C.slate400) }}>{L.t.ui.grounding}</div>
        <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: "#1e293b" }}>
          <div style={{ width: `${anchor * 92}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.manager}, ${C.yellow})` }} />
        </div>
        <div style={{ marginTop: 6, ...txt(22, C.yellow, 700) }}>{(anchor * 0.92).toFixed(2)}</div>
        <div style={{ marginTop: 22, display: "flex", gap: 8, alignItems: "center", ...txt(13, C.slate300) }}><Link2 size={16} color={C.yellow} /> {L.t.ui.cites}</div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", ...txt(13, C.slate300) }}><User size={16} color={C.brand400} /> {L.t.ui.profileLine}</div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", ...txt(13, C.slate300) }}><Clock size={16} color={C.brand400} /> {L.t.ui.study}</div>
      </div>
      {/* golden link: source → content */}
      <svg width={1600} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={590} y1={300} x2={620} y2={300} stroke={C.yellow} strokeWidth={3} strokeDasharray="6 6" strokeDashoffset={-f} />
      </svg>
      {/* format tabs */}
      {FORMATS.map((fm, i) => (
        <div key={fm} style={{ position: "absolute", left: TAB(i).x - 90, top: 130, width: 180, height: 40, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: i === tab ? C.brand600 : "#1e293b", border: `1px solid ${i === tab ? C.brand500 : "#334155"}`, ...txt(14, i === tab ? "#fff" : C.slate400, 500) }}>{fm}</div>
      ))}
      <div style={{ ...card, left: 620, width: 940, top: 190, height: 670, overflow: "hidden" }}>{children}</div>
    </Main>
  );
};
