/** Shared invite/home screen layout — mobile-first, capped at md width on larger screens. */
/** Copy blocks pass pointer events through to the shape canvas underneath. */
export const inviteBlockClassName =
  "pointer-events-none shrink-0 px-4 pt-0 pb-0 font-[family-name:var(--font-dm-sans)]! sm:px-5 md:px-8";

export const marketingContentShellClass =
  "mx-auto w-full max-w-md px-4 pb-0 sm:px-6 md:max-w-2xl md:px-10";

export const inviteContentShellClass =
  `pointer-events-none ${marketingContentShellClass}`;

export const inviteHeadlineClass =
  "pointer-events-none text-foreground mb-6 text-[2.25rem] leading-[1.25] font-semibold tracking-[-0.03em] sm:mb-5 sm:text-[2rem] md:mb-7 md:text-[2.75rem]";

/** Per-line page-color mask so canvas shapes do not show through wrapped copy. */
export const inviteLineHighlightClass =
  "box-decoration-clone bg-background px-[0.1em] shadow-[0_0_0_0.06em_var(--background)]";

/** Body blurbs — thicker per-line mask so gaps and vertex dots do not show between lines. */
export const inviteBodyLineHighlightClass =
  "box-decoration-clone bg-background px-[0.12em] shadow-[0_0_0_0.38em_var(--background)]";

export const inviteBodyClass =
  "pointer-events-none text-foreground text-[1rem] leading-[1.6] sm:text-[0.9375rem] md:text-[1rem] md:leading-[1.65]";

export const inviteBodyStackClass =
  "pointer-events-none flex flex-col gap-6 sm:gap-5 md:gap-7";

/** Motion wrappers must opt out of hit testing — they otherwise block the shape canvas. */
export const inviteMotionPassThroughClass = "pointer-events-none";

/** Opt in on links, buttons, and other controls that need real hit targets. */
export const inviteInteractiveClass = "pointer-events-auto relative z-30";
