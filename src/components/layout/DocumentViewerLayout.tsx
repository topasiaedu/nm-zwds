/**
 * DocumentViewerLayout — chapter-based report shell composing CommandCentreShell.
 *
 * For Alignment Advantage and similar multi-chapter documents: sidebar chapter nav,
 * mobile chapter bottom sheet.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { C } from "../alignment-advantage/shared/constants";
import { Sparkle } from "../alignment-advantage/shared/Sparkle";
import CommandCentreShell from "./CommandCentreShell";
import type { AppNavItem } from "./commandCentreTypes";
import { useTheme } from "../../hooks/useTheme";
import { getShellTokens } from "../../styles/shellTheme";

const MOBILE_MEDIA_QUERY = "(min-width: 768px)";

const CHAPTER_INDICATOR_SLIDE_PX = 10;

const CHAPTER_INDICATOR_TRANSITION = {
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

/** In-document chapter anchor for sidebar navigation */
export interface DocumentChapter {
  id: string;
  label: string;
  sub: string;
}

export interface DocumentViewerLayoutProps {
  /** Profile or report subject name */
  profileName: string;
  /** Document title passed to the shell context header (e.g. "Alignment Advantage") */
  contextTitle: string;
  /** Small brand label in sidebar header */
  brandLabel?: string;
  /** App navigation links from useAppNavItems */
  appNavItems: AppNavItem[];
  /** Chapter list for sidebar and mobile picker */
  chapters: DocumentChapter[];
  /** Currently highlighted chapter id (controlled by parent scroll-spy) */
  activeChapter: string;
  /** Called when user selects a chapter — parent should scroll to section */
  onChapterClick: (id: string) => void;
  /** Main scrollable document content */
  children: React.ReactNode;
  /** Optional sidebar footer actions (e.g. PDF download) */
  footerActions?: React.ReactNode;
}

/** Chapter row — sidebar drawer and mobile bottom sheet */
const ChapterNavButton: React.FC<{
  chapter: DocumentChapter;
  isActive: boolean;
  onSelect: (id: string) => void;
  /** Dense rows so long Contents lists fit better */
  compact?: boolean;
}> = ({ chapter, isActive, onSelect, compact = false }) => (
  <li>
    <button
      type="button"
      onClick={() => { onSelect(chapter.id); }}
      className={[
        "w-full text-left flex items-center gap-2.5 rounded-lg transition-all duration-150",
        compact ? "px-2.5 py-1.5" : "px-3 py-2.5",
      ].join(" ")}
      style={{
        background: isActive ? `${C.coral}22` : "transparent",
        borderLeft: isActive ? `2px solid ${C.coral}` : "2px solid transparent",
      }}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="min-w-0 flex-1">
        <p
          className={["font-semibold truncate", compact ? "text-[11px] leading-snug" : "text-xs"].join(" ")}
          style={{ color: isActive ? C.white : "rgba(255,255,255,0.5)" }}
        >
          {chapter.label}
        </p>
        {chapter.sub.length > 0 && (
          <p
            className={["truncate", compact ? "text-[9px] leading-tight" : "text-[9px]"].join(" ")}
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {chapter.sub}
          </p>
        )}
      </div>
      {isActive && (
        <div
          className="shrink-0 w-1 h-4 rounded-full"
          style={{ background: `linear-gradient(180deg, ${C.coral}, ${C.gold})` }}
        />
      )}
    </button>
  </li>
);

const DocumentViewerLayout: React.FC<DocumentViewerLayoutProps> = ({
  profileName,
  contextTitle,
  brandLabel = "Premium Programme",
  appNavItems,
  chapters,
  activeChapter,
  onChapterClick,
  children,
  footerActions,
}) => {
  const { isDark } = useTheme();
  const shellTokens = getShellTokens(isDark);
  const sidebarCloseRef = useRef<(() => void) | null>(null);

  const [chapterPickerOpen, setChapterPickerOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });

  const closeChapterPicker = useCallback((): void => {
    setChapterPickerOpen(false);
  }, []);

  const openChapterPicker = useCallback((): void => {
    setChapterPickerOpen(true);
  }, []);

  const closeSidebar = useCallback((): void => {
    sidebarCloseRef.current?.();
  }, []);

  const handleChapterSelect = useCallback((id: string): void => {
    onChapterClick(id);
    closeSidebar();
    closeChapterPicker();
  }, [onChapterClick, closeSidebar, closeChapterPicker]);

  const activeChapterData = useMemo((): DocumentChapter | undefined => {
    return chapters.find((chapter) => chapter.id === activeChapter);
  }, [chapters, activeChapter]);

  const activeChapterIndex = useMemo((): number => {
    const index = chapters.findIndex((chapter) => chapter.id === activeChapter);
    return index >= 0 ? index : 0;
  }, [chapters, activeChapter]);

  const prevChapterIndexRef = useRef<number>(activeChapterIndex);
  const [chapterSlideDirection, setChapterSlideDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const previousIndex = prevChapterIndexRef.current;
    if (previousIndex !== activeChapterIndex) {
      setChapterSlideDirection(activeChapterIndex > previousIndex ? 1 : -1);
      prevChapterIndexRef.current = activeChapterIndex;
    }
  }, [activeChapterIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsDesktop(event.matches);
      if (event.matches) {
        setChapterPickerOpen(false);
      }
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => { mediaQuery.removeEventListener("change", handleChange); };
  }, []);

  useEffect(() => {
    if (!chapterPickerOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeChapterPicker();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [chapterPickerOpen, closeChapterPicker]);

  useEffect(() => {
    if (!chapterPickerOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [chapterPickerOpen, isDesktop]);

  const profileInitial = profileName.trim().length > 0
    ? profileName.trim().charAt(0).toUpperCase()
    : "?";

  const sheetBackground = shellTokens.sheetBg;

  const chapterNavSlot = chapters.length > 0 ? (
    <>
      <nav className="px-2.5 py-3" aria-label="Document chapters">
        <p
          className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 mb-2"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Contents
        </p>
        <ul className="space-y-0">
          {chapters.map((chapter) => (
            <ChapterNavButton
              key={chapter.id}
              chapter={chapter}
              isActive={activeChapter === chapter.id}
              onSelect={handleChapterSelect}
              compact={chapters.length > 12}
            />
          ))}
        </ul>
      </nav>
    </>
  ) : undefined;

  const sidebarFooter = (
    <>
      {footerActions !== undefined && (
        <div
          className="px-3 py-3 space-y-1.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {footerActions}
        </div>
      )}
      <div
        className="px-3 py-2.5 flex items-center gap-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
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

  const mobileTopExtra = chapters.length > 0 && activeChapterData !== undefined ? (
    <button
      type="button"
      onClick={openChapterPicker}
      className="w-full flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 min-w-0"
      aria-label="Browse document chapters"
      aria-expanded={chapterPickerOpen}
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
              key={activeChapter}
              initial={{
                y: chapterSlideDirection * CHAPTER_INDICATOR_SLIDE_PX,
                opacity: 0,
              }}
              animate={{ y: 0, opacity: 1 }}
              exit={{
                y: chapterSlideDirection * -CHAPTER_INDICATOR_SLIDE_PX,
                opacity: 0,
              }}
              transition={CHAPTER_INDICATOR_TRANSITION}
            >
              <p
                className="text-sm font-bold leading-tight truncate"
                style={{
                  color: shellTokens.contextBarText,
                  fontFamily: "Georgia,'Times New Roman',serif",
                }}
              >
                {activeChapterData.label}
              </p>
              <p
                className="text-[9px] truncate mt-0.5"
                style={{ color: shellTokens.contextBarMuted }}
              >
                {activeChapterData.sub}
                {" · "}
                {activeChapterIndex + 1} of {chapters.length}
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
        brandLabel={brandLabel}
        brandSubLabel={profileName}
        contextTitle={contextTitle}
        contextSubtitle={profileName}
        appNavItems={appNavItems}
        navSlot={chapterNavSlot}
        sidebarFooter={sidebarFooter}
        mobileTopExtra={mobileTopExtra}
        onSidebarCloseRef={sidebarCloseRef}
      >
        <div className="px-4 sm:px-8 py-8 max-w-4xl mx-auto w-full min-w-0 space-y-12">
          {children}
        </div>
      </CommandCentreShell>

      <AnimatePresence>
        {chapterPickerOpen && !isDesktop && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[60] md:hidden"
              style={{ background: shellTokens.sheetBackdrop }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeChapterPicker}
              aria-label="Close chapter picker"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Document chapters"
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
                      Playbook Contents
                    </p>
                  </div>
                  <p
                    className="text-base font-bold"
                    style={{
                      color: shellTokens.contextBarText,
                      fontFamily: "Georgia,'Times New Roman',serif",
                    }}
                  >
                    Jump to Chapter
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeChapterPicker}
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.08)",
                  }}
                  aria-label="Close chapters"
                >
                  {IconClose}
                </button>
              </div>

              <nav
                className="relative z-10 flex-1 overflow-y-auto px-3 py-3 [-webkit-overflow-scrolling:touch]"
                aria-label="Document chapters"
              >
                <ul className="space-y-0 pb-6">
                  {chapters.map((chapter) => (
                    <ChapterNavButton
                      key={chapter.id}
                      chapter={chapter}
                      isActive={activeChapter === chapter.id}
                      onSelect={handleChapterSelect}
                      compact={chapters.length > 12}
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

export default DocumentViewerLayout;
