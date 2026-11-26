"use client";

import { usePathname } from "next/navigation";
import { Monitor, Moon, Sun, Terminal } from "lucide-react";
import { HomeButton } from "@/components/marketing/home-button";
import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent,
  type SVGProps,
} from "react";

import { MacintoshIcon } from "@/components/marketing/macintosh-icon";
import { PrototypeComponent } from "@/components/marketing/prototype-target";
import { useTheme } from "@/components/marketing/marketing-root";
import { cn } from "@/lib/utils";
import { type ThemePreference } from "@/lib/marketing/theme";

function P5Icon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1201 1148"
      fill="currentColor"
      className={cn(
        "origin-center rotate-[18deg]",
        "motion-safe:group-hover/option:animate-p5-spin",
        "motion-safe:group-focus-visible/option:animate-p5-spin",
        className,
      )}
      aria-hidden
      {...props}
    >
      <path d="M733.042 0C733.341 0.231106 733.64 0.462211 733.726 1.34415C733.345 3.80798 733.031 5.62096 733.031 7.43397C733.008 138.184 733.005 268.933 733.056 399.683C733.057 401.769 733.753 403.856 734.124 405.942C749.27 401.382 764.403 396.781 779.564 392.27C802.407 385.474 825.288 378.803 848.117 371.959C863.754 367.271 879.309 362.311 894.938 357.598C914.631 351.659 934.382 345.911 954.072 339.962C969.856 335.193 985.559 330.158 1001.35 325.399C1020.88 319.509 1040.49 313.849 1060.03 307.962C1075.81 303.205 1091.54 298.249 1107.3 293.405C1111.2 292.205 1115.33 291.515 1119 289.827C1122.76 288.098 1123.96 289.663 1124.98 292.796C1131.82 313.884 1138.74 334.949 1145.59 356.038C1154.81 384.464 1163.97 412.914 1173.21 441.337C1181.63 467.26 1190.13 493.159 1198.57 519.075C1199.23 521.087 1199.72 523.153 1200.4 525.601C1185.91 530.578 1171.74 535.488 1157.53 540.317C1137.37 547.173 1117.18 553.963 1097 560.795C1082.74 565.625 1068.47 570.468 1054.22 575.326C1025.55 585.094 996.892 594.866 968.236 604.656C952.045 610.188 935.877 615.786 919.682 621.306C893.924 630.086 868.139 638.788 842.393 647.602C832.674 650.928 823.031 654.473 812.573 658.196C852.791 715.19 892.949 772.067 933.073 828.967C973.136 885.782 1013.17 942.621 1053.42 999.744C1048.02 1003.8 1042.9 1007.71 1037.72 1011.53C1026.74 1019.63 1015.78 1027.77 1004.71 1035.73C992.285 1044.67 979.679 1053.35 967.266 1062.29C951.469 1073.68 935.814 1085.26 920.046 1096.69C905.45 1107.26 890.771 1117.72 876.158 1128.27C868.099 1134.09 860.043 1139.92 852.109 1145.91C849.701 1147.73 848.286 1147.57 846.455 1145.13C826.091 1117.98 805.632 1090.9 785.215 1063.79C763.308 1034.71 741.444 1005.59 719.514 976.522C696.987 946.664 674.43 916.829 651.836 887.021C633.123 862.332 614.337 837.698 595.351 812.735C591.462 817.565 587.376 822.351 583.605 827.375C572.921 841.61 562.422 855.984 551.744 870.224C541.913 883.335 531.94 896.341 522.037 909.399C509.898 925.403 497.714 941.374 485.648 957.433C474.65 972.071 463.869 986.871 452.836 1001.48C442.255 1015.49 431.394 1029.29 420.8 1043.3C409.752 1057.9 398.949 1072.69 387.902 1087.29C377.215 1101.42 366.35 1115.41 355.571 1129.47C354.51 1130.86 353.617 1132.39 352.443 1133.67C347.676 1138.85 347.585 1138.9 341.913 1134.58C321.851 1119.29 301.868 1103.9 281.791 1088.63C256.077 1069.07 230.277 1049.62 204.56 1030.06C187.118 1016.8 169.755 1003.43 152.36 990.11C151.57 989.505 150.816 988.853 149.624 987.88C155.949 979.186 162.031 970.768 168.174 962.395C184.835 939.68 201.548 917.004 218.188 894.273C226.941 882.317 235.537 870.245 244.283 858.284C263.55 831.935 282.884 805.635 302.156 779.289C310.991 767.21 319.714 755.048 328.541 742.963C344.018 721.772 359.555 700.625 375.026 679.43C380.094 672.487 385.036 665.451 390.468 657.851C377.467 653.236 364.878 648.804 352.313 644.302C323.612 634.018 294.917 623.716 266.23 613.392C242.026 604.681 217.817 595.982 193.646 587.181C163.932 576.361 134.292 565.337 104.551 554.591C70.6401 542.338 36.6565 530.287 2.69594 518.173C-0.080091 517.183 -0.481864 515.584 0.453546 512.872C4.19855 502.015 7.8002 491.108 11.3593 480.189C25.0326 438.239 38.6886 396.282 52.3116 354.316C60.3078 329.683 68.2297 305.026 76.4246 279.638C79.6022 280.568 82.6769 281.386 85.6987 282.366C111.073 290.602 136.428 298.897 161.808 307.114C182.858 313.929 203.938 320.654 225 327.433C243.549 333.404 262.097 339.381 280.638 345.378C311.182 355.257 341.709 365.187 372.263 375.032C393.457 381.861 414.685 388.586 435.899 395.353C446.65 398.782 457.404 402.203 468.685 405.501C469.479 403.589 469.976 401.804 469.977 400.019C470.003 266.776 469.989 133.534 469.979 0.291096C469.979 0.291096 469.909 0.13892 470.415 0.137619C557.465 0.147515 644.011 0.159187 730.556 0.162872C731.385 0.162906 732.214 0.056637 733.042 0Z" />
    </svg>
  );
}


const OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "matrix", label: "Terminal", icon: Terminal },
  { value: "p5js", label: "p5.js", icon: P5Icon },
  { value: "macintosh", label: "Macintosh", icon: MacintoshIcon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemePicker({ className, homeHref }: { className?: string; homeHref?: string }) {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/landing";
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const selectByOffset = useCallback(
    (offset: number) => {
      const currentIndex = OPTIONS.findIndex(
        (option) => option.value === preference,
      );
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex =
        (startIndex + offset + OPTIONS.length) % OPTIONS.length;
      setPreference(OPTIONS[nextIndex]!.value);
    },
    [preference, setPreference],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectByOffset(1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectByOffset(-1);
    }
  };

  const isMacintoshTheme = resolvedTheme === "macintosh";

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = shellRef.current;
      const target = event.target;
      if (!node || !(target instanceof Node) || node.contains(target)) return;
      setExpanded(false);
    };

    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const selected = shellRef.current?.querySelector<HTMLButtonElement>(
        "[data-theme-option][aria-checked='true']",
      );
      setExpanded(false);
      selected?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [expanded]);

  const onShellBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!expanded) return;
    const next = event.relatedTarget;
    if (!(next instanceof Node)) return;
    if (event.currentTarget.contains(next)) return;
    setExpanded(false);
  };

  return (
    <PrototypeComponent id="theme-picker" className={className}>
      {homeHref && (
        <HomeButton href={homeHref} />
      )}
      <div
        ref={shellRef}
        onBlur={onShellBlur}
        className={cn(
          "theme-picker-shell pointer-events-auto absolute z-50 flex w-fit items-start gap-2 top-3 md:top-4",
          isLandingPage ? "left-3 sm:left-auto sm:right-3 md:right-4" : "right-3 md:right-4",
        )}
      >
        <div className="theme-picker-frame">
        <div
          role={expanded ? "radiogroup" : undefined}
          aria-label="Color mode"
          aria-orientation={expanded ? "horizontal" : undefined}
          onKeyDown={expanded ? onKeyDown : undefined}
          onClick={() => {
            if (!expanded) setExpanded(true);
          }}
          className={cn(
            "theme-picker-options inline-flex h-[var(--marketing-header-control-height)] items-center rounded-xl border border-transparent bg-muted/90 p-1 backdrop-blur-sm",
            "transition-[gap] duration-200 ease-out",
            reduceMotion && "transition-none",
            expanded ? "gap-1" : "cursor-pointer gap-0",
          )}
        >
          {OPTIONS.map((option) => {
            const selected = preference === option.value;
            const shown = expanded || selected;
            const isMatrixTheme = resolvedTheme === "matrix";
            const accentSelected =
              selected &&
              (option.value === "matrix" || option.value === "p5js");
            const Icon = option.icon;
            let selectedHighlight = null;
            if (expanded && selected && isMacintoshTheme) {
              selectedHighlight = (
                <span className="absolute inset-0 rounded-none bg-black" />
              );
            } else if (expanded && selected) {
              selectedHighlight = (
                <motion.span
                  layoutId={reduceMotion ? undefined : "theme-picker-thumb"}
                  className={cn(
                    "absolute inset-0 rounded-[0.625rem]",
                    accentSelected
                      ? "bg-primary/15 shadow-[inset_0_0_0_1px_var(--primary)]"
                      : "bg-background",
                  )}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 34 }
                  }
                />
              );
            }
            let ariaLabel = option.label;
            if (!expanded && selected) {
              ariaLabel = `${option.label}. show color modes`;
            }

            return (
              <button
                key={option.value}
                type="button"
                role={expanded ? "radio" : undefined}
                aria-checked={expanded ? selected : undefined}
                aria-expanded={!expanded && selected ? false : undefined}
                aria-haspopup={!expanded && selected ? "true" : undefined}
                aria-hidden={shown ? undefined : true}
                aria-label={ariaLabel}
                tabIndex={shown ? undefined : -1}
                data-theme-option={option.value}
                suppressHydrationWarning
                onClick={(event) => {
                  event.stopPropagation();
                  if (!expanded) {
                    setExpanded(true);
                    return;
                  }
                  setPreference(option.value);
                  setExpanded(false);
                }}
                onKeyDown={(event) => {
                  if (expanded || !selected) return;
                  if (
                    event.key !== "ArrowRight" &&
                    event.key !== "ArrowDown" &&
                    event.key !== "ArrowLeft" &&
                    event.key !== "ArrowUp"
                  ) {
                    return;
                  }
                  event.preventDefault();
                  setExpanded(true);
                }}
                className={cn(
                  "group/option relative inline-flex min-h-0 min-w-0 cursor-pointer items-center justify-center",
                  "transition-[width,height,opacity] duration-200 ease-out",
                  reduceMotion && "transition-none",
                  shown
                    ? "size-[calc(var(--marketing-header-control-height)-0.625rem)] shrink-0 opacity-100"
                    : "pointer-events-none size-0 opacity-0",
                  isMacintoshTheme
                    ? "rounded-none"
                    : "rounded-[0.625rem]",
                  "focus-visible:outline-ring focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2",
                  selected && expanded && isMacintoshTheme
                    ? "text-white"
                    : accentSelected
                      ? "text-primary"
                      : selected
                        ? "text-foreground"
                        : "text-muted-foreground",
                  !isMatrixTheme &&
                    !isMacintoshTheme &&
                    !selected &&
                    "hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
                    isMacintoshTheme ? "rounded-none" : "rounded-[0.625rem]",
                  )}
                >
                  {selectedHighlight}
                  <Icon
                    className={cn(
                      "relative z-10 size-4 shrink-0",
                      isMatrixTheme &&
                        "transition-opacity duration-150 group-hover/option:opacity-55",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                {expanded ? (
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute top-full left-1/2 z-30 mt-2 -translate-x-1/2",
                      "text-center whitespace-nowrap border border-border bg-card px-2.5 py-1",
                      isMacintoshTheme
                        ? "rounded-none text-[12px] tracking-[0.04em]"
                        : "rounded-md text-[11px] font-medium tracking-[-0.01em]",
                      resolvedTheme === "matrix" || resolvedTheme === "p5js"
                        ? "text-primary"
                        : "text-foreground",
                      "shadow-[var(--picker-tooltip-shadow)]",
                      "opacity-0 transition-opacity duration-150 delay-0",
                      "group-hover/option:opacity-100 group-hover/option:delay-200",
                      "group-focus-visible/option:opacity-100 group-focus-visible/option:delay-0",
                      reduceMotion && "transition-none delay-0",
                    )}
                  >
                    {option.label}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </PrototypeComponent>
  );
}

export function MarketingThemePicker() {
  return <ThemePicker />;
}
