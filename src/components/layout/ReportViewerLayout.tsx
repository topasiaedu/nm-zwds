/**
 * ReportViewerLayout — chart/report shell composing CommandCentreShell.
 *
 * Owns report-specific UX: scroll-spy, section bottom sheet, mobile section picker.
 */

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { C } from "../alignment-advantage/shared/constants";
import { Sparkle } from "../alignment-advantage/shared/Sparkle";
import CommandCentreShell from "./CommandCentreShell";
import type { AppNavItem } from "./commandCentreTypes";
import { useTheme } from "../../hooks/useTheme";
import { getShellTokens } from "../../styles/shellTheme";

const MOBILE_MEDIA_QUERY = "(min-width: 768px)";

/** Subtle slide distance for mobile section indicator transitions */
const SECTION_INDICATOR_SLIDE_PX = 10;

const SECTION_INDICATOR_TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const DOT_TEXTURE_STYLE: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
};

const IconClose = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconChevronDown = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

/** @deprecated Use AppNavItem from commandCentreTypes — kept for existing imports */
export type ReportAppNavItem = AppNavItem;

/** In-document section anchor for scroll-spy navigation */
export interface ReportSection {
  id: string;
  label: string;
  sub?: string;
}

export interface ReportViewerLayoutProps {
  /** Profile or report subject name shown in sidebar header and footer */
  profileName: string;
  /** App navigation links (Dashboard, My Chart, Calculate, etc.) */
  appNavItems: AppNavItem[];
  /** Report section anchors for scroll-spy */
  reportSections: ReportSection[];
  /** Main scrollable content */
  children: React.ReactNode;
  /** Optional footer action slot (e.g. PDF export button) */
  footerActions?: React.ReactNode;
}

/** Shared chapter-style section row — sidebar drawer and mobile bottom sheet */
const SectionNavButton: React.FC<{
  section: ReportSection;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
}> = ({ section, index, isActive, onSelect }) => (
  <li>
    <button
      type="button"
      onClick={() => { onSelect(section.id); }}
      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
      style={{
        background: isActive ? `${C.coral}22` : "transparent",
        borderLeft: isActive ? `2px solid ${C.coral}` : "2px solid transparent",
      }}
      aria-current={isActive ? "true" : undefined}
    >
      <span
        className="shrink-0 w-5 text-center text-[9px] font-bold tabular-nums"
        style={{ color: isActive ? C.coral : "rgba(255,255,255,0.22)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="text-xs font-semibold truncate"
          style={{ color: isActive ? C.white : "rgba(255,255,255,0.5)" }}
        >
          {section.label}
        </p>
        {section.sub !== undefined && (
          <p
            className="text-[9px] truncate"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {section.sub}
          </p>
        )}
      </div>
      {isActive && (
        <div
          className="shrink-0 w-1 h-5 rounded-full"
          style={{ background: `linear-gradient(180deg, ${C.coral}, ${C.gold})` }}
        />
      )}
    </button>
  </li>
);

const ReportViewerLayout: React.FC<ReportViewerLayoutProps> = ({
  profileName,
  appNavItems,
  reportSections,
  children,
  footerActions,
}) => {
  const { isDark } = useTheme();
  const shellTokens = getShellTokens(isDark);
  const sidebarCloseRef = useRef<(() => void) | null>(null);
  /** Content wrapper — used to re-attach scroll-spy when section DOM mounts late */
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [activeSection, setActiveSection] = useState<string>(
    reportSections[0]?.id ?? ""
  );
  const [sectionPickerOpen, setSectionPickerOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });

  const closeSectionPicker = useCallback((): void => {
    setSectionPickerOpen(false);
  }, []);

  const openSectionPicker = useCallback((): void => {
    setSectionPickerOpen(true);
  }, []);

  const closeSidebar = useCallback((): void => {
    sidebarCloseRef.current?.();
  }, []);

  const scrollToSection = useCallback((id: string): void => {
    const target = document.getElementById(id);
    if (target === null) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    closeSidebar();
    closeSectionPicker();
  }, [closeSidebar, closeSectionPicker]);

  const activeSectionData = useMemo((): ReportSection | undefined => {
    return reportSections.find((section) => section.id === activeSection);
  }, [reportSections, activeSection]);

  const activeSectionIndex = useMemo((): number => {
    const index = reportSections.findIndex((section) => section.id === activeSection);
    return index >= 0 ? index : 0;
  }, [reportSections, activeSection]);

  /** Direction for mobile section indicator slide — 1 = forward, -1 = backward */
  const prevSectionIndexRef = useRef<number>(activeSectionIndex);
  const [sectionSlideDirection, setSectionSlideDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const previousIndex = prevSectionIndexRef.current;
    if (previousIndex !== activeSectionIndex) {
      setSectionSlideDirection(activeSectionIndex > previousIndex ? 1 : -1);
      prevSectionIndexRef.current = activeSectionIndex;
    }
  }, [activeSectionIndex]);

  /** Collapse section sheet when crossing to desktop */
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsDesktop(event.matches);
      if (event.matches) {
        setSectionPickerOpen(false);
      }
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => { mediaQuery.removeEventListener("change", handleChange); };
  }, []);

  /** Close section picker on Escape */
  useEffect(() => {
    if (!sectionPickerOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeSectionPicker();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [sectionPickerOpen, closeSectionPicker]);

  /** Lock body scroll while section picker is open */
  useEffect(() => {
    if (!sectionPickerOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sectionPickerOpen, isDesktop]);

  /**
   * Scroll-spy: highlight the section nearest the top of the shell scroll root.
   * Re-attaches when section nodes appear later (e.g. founder-report after calc),
   * because reportSections alone may be stable while the DOM is still loading.
   */
  useEffect(() => {
    if (reportSections.length === 0) return;

    const sectionIds = reportSections.map((section) => section.id);
    let observer: IntersectionObserver | null = null;
    let observedKey = "";

    const resolveScrollRoot = (): Element | null => {
      const marked = document.querySelector("[data-shell-scroll-root]");
      return marked instanceof Element ? marked : null;
    };

    const syncObserver = (): void => {
      const elements: Element[] = [];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el !== null) {
          elements.push(el);
        }
      }

      const nextKey = elements.map((el) => el.id).join(",");
      if (nextKey === observedKey) {
        return;
      }
      observedKey = nextKey;

      if (observer !== null) {
        observer.disconnect();
        observer = null;
      }

      if (elements.length === 0) {
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) {
            return;
          }
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          const nextId = topmost.target.id;
          if (nextId.length > 0) {
            setActiveSection(nextId);
          }
        },
        {
          root: resolveScrollRoot(),
          rootMargin: "-10% 0px -60% 0px",
          threshold: 0,
        }
      );

      for (const el of elements) {
        observer.observe(el);
      }
    };

    syncObserver();

    const mutationTarget = contentRef.current ?? document.body;
    const mutationObserver = new MutationObserver(() => {
      syncObserver();
    });
    mutationObserver.observe(mutationTarget, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      if (observer !== null) {
        observer.disconnect();
      }
    };
  }, [reportSections]);

  /** Keep active section in sync when sections list changes */
  useEffect(() => {
    if (
      reportSections.length > 0 &&
      !reportSections.some((section) => section.id === activeSection)
    ) {
      setActiveSection(reportSections[0].id);
    }
  }, [reportSections, activeSection]);

  const profileInitial = profileName.trim().length > 0
    ? profileName.trim().charAt(0).toUpperCase()
    : "?";

  const sheetBackground = shellTokens.sheetBg;

  const sectionNavSlot = reportSections.length > 0 ? (
    <nav className="px-3 py-4" aria-label="Report sections">
      <p
        className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 mb-3"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        Report
      </p>
      <ul className="space-y-0.5">
        {reportSections.map((section, index) => (
          <SectionNavButton
            key={section.id}
            section={section}
            index={index}
            isActive={activeSection === section.id}
            onSelect={scrollToSection}
          />
        ))}
      </ul>
    </nav>
  ) : undefined;

  const sidebarFooter = (
    <>
      {footerActions !== undefined && (
        <div
          className="px-4 py-4 space-y-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {footerActions}
        </div>
      )}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`,
            color: C.white,
          }}
        >
          {profileInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-semibold truncate"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {profileName}
          </p>
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="text-[9px] font-medium transition-colors hover:opacity-80"
            style={{ color: C.coral }}
          >
            ← Dashboard
          </Link>
        </div>
      </div>
    </>
  );

  const mobileTopExtra = reportSections.length > 0 && activeSectionData !== undefined ? (
    <button
      type="button"
      onClick={openSectionPicker}
      className="w-full flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 min-w-0"
      aria-label="Browse report sections"
      aria-expanded={sectionPickerOpen}
      aria-haspopup="dialog"
    >
      <div
        className="shrink-0 w-0.5 self-stretch rounded-full min-h-[2.25rem]"
        style={{ background: `linear-gradient(180deg, ${C.coral}, ${C.gold})` }}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <p
          className="text-[8px] font-bold uppercase tracking-[0.22em] mb-0.5"
          style={{ color: shellTokens.contextBarMuted }}
        >
          Now viewing
        </p>
        <div className="relative overflow-hidden min-h-[2.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSection}
              initial={{
                y: sectionSlideDirection * SECTION_INDICATOR_SLIDE_PX,
                opacity: 0,
              }}
              animate={{ y: 0, opacity: 1 }}
              exit={{
                y: sectionSlideDirection * -SECTION_INDICATOR_SLIDE_PX,
                opacity: 0,
              }}
              transition={SECTION_INDICATOR_TRANSITION}
            >
              <p
                className="text-sm font-bold leading-tight truncate"
                style={{
                  color: shellTokens.contextBarText,
                  fontFamily: "Georgia,'Times New Roman',serif",
                }}
              >
                {activeSectionData.label}
              </p>
              <p
                className="text-[9px] truncate mt-0.5"
                style={{ color: shellTokens.contextBarMuted }}
              >
                {activeSectionData.sub !== undefined
                  ? `${activeSectionData.sub} · `
                  : ""}
                {activeSectionIndex + 1} of {reportSections.length}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <span
        className="shrink-0"
        style={{ color: shellTokens.contextBarMuted }}
        aria-hidden="true"
      >
        {IconChevronDown}
      </span>
    </button>
  ) : undefined;

  return (
    <>
      <CommandCentreShell
        brandLabel="Purple Star Astrology"
        brandSubLabel={profileName}
        contextTitle="Report"
        contextSubtitle={profileName}
        appNavItems={appNavItems}
        navSlot={sectionNavSlot}
        sidebarFooter={sidebarFooter}
        mobileTopExtra={mobileTopExtra}
        onSidebarCloseRef={sidebarCloseRef}
      >
        <div
          ref={contentRef}
          className="relative z-0 max-w-6xl mx-auto w-full min-w-0 box-border p-2"
        >
          {children}
        </div>
      </CommandCentreShell>

      {/* Mobile section picker — z-[60]/z-[70] above chart arrows (z-40) inside isolated main */}
      <AnimatePresence>
        {sectionPickerOpen && !isDesktop && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[60] md:hidden"
              style={{ background: shellTokens.sheetBackdrop }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSectionPicker}
              aria-label="Close section picker"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Report sections"
              className="fixed inset-x-0 bottom-0 z-[70] md:hidden flex flex-col rounded-t-[1.75rem] overflow-hidden"
              style={{
                maxHeight: "min(78vh, 640px)",
                background: sheetBackground,
                boxShadow: "0 -8px 40px rgba(0,0,0,0.35)",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={DOT_TEXTURE_STYLE}
              />

              <div className="relative z-10 flex justify-center pt-3 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                />
              </div>

              <div
                className="relative z-10 flex items-center justify-between px-5 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkle size={8} color={C.coral} />
                    <p
                      className="text-[8px] font-bold uppercase tracking-[0.24em]"
                      style={{ color: C.coral }}
                    >
                      Report Contents
                    </p>
                  </div>
                  <p
                    className="text-base font-bold"
                    style={{
                      color: shellTokens.contextBarText,
                      fontFamily: "Georgia,'Times New Roman',serif",
                    }}
                  >
                    Jump to Section
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeSectionPicker}
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.08)",
                  }}
                  aria-label="Close sections"
                >
                  {IconClose}
                </button>
              </div>

              <nav
                className="relative z-10 flex-1 overflow-y-auto px-3 py-3 [-webkit-overflow-scrolling:touch]"
                aria-label="Report sections"
              >
                <ul className="space-y-0.5 pb-6">
                  {reportSections.map((section, index) => (
                    <SectionNavButton
                      key={section.id}
                      section={section}
                      index={index}
                      isActive={activeSection === section.id}
                      onSelect={scrollToSection}
                    />
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportViewerLayout;
