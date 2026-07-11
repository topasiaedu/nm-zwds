/**
 * CommandCentreShell — shared full-viewport layout for authenticated product pages.
 *
 * Dark sidebar (~230px), mobile drawer, cream main area.
 * Mobile: sticky context header (hamburger + page title or section picker).
 * Desktop: no sticky context bar — sidebar only; appearance/sign-out on /settings.
 * Report-specific scroll-spy and section sheets live in ReportViewerLayout.
 */

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { getShellTokens } from "../../styles/shellTheme";
import { C } from "../alignment-advantage/shared/constants";
import { Sparkle } from "../alignment-advantage/shared/Sparkle";
import type { AppNavItem, CommandCentreShellProps } from "./commandCentreTypes";

const MOBILE_MEDIA_QUERY = "(min-width: 768px)";

const DOT_TEXTURE_STYLE: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
};

const IconMenu = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconClose = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SidebarNavLink: React.FC<AppNavItem & { onNavigate?: () => void }> = ({
  to,
  label,
  icon,
  active = false,
  badge,
  onNavigate,
}) => (
  <Link
    to={to}
    onClick={onNavigate}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
    style={{
      background: active
        ? `linear-gradient(90deg, ${C.coral}33, ${C.coral}11)`
        : "transparent",
      color: active ? C.coral : "rgba(255,255,255,0.48)",
      borderLeft: active ? `2px solid ${C.coral}` : "2px solid transparent",
    }}
    onMouseEnter={(event) => {
      if (!active) {
        event.currentTarget.style.color = "rgba(255,255,255,0.88)";
        event.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }
    }}
    onMouseLeave={(event) => {
      if (!active) {
        event.currentTarget.style.color = "rgba(255,255,255,0.48)";
        event.currentTarget.style.background = "transparent";
      }
    }}
  >
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span className="text-xs font-semibold truncate flex-1">{label}</span>
    {badge !== undefined && (
      <span
        className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
        style={{ background: C.coral, color: C.white }}
      >
        {badge}
      </span>
    )}
  </Link>
);

const CommandCentreShell: React.FC<CommandCentreShellProps> = ({
  brandLabel,
  brandSubLabel,
  appNavItems,
  contextTitle,
  contextSubtitle,
  sidebarFooter,
  mobileTopExtra,
  navSlot,
  onSidebarCloseRef,
  lockMainScroll = false,
  children,
}) => {
  const { isDark } = useTheme();
  const shellTokens = getShellTokens(isDark);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });

  const closeSidebar = useCallback((): void => {
    setSidebarOpen(false);
  }, []);

  const openSidebar = useCallback((): void => {
    setSidebarOpen(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsDesktop(event.matches);
      if (event.matches) {
        setSidebarOpen(false);
      }
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => { mediaQuery.removeEventListener("change", handleChange); };
  }, []);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); };
  }, [sidebarOpen, isDesktop, closeSidebar]);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen, isDesktop]);

  useEffect(() => {
    if (onSidebarCloseRef === undefined) return;

    onSidebarCloseRef.current = closeSidebar;
    return () => {
      onSidebarCloseRef.current = null;
    };
  }, [closeSidebar, onSidebarCloseRef]);

  const sidebarBackground = `
    linear-gradient(180deg,
      ${C.navy}      0%,
      ${C.navyMid}   55%,
      ${C.coralDark}88 85%,
      ${C.coral}55   100%
    )
  `;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        zIndex: 40,
        overflow: "hidden",
        background: C.navyDeep,
      }}
    >
      {sidebarOpen && !isDesktop && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 md:hidden"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={[
          "shrink-0 flex flex-col overflow-hidden",
          "fixed md:relative inset-y-0 left-0 z-50 md:z-auto",
          "w-[min(280px,85vw)] md:w-[230px]",
          "transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        style={{
          height: "100%",
          background: sidebarBackground,
        }}
        aria-hidden={!isDesktop && !sidebarOpen}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            ...DOT_TEXTURE_STYLE,
          }}
        />

        <div
          className="relative z-10 px-5 pt-7 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              color: "rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.08)",
            }}
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            {IconClose}
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkle size={9} color={C.coral} />
            <p
              className="text-[8px] font-bold uppercase tracking-[0.28em]"
              style={{ color: C.coral }}
            >
              {brandLabel}
            </p>
          </div>
          <p
            className="text-base font-bold leading-tight mb-0.5"
            style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}
          >
            紫微斗数
          </p>
          <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
            {brandSubLabel}
          </p>
        </div>

        <nav
          className="relative z-10 px-3 py-4"
          style={{ borderBottom: navSlot !== undefined ? "1px solid rgba(255,255,255,0.07)" : undefined }}
          aria-label="App navigation"
        >
          <p
            className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 mb-2.5"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Navigation
          </p>
          <ul className="space-y-0.5">
            {appNavItems.map((item) => (
              <li key={item.to}>
                <SidebarNavLink {...item} onNavigate={closeSidebar} />
              </li>
            ))}
          </ul>
        </nav>

        {navSlot !== undefined && (
          <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
            {navSlot}
          </div>
        )}

        {sidebarFooter !== undefined && (
          <div
            className="relative z-10 mt-auto"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {sidebarFooter}
          </div>
        )}
      </aside>

      <main
        data-shell-scroll-root=""
        className={[
          "isolate flex-1 min-w-0 w-full overflow-x-hidden",
          lockMainScroll ? "overflow-hidden flex flex-col min-h-0" : "overflow-y-auto",
        ].join(" ")}
        style={{
          height: "100%",
          background: shellTokens.mainBackground,
        }}
      >
        {/* Mobile-only: cohesive context header (hamburger + title or section picker) */}
        <div
          className="sticky top-0 z-30 md:hidden"
          style={{
            background: shellTokens.contextBarBg,
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-3 px-3 py-2.5 min-w-0">
            <button
              type="button"
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl"
              style={{
                color: "rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onClick={openSidebar}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              {IconMenu}
            </button>

            {mobileTopExtra !== undefined ? (
              <div className="flex-1 min-w-0">
                {mobileTopExtra}
              </div>
            ) : contextTitle !== undefined && contextTitle.length > 0 ? (
              <div className="flex-1 min-w-0 flex items-center gap-2.5">
                <div
                  className="shrink-0 w-0.5 self-stretch rounded-full min-h-[2rem]"
                  style={{ background: `linear-gradient(180deg, ${C.coral}, ${C.gold})` }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p
                    className="text-sm font-bold leading-tight truncate"
                    style={{
                      color: shellTokens.contextBarText,
                      fontFamily: "Georgia,'Times New Roman',serif",
                    }}
                  >
                    {contextTitle}
                  </p>
                  {contextSubtitle !== undefined && contextSubtitle.length > 0 && (
                    <p
                      className="text-[9px] truncate mt-0.5"
                      style={{ color: shellTokens.contextBarMuted }}
                    >
                      {contextSubtitle}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Modest top inset so content clears the mobile header / viewport edge.
            When lockMainScroll is on, fill remaining height so children can flex. */}
        <div
          className={[
            lockMainScroll
              ? "flex flex-col flex-1 min-h-0"
              : "pt-4 md:pt-6",
          ].join(" ")}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default CommandCentreShell;
export type { AppNavItem, CommandCentreShellProps } from "./commandCentreTypes";
