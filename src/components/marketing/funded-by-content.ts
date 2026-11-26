import type { StaticImageData } from "next/image";

import adrianMatoPortrait from "./funded-by-assets/adrian-mato.jpg";
import ariWeinsteinPortrait from "./funded-by-assets/ari-weinstein.jpg";
import davidHuangPortrait from "./funded-by-assets/david-huang.png";
import johnPhamousPortrait from "./funded-by-assets/john-phamous.jpg";
import soleioPortrait from "./funded-by-assets/soleio.jpg";
import stephenHaneyPortrait from "./funded-by-assets/stephen-haney.jpg";

export type Backer = {
  name: string;
  role: string;
  href: string;
  detail: string;
  portrait: StaticImageData;
};

export const BACKERS = [
  {
    name: "Soleio",
    role: "Design Morpheus",
    href: "https://x.com/soleio",
    detail: "Backing a more visual way to build software.",
    portrait: soleioPortrait,
  },
  {
    name: "John Phamous",
    role: "Head of Product Design, Vercel",
    href: "https://x.com/JohnPhamous",
    detail: "Early believer in tools for creative teams.",
    portrait: davidHuangPortrait,
  },
  {
    name: "Adrian Mato",
    role: "Design Director, Github",
    href: "https://x.com/adrianmg",
    detail: "Supporting the next generation of prototyping.",
    portrait: adrianMatoPortrait,
  },
  {
    name: "David Hoang",
    role: "VP of Design, Atlassian",
    href: "https://x.com/davidhoang",
    detail: "Backing products that make ideas tangible.",
    portrait: johnPhamousPortrait,
  },
  {
    name: "Stephen Haney",
    role: "CEO, Paper",
    href: "https://x.com/stephenhaney",
    detail: "A longtime champion of visual development.",
    portrait: stephenHaneyPortrait,
  },
  {
    name: "Ari Weinstein",
    role: "Product Leader, OpenAI",
    href: "https://x.com/AriX",
    detail: "Building ambitious products at OpenAI.",
    portrait: ariWeinsteinPortrait,
  },
] as const satisfies readonly Backer[];
