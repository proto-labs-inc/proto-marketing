function MemoLink({ href, children }: { href: string; children: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative z-[1] underline decoration-1 decoration-current underline-offset-[3px] [text-decoration-skip-ink:none] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current">{children}</a>;
}

export const memoSections = [
  {
    id: "about",
    label: "About",
    paragraphs: [<>Generating code has become cheap, but building high quality software is still extraordinarily difficult. This is because <MemoLink href="https://stateofaidesign.com/chapters/tools">76%</MemoLink> of designers work in coding agents meant for engineering, not design. Proto is the coding agent for product design. It has all the building capabilities of Claude Code, but made for design, with features like Midjourney’s rapid idea exploration, and Figma’s first class sharing. It will unlock everyone’s full design potential and close <span className="md:whitespace-nowrap">the taste gap.</span></>],
  },
  {
    id: "current-state",
    label: "Current state",
    paragraphs: [<>Proto’s <MemoLink href="https://x.com/maayanalbert/status/2118872746415509578?s=20">early access announcement</MemoLink> spoke to a pressing need in the design community and garnered thousands of waitlist signups and hundreds of people reaching out to Maayan directly.</>],
  },
  {
    id: "founder-backing",
    label: "Founder & backing",
    paragraphs: [<><MemoLink href="https://x.com/maayanalbert">Maayan</MemoLink> is <MemoLink href="https://en.wikipedia.org/wiki/Conference_on_Human_Factors_in_Computing_Systems">published</MemoLink> for creative tooling, and has worked at Apple, Google and Browserbase. Proto is backed by YC and design angels including <MemoLink href="https://x.com/soleio">Soleio</MemoLink>, <MemoLink href="https://x.com/JohnPhamous">John Pham</MemoLink>, <MemoLink href="https://x.com/davidhoang">David Hoang</MemoLink>, <MemoLink href="https://x.com/stephenhaney">Stephen Haney</MemoLink> and <MemoLink href="https://x.com/adrianmg">Adrian Mato</MemoLink>.</>],
  },
] as const;
