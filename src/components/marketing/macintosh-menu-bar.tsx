"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useTheme } from "@/components/marketing/marketing-root";

export const MACINTOSH_CLEANUP_EVENT = "macintosh-cleanup-desktop";

function MacintoshAppleMark() {
  return (
    <svg
      viewBox="0 0 14 17"
      width="12"
      height="14"
      aria-hidden
      className="macintosh-menubar-apple"
    >
      <path
        fill="currentColor"
        d="M9.9 4.1c.7-.9 1.2-2.1 1-3.3-1.1.1-2.4.7-3.1 1.6-.7.8-1.3 2.1-1.1 3.3 1.2 0 2.4-.6 3.2-1.6zM13.7 12.2c-.3.7-.6 1.3-1 1.9-.6.9-1.2 1.8-2.1 1.8-.9 0-1.2-.6-2.3-.6s-1.4.6-2.3.6c-.9 0-1.6-1-2.2-1.9C1.8 12.2.9 9.3 2.2 7.3c.7-1.1 1.9-1.8 3.2-1.8.9 0 1.8.6 2.3.6s1.6-.7 2.8-.6c.5 0 1.8.2 2.7 1.6-.1.1-1.6 1-1.6 2.9 0 2.3 2 3.1 2.1 3.2z"
      />
    </svg>
  );
}

type ViewMode = "small-icon" | "icon" | "name" | "date" | "size" | "kind";

type MenuAction =
  | "about"
  | "control-panel"
  | "copy"
  | "cleanup"
  | "empty-trash"
  | `view-${ViewMode}`;

type MenuEntry =
  | { type: "separator" }
  | {
      type: "item";
      id: string;
      label: string;
      shortcut?: string;
      disabled?: boolean;
      checked?: boolean;
      action?: MenuAction;
    };

type MenuDefinition = {
  id: string;
  label: ReactNode;
  ariaLabel: string;
  items: MenuEntry[];
};

type DialogKind = "about" | "empty-trash" | null;

function dispatchCleanup() {
  window.dispatchEvent(new Event(MACINTOSH_CLEANUP_EVENT));
}

export function MacintoshMenuBar() {
  const { resolvedTheme } = useTheme();
  const barRef = useRef<HTMLElement>(null);
  const menuLabelId = useId();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("icon");
  const [dialog, setDialog] = useState<DialogKind>(null);

  const menus = useMemo<MenuDefinition[]>(
    () => [
      {
        id: "apple",
        label: <MacintoshAppleMark />,
        ariaLabel: "Apple",
        items: [
          { type: "item", id: "about", label: "About Proto...", action: "about" },
          { type: "separator" },
          { type: "item", id: "calculator", label: "Calculator", disabled: true },
          {
            type: "item",
            id: "control-panel",
            label: "Control Panel",
            action: "control-panel",
          },
          { type: "item", id: "puzzle", label: "Puzzle", disabled: true },
          { type: "item", id: "scrapbook", label: "Scrapbook", disabled: true },
        ],
      },
      {
        id: "file",
        label: "File",
        ariaLabel: "File",
        items: [
          {
            type: "item",
            id: "new-folder",
            label: "New Folder",
            shortcut: "N",
            disabled: true,
          },
          {
            type: "item",
            id: "open",
            label: "Open",
            shortcut: "O",
            disabled: true,
          },
          {
            type: "item",
            id: "close",
            label: "Close",
            shortcut: "W",
            disabled: true,
          },
          { type: "separator" },
          {
            type: "item",
            id: "get-info",
            label: "Get Info",
            shortcut: "I",
            disabled: true,
          },
          {
            type: "item",
            id: "duplicate",
            label: "Duplicate",
            shortcut: "D",
            disabled: true,
          },
          { type: "separator" },
          {
            type: "item",
            id: "find",
            label: "Find...",
            shortcut: "F",
            disabled: true,
          },
        ],
      },
      {
        id: "edit",
        label: "Edit",
        ariaLabel: "Edit",
        items: [
          {
            type: "item",
            id: "undo",
            label: "Undo",
            shortcut: "Z",
            disabled: true,
          },
          { type: "separator" },
          {
            type: "item",
            id: "cut",
            label: "Cut",
            shortcut: "X",
            disabled: true,
          },
          { type: "item", id: "copy", label: "Copy", shortcut: "C", action: "copy" },
          {
            type: "item",
            id: "paste",
            label: "Paste",
            shortcut: "V",
            disabled: true,
          },
          { type: "item", id: "clear", label: "Clear", disabled: true },
          {
            type: "item",
            id: "select-all",
            label: "Select All",
            shortcut: "A",
            disabled: true,
          },
        ],
      },
      {
        id: "view",
        label: "View",
        ariaLabel: "View",
        items: [
          {
            type: "item",
            id: "view-small-icon",
            label: "by Small Icon",
            checked: viewMode === "small-icon",
            action: "view-small-icon",
          },
          {
            type: "item",
            id: "view-icon",
            label: "by Icon",
            checked: viewMode === "icon",
            action: "view-icon",
          },
          {
            type: "item",
            id: "view-name",
            label: "by Name",
            checked: viewMode === "name",
            action: "view-name",
          },
          {
            type: "item",
            id: "view-date",
            label: "by Date",
            checked: viewMode === "date",
            action: "view-date",
          },
          {
            type: "item",
            id: "view-size",
            label: "by Size",
            checked: viewMode === "size",
            action: "view-size",
          },
          {
            type: "item",
            id: "view-kind",
            label: "by Kind",
            checked: viewMode === "kind",
            action: "view-kind",
          },
        ],
      },
      {
        id: "special",
        label: "Special",
        ariaLabel: "Special",
        items: [
          {
            type: "item",
            id: "cleanup",
            label: "Clean Up Desktop",
            action: "cleanup",
          },
          {
            type: "item",
            id: "empty-trash",
            label: "Empty Trash...",
            action: "empty-trash",
          },
          { type: "separator" },
          { type: "item", id: "eject", label: "Eject", disabled: true },
          { type: "item", id: "restart", label: "Restart", disabled: true },
          { type: "item", id: "shutdown", label: "Shut Down", disabled: true },
        ],
      },
    ],
    [viewMode],
  );

  useEffect(() => {
    if (resolvedTheme !== "macintosh") {
      setOpenMenu(null);
      setDialog(null);
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog]);

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (barRef.current?.contains(event.target as Node)) return;
      setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        return;
      }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const index = menus.findIndex((menu) => menu.id === openMenu);
      if (index === -1) return;
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const next = menus[(index + offset + menus.length) % menus.length];
      setOpenMenu(next!.id);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menus, openMenu]);

  const isMacintoshTheme = resolvedTheme === "macintosh";

  const runAction = (action: MenuAction) => {
    if (action === "about") {
      setDialog("about");
      return;
    }
    if (action === "control-panel" || action === "cleanup") {
      dispatchCleanup();
      return;
    }
    if (action === "copy") {
      void navigator.clipboard.writeText(window.location.href).catch(() => {});
      return;
    }
    if (action === "empty-trash") {
      setDialog("empty-trash");
      return;
    }
    if (action.startsWith("view-")) {
      setViewMode(action.slice("view-".length) as ViewMode);
    }
  };

  return (
    <>
      <nav
        ref={barRef}
        className="macintosh-menubar"
        aria-label="Macintosh menu bar"
      >
        {menus.map((menu) => {
          const isOpen = openMenu === menu.id;
          return (
            <div
              key={menu.id}
              className={
                isOpen
                  ? "macintosh-menubar-item is-open"
                  : "macintosh-menubar-item"
              }
            >
              <button
                type="button"
                className="macintosh-menubar-item-button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label={menu.ariaLabel}
                onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                onPointerEnter={() => {
                  if (openMenu) setOpenMenu(menu.id);
                }}
              >
                {menu.label}
              </button>
              {isOpen ? (
                <div
                  role="menu"
                  aria-label={menu.ariaLabel}
                  className="macintosh-menu"
                >
                  {menu.items.map((item, index) => {
                    if (item.type === "separator") {
                      return (
                        <div
                          key={`${menu.id}-sep-${index}`}
                          role="separator"
                          className="macintosh-menu-separator"
                        />
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        className="macintosh-menu-item"
                        aria-disabled={item.disabled || undefined}
                        aria-checked={item.checked}
                        disabled={item.disabled}
                        onClick={() => {
                          if (item.disabled || !item.action) return;
                          runAction(item.action);
                          setOpenMenu(null);
                        }}
                      >
                        <span className="macintosh-menu-check" aria-hidden>
                          {item.checked ? "\u2713" : ""}
                        </span>
                        <span>{item.label}</span>
                        <span className="macintosh-menu-shortcut" aria-hidden>
                          {item.shortcut ? `\u2318${item.shortcut}` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      {isMacintoshTheme && dialog ? (
        <div className="macintosh-dialog-layer">
          <div
            className="macintosh-window macintosh-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={menuLabelId}
          >
            <div className="macintosh-titlebar">
              <button
                type="button"
                className="macintosh-titlebar-box"
                aria-label="Close"
                onClick={() => setDialog(null)}
              />
              <span id={menuLabelId} className="macintosh-titlebar-label">
                {dialog === "about" ? "About Proto" : "Finder"}
              </span>
              <span className="macintosh-titlebar-box macintosh-titlebar-zoom" />
            </div>
            <div className="macintosh-dialog-body">
              {dialog === "about" ? (
                <>
                  <p className="macintosh-dialog-kicker">Macintosh System</p>
                  <p className="macintosh-dialog-title">Proto 1.0</p>
                  <p className="macintosh-dialog-copy">
                    A prototyping tool for the idea phase of building.
                  </p>
                  <p className="macintosh-dialog-meta">
                    Memory: 1024K  Total Disk: Endless
                  </p>
                </>
              ) : (
                <p className="macintosh-dialog-copy">
                  The Trash cannot be emptied, because it contains no items.
                </p>
              )}
              <div className="macintosh-dialog-actions">
                <button
                  type="button"
                  className="macintosh-button macintosh-button-default"
                  onClick={() => setDialog(null)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
