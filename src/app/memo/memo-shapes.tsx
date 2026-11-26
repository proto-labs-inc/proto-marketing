"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { getHomeShapePaletteColor } from "@/components/marketing/shape-colors-content";
import { HOME_PAGE_SHAPES_CONFIG, HomePageShapesBackground } from "@/components/marketing/home-page-shapes-background";
import { MarketingRoot } from "@/components/marketing/marketing-root";
import { PrototypeComponent } from "@/components/marketing/prototype-target";
import { ThemePicker } from "@/components/marketing/theme-picker";
import { inviteBodyLineHighlightClass, inviteLineHighlightClass } from "@/components/marketing/invite-layout-classes";
import buttonStyles from "@/components/marketing/early-access-header.module.css";
import { memoSections } from "./memo-story-copy";
import { isMemoDemoState, type MemoDemoState } from "@/lib/memo-demo";
import { useHostedFrameTools } from "@/lib/use-hosted-frame-tools";

import "../(marketing)/marketing.css";
import "./memo.css";

const MEMO_EMAIL_STORAGE_KEY = "proto:memo:email";
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function postMemoFrame(message: { type: string; state?: MemoDemoState; selector?: string | null; anchor?: { x: number; y: number; width: number; height: number } | null }, frameOrigin: string | null) {
  if (window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
  if (frameOrigin) {
    const trustedOrigin = new URL(frameOrigin).origin;
    if (trustedOrigin !== window.location.origin) window.parent.postMessage(message, trustedOrigin);
  }
}
const memoSubmitStyle = {
  "--early-access-accent": `rgb(${getHomeShapePaletteColor("pink", "electric-pop", { value: 1.1, saturation: 1.19 }).join(" ")})`,
  "--early-access-note-gold": `rgb(${getHomeShapePaletteColor("gold", "electric-pop").join(" ")})`,
} as CSSProperties;

async function recordMemoView(email: string): Promise<void> {
  const response = await fetch("/api/memo/views", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Could not save memo view");
}
const MEMO_GATE_SHAPES_CONFIG = {
  ...HOME_PAGE_SHAPES_CONFIG,
  shapeEntranceDelay: 0.5,
  sharedPopYFactor: 0.38,
};

function MemoEmailGate({ onUnlock, demoState }: { onUnlock: () => void; demoState: MemoDemoState | null }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (submitting) return;
    if (!VALID_EMAIL.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await recordMemoView(trimmedEmail);
    } catch {
      setError("Could not open the memo. Please try again.");
      setSubmitting(false);
      return;
    }
    try {
      window.localStorage.setItem(MEMO_EMAIL_STORAGE_KEY, trimmedEmail);
    } catch {
      // Browsers with blocked storage can still read the memo this visit.
    }
    onUnlock();
  }

  const loading = submitting || demoState === "email-loading";
  const visibleError = demoState === "email-error" ? "Could not open the memo. Please try again." : error;
  return <main className="memo-email-gate" data-proto-comment-id="email-gate" aria-labelledby="memo-email-heading">
    <HomePageShapesBackground
      className="absolute inset-0 z-10 hidden overflow-hidden bg-transparent md:block"
      config={MEMO_GATE_SHAPES_CONFIG}
      colorScheme="electric-pop"
      colorAdjust={{ value: 1.1, saturation: 1.19 }}
      drawAlphaRange={{ lower: 0.85, upper: 1 }}
      strokeStyle={{ dotSize: 1.15, borderThickness: 1.24, dotBorderThickness: 1.56, whiteBorders: false }}
      textureFillStyle={{ plainFillOpacity: 0.4, gradientFadeOpacity: 0.58 }}
      ariaLabel="Interactive shapes around the memo email form"
    />
    <form className="memo-email-form" data-proto-comment-id="email-form" onSubmit={submit} noValidate style={memoSubmitStyle}>
      <p className="memo-email-intro" id="memo-email-heading"><span className={inviteLineHighlightClass}>Enter email to view memo</span></p>
      <label className="sr-only" htmlFor="memo-email">Email address</label>
      <div className="memo-email-row">
        <input
          className="memo-email-input"
          id="memo-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          enterKeyHint="go"
          placeholder="Email address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          disabled={loading}
          aria-invalid={Boolean(visibleError)}
          aria-describedby={visibleError ? "memo-email-error" : undefined}
          required
        />
        <button className={`${buttonStyles.button} memo-email-submit`} data-proto-comment-id="email-submit" type="submit" disabled={loading} aria-label={loading ? "Opening memo" : "Open memo"}>
          {loading ? <svg aria-hidden="true" className="animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" opacity="0.25" />
            <path d="M12 3a9 9 0 0 1 9 9" />
          </svg> : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h15m-6-6 6 6-6 6" />
          </svg>}
        </button>
      </div>
      {loading && <p className="sr-only" role="status">Opening memo…</p>}
      {visibleError && <p id="memo-email-error" className="memo-email-status" data-proto-comment-id="email-error" role="alert">{visibleError}</p>}
    </form>
  </main>;
}

function MemoHeaderSlot() {
  return <header data-proto-comment-id="memo-header" className="mb-[1.55rem] flex flex-col items-start gap-2 pt-4 text-left md:mb-[1.9rem] md:gap-3 md:pt-5">
    <h1 className="pointer-events-auto m-0 text-[1.625rem] leading-[1.15] font-[760] tracking-[-0.04em] text-[var(--foreground)] md:text-[1.75rem]"><span className={inviteLineHighlightClass}>Proto</span></h1>
    <p className="pointer-events-auto m-0 text-[1.25rem] leading-[1.25] font-[750] tracking-[-0.025em] text-[var(--foreground)]"><span className={inviteLineHighlightClass}>The coding agent for <span className="max-md:whitespace-nowrap">product design</span></span></p>
  </header>;
}

function MemoFounderBioSlot({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={className}>{children}</span>;
}

function MemoBodySlot() {
  return <div className="flex flex-col gap-[1.55rem] text-left md:gap-[1.9rem]">
    {memoSections.map(({ id: sectionId, label, paragraphs }) => {
      const id = `proto-story-${sectionId}`;
      const heading = label === "Current state" ? "Current State" : label === "Founder & backing" ? "Founder & Backing" : label;
      return <section className="flex flex-col gap-[.38rem]" data-proto-comment-id={id} key={label} aria-labelledby={id}>
        <h2 id={id} className="m-0 text-[1.125rem] leading-[1.25] font-[750] tracking-[-0.025em] text-[var(--foreground)]"><span className={`pointer-events-auto select-text ${inviteLineHighlightClass}`}>{heading}</span></h2>
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph, index) => <p key={index} className="m-0 text-[1rem] leading-[1.65] text-[var(--foreground)] md:text-[.9375rem]">{sectionId === "founder-backing" ? <MemoFounderBioSlot className={`pointer-events-auto select-text ${inviteBodyLineHighlightClass}`}>{paragraph}</MemoFounderBioSlot> : <span className={`pointer-events-auto select-text ${inviteBodyLineHighlightClass}`}>{paragraph}</span>}</p>)}
        </div>
      </section>;
    })}
  </div>;
}

function MemoAnnouncementVideo() {
  const posterImage = "/videos/early-access-announcement-poster-frame-0427.png";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function startPlayback() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => setStarted(false));
  }

  return <div className="memo-announcement-video pointer-events-auto mb-8 md:mb-10">
    <svg width="0" height="0" aria-hidden="true" className="absolute pointer-events-none">
      <defs>
        <filter id="memo-video-terminal" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  .2126 .7152 .0722 0 0  .0542 .1823 .0184 0 0  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
    <div className="pointer-events-auto relative overflow-hidden rounded-xl bg-[#dc1879] shadow-[0_12px_40px_rgba(0,0,0,0.12)] md:rounded-[29px] md:[corner-shape:squircle]">
      <video
        ref={videoRef}
        aria-label="Proto early access announcement"
        className="block aspect-video w-full object-cover"
        controls={started}
        playsInline
        poster={posterImage}
        preload="metadata"
        onPlaying={() => setStarted(true)}
        onEnded={() => {
          setStarted(false);
          if (videoRef.current) videoRef.current.currentTime = 0;
        }}
      >
        <source src="/videos/proto-launch.mp4" type="video/mp4" />
        Your browser does not support video playback.
      </video>
      {!started && <>
        <img className="pointer-events-none absolute inset-0 h-full w-full object-cover" src={posterImage} alt="" aria-hidden="true" />
        <button
          type="button"
          aria-label="Play the Proto early access announcement"
          className="group absolute inset-0 flex w-full cursor-pointer items-center justify-center max-md:rounded-[inherit] border-0 bg-transparent focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          onClick={startPlayback}
        >
          <span className="flex size-[4.5rem] items-center justify-center rounded-full border border-white/80 bg-[rgb(255_255_255_/_0.94)] text-[#111] shadow-[0_12px_32px_rgba(38,9,26,0.22)] transition-[transform,box-shadow] duration-[180ms] group-hover:scale-[1.08] group-hover:shadow-[0_15px_36px_rgba(38,9,26,0.3)] group-focus-visible:scale-[1.08] group-focus-visible:shadow-[0_15px_36px_rgba(38,9,26,0.3)] motion-reduce:transition-none md:size-20">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 size-7 fill-current"><path d="M7 4.8a1 1 0 0 1 1.52-.85l11 7.2a1 1 0 0 1 0 1.7l-11 7.2A1 1 0 0 1 7 19.2V4.8Z" /></svg>
          </span>
        </button>
      </>}
    </div>
  </div>;
}

function MemoStorySlot() {
  const pink = `rgb(${getHomeShapePaletteColor("pink", "electric-pop", { value: 1.1, saturation: 1.19 }).join(" ")})`;
  return <PrototypeComponent id="memo-story" className="memo-story-position relative z-20 px-3 py-20 font-[family-name:var(--font-dm-sans)]! md:px-8">
    <div className="mx-auto w-full max-w-none px-0 md:max-w-2xl md:px-10" style={{ "--early-access-pink": pink } as CSSProperties}>
      <div data-proto-comment-id="memo-video" className="pointer-events-auto">
        <MemoAnnouncementVideo />
      </div>
      <MemoHeaderSlot />
      <MemoBodySlot />
    </div>
  </PrototypeComponent>;
}

function MemoTransitionScene({
  showMemo,
  showGate,
  demoFrame,
  demoState,
  onUnlock,
}: {
  showMemo: boolean;
  showGate: boolean;
  demoFrame: boolean;
  demoState: MemoDemoState | null;
  onUnlock: () => void;
}) {
  return <div className="memo-transition-scene">
    {showGate && <div className="memo-transition-gate">
      <MemoEmailGate demoState={demoState} onUnlock={onUnlock} />
    </div>}
    {(demoFrame || showMemo) && <div className="memo-transition-memo" hidden={!showMemo}>
      <MemoStorySlot />
      <footer aria-hidden="true" className="relative" />
    </div>}
  </div>;
}

export function MemoShapes({ frameOrigin }: { frameOrigin: string | null }) {
  useHostedFrameTools();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [demoState, setDemoState] = useState<MemoDemoState | null>(null);
  const [demoFrame, setDemoFrame] = useState(false);
  const [commentPicking, setCommentPicking] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ selector: string; visibility: "always" | "if-outside-viewport" } | null>(null);
  const initialView = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (window.parent === window) return;
    const initialState = new URLSearchParams(window.location.search).get("state");
    if (isMemoDemoState(initialState)) setDemoState(initialState);
    const trustedOrigin = frameOrigin ? new URL(frameOrigin).origin : null;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (event.origin !== window.location.origin && event.origin !== trustedOrigin) return;
      if (event.data?.type === "proto:memo:set-state" && isMemoDemoState(event.data.state)) {
        setDemoFrame(true);
        setDemoState(event.data.state);
      }
      if (event.data?.type === "proto:memo:comment-mode") setCommentPicking(event.data.on === true);
      if ((event.data?.type === "proto:memo:focus-target" || event.data?.type === "proto:memo:focus-comment") &&
        (event.data.selector === null || typeof event.data.selector === "string")) {
        setFocusRequest(event.data.selector ? { selector: event.data.selector, visibility: event.data.visibility === "if-outside-viewport" ? "if-outside-viewport" : "always" } : null);
      }
      if (event.data?.type === "proto:memo:resolve-comment-target" && typeof event.data.selector === "string") {
        let target: Element | null = null;
        try { target = document.querySelector(event.data.selector); } catch { /* A stale selection cannot be anchored. */ }
        const named = target?.closest<HTMLElement>("[data-proto-comment-id]");
        const selector = named ? `[data-proto-comment-id="${CSS.escape(named.dataset.protoCommentId ?? "")}"]` : null;
        postMemoFrame({ type: "proto:memo:comment-target-resolved", selector }, frameOrigin);
      }
    };
    window.addEventListener("message", onMessage);
    postMemoFrame({ type: "proto:memo:ready" }, frameOrigin);
    return () => window.removeEventListener("message", onMessage);
  }, [frameOrigin]);

  useEffect(() => {
    if (window.parent === window || !commentPicking) return;
    const highlight = document.createElement("div");
    highlight.setAttribute("data-proto-comment-highlight", "");
    Object.assign(highlight.style, { position: "fixed", pointerEvents: "none", zIndex: "2147483647", border: "2px solid #0088ff", borderRadius: "4px", background: "#0088ff16", display: "none" });
    document.body.appendChild(highlight);
    document.documentElement.style.cursor = "crosshair";
    const targetAt = (event: MouseEvent | PointerEvent) => document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-proto-comment-id]") ?? null;
    const paint = (target: HTMLElement | null) => {
      if (!target) { highlight.style.display = "none"; return; }
      const rect = target.getBoundingClientRect();
      Object.assign(highlight.style, { display: "block", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    };
    const move = (event: PointerEvent) => paint(targetAt(event));
    const block = (event: Event) => { event.preventDefault(); event.stopImmediatePropagation(); };
    const click = (event: MouseEvent) => {
      const target = targetAt(event);
      block(event);
      if (!target) return;
      const selector = `[data-proto-comment-id="${CSS.escape(target.dataset.protoCommentId ?? "")}"]`;
      setCommentPicking(false);
      postMemoFrame({ type: "proto:memo:comment-target-picked", selector }, frameOrigin);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      block(event);
      setCommentPicking(false);
      postMemoFrame({ type: "proto:memo:comment-mode-exited" }, frameOrigin);
    };
    document.addEventListener("pointermove", move, true);
    for (const type of ["pointerdown", "pointerup", "mousedown", "mouseup"]) window.addEventListener(type, block, true);
    window.addEventListener("click", click, true);
    window.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointermove", move, true);
      for (const type of ["pointerdown", "pointerup", "mousedown", "mouseup"]) window.removeEventListener(type, block, true);
      window.removeEventListener("click", click, true);
      window.removeEventListener("keydown", key, true);
      document.documentElement.style.cursor = "";
      highlight.remove();
    };
  }, [commentPicking, frameOrigin]);

  useEffect(() => {
    if (!focusRequest) return;
    const highlight = document.createElement("div");
    highlight.setAttribute("data-proto-target-highlight", "");
    Object.assign(highlight.style, {
      display: "none", position: "fixed", zIndex: "2147483647", pointerEvents: "none",
      border: "2px solid color-mix(in srgb, #0088ff 55%, transparent)",
      borderRadius: "9px", background: "color-mix(in srgb, #0088ff 6%, transparent)",
    });
    document.body.appendChild(highlight);
    let didScroll = false;
    const update = () => {
      let target: Element | null = null;
      try { target = document.querySelector(focusRequest.selector); } catch { /* An old target can disappear. */ }
      const rect = target?.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) {
        highlight.style.display = "none";
        postMemoFrame({ type: "proto:memo:target-measured", selector: focusRequest.selector, anchor: null }, frameOrigin);
        return;
      }
      if (!didScroll && focusRequest.visibility === "if-outside-viewport" &&
        rect.bottom > 0 && rect.right > 0 && rect.top < document.documentElement.clientHeight && rect.left < document.documentElement.clientWidth) {
        setFocusRequest(null);
        return;
      }
      if (!didScroll) { target?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" }); didScroll = true; }
      Object.assign(highlight.style, { display: "block", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
      postMemoFrame({ type: "proto:memo:target-measured", selector: focusRequest.selector, anchor: {
        x: rect.left, y: rect.top, width: rect.width, height: rect.height,
      } }, frameOrigin);
    };
    const dismiss = (event: PointerEvent) => {
      let target: Element | null = null;
      try { target = document.querySelector(focusRequest.selector); } catch { /* Ignore stale selectors. */ }
      const rect = target?.getBoundingClientRect();
      if (rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) return;
      setFocusRequest(null);
      postMemoFrame({ type: "proto:memo:focus-dismissed" }, frameOrigin);
    };
    const retry = window.setInterval(update, 50);
    const stop = window.setTimeout(() => window.clearInterval(retry), 400);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    document.addEventListener("pointerdown", dismiss, true);
    update();
    return () => {
      window.clearInterval(retry); window.clearTimeout(stop);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      document.removeEventListener("pointerdown", dismiss, true);
      highlight.remove();
    };
  }, [focusRequest, demoState, frameOrigin]);

  useEffect(() => {
    let active = true;
    try {
      const savedEmail = window.localStorage.getItem(MEMO_EMAIL_STORAGE_KEY);
      if (savedEmail && VALID_EMAIL.test(savedEmail)) {
        initialView.current ??= recordMemoView(savedEmail);
        void initialView.current.then(() => {
          if (active) setUnlocked(true);
        }).catch(() => {
          if (active) setUnlocked(false);
        });
      } else {
        setUnlocked(false);
      }
    } catch {
      setUnlocked(false);
    }
    return () => { active = false; };
  }, []);

  const showMemo = demoState === "unlocked-memo" || demoState === null && unlocked === true;

  return (
    <MarketingRoot className="memo-page relative isolate min-h-svh overflow-hidden bg-[var(--background)]">
      <ThemePicker homeHref="/" />
      <MemoTransitionScene
        showMemo={showMemo}
        showGate={demoState !== null && demoState !== "unlocked-memo" || demoState === null && unlocked === false}
        demoFrame={demoFrame}
        demoState={demoState}
        onUnlock={() => {
          setUnlocked(true);
          if (demoState) {
            setDemoState("unlocked-memo");
            postMemoFrame({ type: "proto:memo:state", state: "unlocked-memo" }, frameOrigin);
          }
        }}
      />
    </MarketingRoot>
  );
}
