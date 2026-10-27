import React from "react";
import { Grad, RainbowText } from "../fx";
import { C } from "../theme";
import type { Cue } from "../sync";
import words from "./en/words.json";
import voices from "./en/voices.json";
import scenes from "./en/scenes.json";

// English locale. Every on-screen string, every sync cue (a word in the voice-over that
// triggers an animation) and every per-language timing decision lives here.
export type SceneDef = { id: string; voice: string; pre: number; tail: number; extra?: { voice: string; gap: number } };

export const en = {
  id: "en" as "en" | "es",
  words: words as unknown as Record<string, [string, number, number][]>,
  voices: voices as Record<string, number>,

  // Playback order and pauses (s) around each voice-over (scenes.json). In the English pitch
  // the solution (s4) comes before the technical explanation (s3).
  scenes: scenes as SceneDef[],

  heroName: "Martin",
  countryName: { "Perú": "Peru", Ecuador: "Ecuador", Colombia: "Colombia", Venezuela: "Venezuela", "México": "Mexico" } as Record<string, string>,
  // s7: the English D7 talks about "hours figuring out where to begin"; the Spanish one about "more than one person"
  s7Variant: "hours" as "hours" | "beyond",
  // seconds after "This is NuevaMente" before the logo moves up and the credits roll in
  creditsDelay: 4.2,

  cue: {
    s1Name: "Martin", s1Badge: "security", s1Docs: "manuals", s1Noise: "But", s1Title: "doesn't",
    s2Doc: "same", s2People: "people", s2Same: "knowledge", s2Why: "should",
    s2Roles: ["analyst", "engineer", "manager"],
    s3Steps: ["documentation", "processes", "retrieval", "profile", "structured"], s3Exp: "experience", s3End: ["source", 2],
    s4Doc: "Give", s4Trans: "transforms", s4Adapt: "profile", s4Same: "knowledge", s4Change: "changes",
    s5Nav: "start", s5Hover: ["tutorial", "quiz", "flashcards", "summary"], s5Pick: ["quiz", 1], s5Ans: "feedback", s5Flash: "switch",
    s5Flip: "concepts", s5Sum: ["choose", 1], s5Know: "knowledge", s5Cycle: "Different", s5Source: ["source", 2],
    s5bHl: ["tutorial", "quiz", "flashcards", "summary"], s5bPeople: "person", s5bTitle: "source", s5bEnd: ["Different", 1],
    s6IA: "intelligence", s6Ref: "reference", s6Team: "team", s6One: "Different", s6VisionEnd: ["vision", 2],
    s7Conv: "turns", s7Meta: "goal", s7Beat: "hours", s7Any: "anyone", s7Link: "connected",
    s8This: "This",
  } as Record<string, Cue | Cue[]>,

  t: {
    fileName: "IAM_Security_Manual.pdf",
    // s1
    s1Docs: ["IAM Manual", "Procedures", "Policies", "Architecture", "Runbooks", "Regulations"],
    s1Badge: "Information Security",
    s1Title: <>Having the information <Grad>≠</Grad> being able to learn it</>,
    // s2
    s2Roles: [
      { name: "Junior Analyst", need: "Understand the fundamentals and build context." },
      { name: "Security Engineer", need: "Procedures, architecture and implementation details." },
      { name: "Security Manager", need: "Identify risks, priorities and business impact." },
    ],
    s2Need: "Need:",
    s2Same: <>Same knowledge.<br /><Grad>Different need.</Grad></>,
    s2Why: <>Why should everyone learn it<br /><RainbowText>the same way?</RainbowText></>,
    // s3
    s3Json: ["{", '  "title": "IAM in the cloud",', '  "profile": "Junior",', '  "format": "Tutorial",', '  "items": [ … ],', '  "source": "iam_manual.pdf"', "}"],
    s3Labels: ["Original documentation", "Processing", "Retrieval (RAG)", "Profile · Level · Format", "Structured output"],
    s3Chips: ["Profile", "Level", "Format"],
    s3Title: <>Adapting <Grad>never means</Grad> losing the source</>,
    s3End: <>From source to learning, <RainbowText>without losing context</RainbowText></>,
    // s4
    s4Tags: ["Profile", "Level", "Learning needs"],
    s4Orig: "Original documentation",
    s4Exp: "Learning experience",
    s4Title1: "The source stays, ",
    s4Title2: "the experience changes",
    // s5 · demo
    s5Title: <>Now, <Grad>let's see it in action</Grad></>,
    detailSelected: "Didactic",
    tutorial: {
      title: "IAM in the cloud: a step-by-step guide", sub: "Tutorial · Junior profile · Didactic",
      intro: "If you just joined the team, this walkthrough gives you the context to understand who can access what in the cloud.",
      steps: [["Identities", "Users, groups and services that access resources.", "p. 3"], ["Policies", "Rules that define which action is allowed, and on what.", "p. 6"], ["Least privilege", "Grant only the permissions the task needs.", "p. 9"], ["Auditing", "Review access regularly and log every change.", "p. 14"]],
    },
    quiz: {
      title: "Assessment · Question 2 of 8", sub: "Quiz · Junior profile",
      question: "Which principle limits an identity's permissions to strictly what is necessary?",
      options: ["Defense in depth", "Least privilege", "Network segmentation", "Encryption in transit"],
      correct: "Correct", explanation: "Explanation: the manual defines it as the basis of every IAM policy.", explanationSrc: "section 2.1 · p. 9",
    },
    flash: {
      title: "Review · Card 3 of 12", sub: "Flashcards · Junior profile",
      qLabel: "QUESTION", question: "What is an IAM policy?",
      aLabel: "ANSWER", answer: "A document that defines which actions an identity can perform, and on which resources.",
      hint: 'Hint: think "who · what · where".',
    },
    summary: {
      title: "Executive summary · IAM Security", sub: "Executive Summary · Junior profile",
      rows: [["Risk", "Excessive permissions on service accounts"], ["Priority", "Quarterly review of privileged access"], ["Impact", "Smaller attack surface and fewer audit findings"]],
      chips: ["IAM", "Least privilege", "Auditing", "Service accounts"],
    },
    fanVerbs: ["to understand", "to test", "to remember", "what matters most"],
    oneSource: "One source",
    fanTitle1: <>One source. <RainbowText>Many ways to learn.</RainbowText></>,
    fanTitle2: <>Different ways to learn. <RainbowText>One source of truth.</RainbowText></>,
    // s6
    appliedAI: "Applied AI",
    pillars: [["Learn", "learn"], ["Manage knowledge", "manage"], ["Build capabilities", "build"]],
    // [label, voice-over cue, discipline id matched against TEAM tags]
    disciplines: [["Product", "product", "product"], ["Architecture", "architecture", "architecture"], ["Backend", "back", "back"], ["Frontend", "front", "front"], ["Full-stack", "full", "full"], ["DevOps", "devops", "devops"], ["PMO", "pmo", "pmo"], ["Project management", "project", "project"]],
    refTitle: <>A Latin American reference <Grad from={C.mente2} to={C.accent400}>with global reach</Grad></>,
    refSub: "in AI-powered learning and organizational knowledge",
    teamTitle: <>A <Grad from={C.mente2} to={C.accent400}>multinational</Grad> team</>,
    oneTeam: <>One team. <RainbowText>One shared vision.</RainbowText></>,
    // s7
    manual: "Technical manual",
    goalTitle: <>Our goal is <Grad>simple</Grad></>,
    goalHours: "Hours figuring out where to begin",
    linked: "Always connected to the original source",
    // s8
    tagline: "The source stays, the experience changes.",
    creditsTeam: "G10-LATAM · TEAM 1",
    creditsLabel: "AUDIOVISUAL CREDITS",
    creditsRole: "Creative Direction & Audiovisual Production",
    creditsDate: "October 2026",
    // program UI replica
    ui: {
      steps: ["Profile", "Format", "Niche", "Detail"],
      options: {
        profile: [["Beginner", "No prior experience with the topic"], ["Junior", "Knows the basics, building context"], ["Senior", "Solid hands-on experience"], ["Lead", "Decides and coordinates teams"], ["Manager", "Risks, priorities and impact"]],
        format: [["Flashcards", "Active review material"], ["Tutorial", "Guided step by step"], ["Quiz", "Comprehension check"], ["Executive Summary", "Structured synthesis"], ["Script", "Narrative to present"]],
        industry: [["Fintech", "Financial services"], ["Healthcare", "Health sector"], ["E-commerce", "Digital commerce"], ["General", "No specific niche"]],
        detail: [["Basic", "The essentials"], ["Intermediate", "Concepts with examples"], ["Didactic", "Explained for learning"], ["Detailed", "Maximum depth"]],
      } as Record<string, [string, string][]>,
      program: "ONE Program · G10", menu: "MENU", navNew: "New Adaptation", navHistory: "History", footer: "EdTech System · RAG + LangGraph",
      dashSub: "Technical documents turned into learning experiences.",
      stats: [["Documents", "12"], ["Adaptations", "34"], ["Formats", "5"]],
      recent: "Recent adaptations",
      recentRows: ["Microservices architecture · Tutorial · Senior", "VCN networking on OCI · Quiz · Junior", "Cloud IAM security · Executive Summary · Manager", "Cloud operations · Flashcards · Beginner"],
      completed: "Completed",
      back: "Back to dashboard", newTitle: "New Adaptation", newSub: "Upload your document and configure the learning adaptation.",
      uploadTitle: "Upload document", uploadSub: "PDF, Markdown or TXT · max. 20 MB",
      uploading: "Uploading your document…", drop: "Drop the file here", drag: "Drag or click to upload", fileTypes: "PDF, Markdown or TXT · Max. 20 MB",
      uploaded: "File uploaded successfully!", ready: "is ready to process. You can now configure your resource.",
      configTitle: "Configure adaptation", configSub: "Profile, format, niche and level of detail", uploadFirst: "Upload a document first to enable this step.",
      generate: "Generate adaptation", next: "Next", stepOf: (n: number) => `Step ${n} of 4`,
      genLines: ["Retrieving relevant context from the document", "Adapting to Junior profile · Didactic", "Validating grounding against the source"],
      genTitle: "Preparing your resource · Generating content...",
      formats: ["Tutorial", "Quiz", "Flashcards", "Executive Summary"],
      resultBack: "New adaptation", source: "ORIGINAL SOURCE", pages: "24 pages · 1.8 MB", grounding: "Source grounding",
      cites: "Every section cites its origin", profileLine: "Profile: Junior · Didactic", study: "≈ 12 min of study",
    },
  },
};

export type Locale = typeof en;
