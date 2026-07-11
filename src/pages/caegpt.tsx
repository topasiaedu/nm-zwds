import React from "react";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/PageTransition";
import CommandCentreShell from "../components/layout/CommandCentreShell";
import { useAppNavItems } from "../hooks/useAppNavItems";
import { C } from "../components/alignment-advantage/shared/constants";
import { Sparkle } from "../components/alignment-advantage/shared/Sparkle";

/**
 * Production chatbot host used when the sibling chatbot-gen-client is not running.
 * Override with REACT_APP_CHAT_WIDGET_ORIGIN (e.g. "http://localhost:3001") only
 * when you intentionally run both projects locally.
 */
const DEFAULT_CHAT_WIDGET_ORIGIN = "https://chatbot-gen-client.vercel.app";

/**
 * Resolves the chat-widget origin.
 * Empty / whitespace env values fall back to production so local dual-project
 * setup is opt-in, not required for AI Wealth Assistant to load.
 */
const resolveChatWidgetOrigin = (): string => {
  const fromEnv = process.env.REACT_APP_CHAT_WIDGET_ORIGIN?.trim();
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv;
  }
  return DEFAULT_CHAT_WIDGET_ORIGIN;
};

const CHAT_WIDGET_ORIGIN = resolveChatWidgetOrigin();

const CHAT_WIDGET_BOT_ID = "3ce543bc-8767-4a05-9836-d1f21e2749c1";

/**
 * CAEGPT component - AI Chat Assistant page
 * Embeds the Destiny Wealth Navigator chat widget full-bleed in the shell main area
 * (no card chrome, padding, or outer privacy footer that would clip height).
 */
const CAEGPT: React.FC = () => {
  const { user } = useAuth();
  const { items: appNavItems } = useAppNavItems({ activeKey: "ai-wealth-assistant" });

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const userInitial = displayName.trim().length > 0
    ? displayName.trim().charAt(0).toUpperCase()
    : "?";

  const emailQuery =
    user?.email !== undefined && user.email.length > 0
      ? `?email=${encodeURIComponent(user.email)}`
      : "";

  const chatWidgetSrc = `${CHAT_WIDGET_ORIGIN}/chat-widget/${CHAT_WIDGET_BOT_ID}${emailQuery}`;

  const sidebarFooter = (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-white/30"
          style={{ background: "rgba(255,255,255,0.15)", color: C.white }}
        >
          {userInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{displayName}</p>
          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
            {user?.email ?? ""}
          </p>
        </div>
        <Sparkle size={10} color="rgba(255,255,255,0.60)" />
      </div>
    </div>
  );

  return (
    <PageTransition>
      <CommandCentreShell
        brandLabel="Purple Star Astrology"
        brandSubLabel="AI Wealth Assistant"
        contextTitle="AI Wealth Assistant"
        contextSubtitle="Chat"
        appNavItems={appNavItems}
        sidebarFooter={sidebarFooter}
        lockMainScroll
      >
        {/*
          Full-bleed iframe: shell main (locked) → this flex column → iframe.
          No card, padding, or footer outside the widget — chat owns the content area.
        */}
        <div className="relative flex flex-col flex-1 min-h-0 h-full w-full">
          <iframe
            src={chatWidgetSrc}
            title="Destiny Wealth Navigator Chat Assistant"
            className="w-full h-full min-h-0 flex-1 border-0 block"
            style={{
              border: "none",
              width: "100%",
              height: "100%",
              minHeight: 0,
              display: "block",
            }}
          />
        </div>
      </CommandCentreShell>
    </PageTransition>
  );
};

export default CAEGPT;
