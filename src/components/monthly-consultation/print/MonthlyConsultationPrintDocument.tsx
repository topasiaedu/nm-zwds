/**
 * Monthly Consultation print document: auth, month params, chapter composition.
 * Puppeteer waits on data-pdf-render-ready="true".
 */

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase-client";
import type { Profile } from "../../../context/ProfileContext";
import { fetchPrintProfile } from "../../alignment-advantage/data/fetchPrintProfile";
import { useMonthlyConsultationData } from "../data/useMonthlyConsultationData";
import { MonthlyConsultationBody } from "../chapters/MonthlyConsultationChapters";
import { C } from "../../alignment-advantage/shared/constants";
import { PRINT_STYLES } from "../../alignment-advantage/print/printStyles";
import { getLiuMonthAnchorFromLocalDate } from "../../../utils/destiny-navigator/palace-resolver";

/**
 * Parse a positive integer query param within an inclusive range.
 */
const parseBoundedInt = (
  raw: string | null,
  fallback: number,
  min: number,
  max: number
): number => {
  if (raw === null || raw.trim().length === 0) {
    return fallback;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) {
    return fallback;
  }
  return Math.trunc(n);
};

const MonthlyConsultationPrintDocument: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pdfToken = searchParams.get("pdfToken");
  const anchor = getLiuMonthAnchorFromLocalDate();
  const lunarMonth = parseBoundedInt(
    searchParams.get("lunarMonth"),
    anchor.lunarMonth,
    1,
    12
  );
  const solarYear = parseBoundedInt(
    searchParams.get("solarYear"),
    anchor.solarYear,
    1900,
    2100
  );

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printTriggered = useRef(false);

  const { bundle, error: dataError } = useMonthlyConsultationData(
    profile,
    lunarMonth,
    solarYear
  );

  useEffect(() => {
    if (pdfToken === null || pdfToken === "") {
      return;
    }
    void (async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser(pdfToken);
      if (userError !== null || userData.user === null) {
        return;
      }
      const existing = await supabase.auth.getSession();
      const refreshToken = existing.data.session?.refresh_token;
      if (refreshToken !== undefined && refreshToken !== "") {
        await supabase.auth.setSession({
          access_token: pdfToken,
          refresh_token: refreshToken,
        });
      }
    })();
  }, [pdfToken]);

  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      const sessionResult = await supabase.auth.getSession();
      const sessionToken = sessionResult.data.session?.access_token ?? null;
      const bearer = pdfToken !== null && pdfToken !== "" ? pdfToken : sessionToken;

      if (bearer === null) {
        if (!cancelled) {
          setError("Sign in or open this page with a valid pdfToken query parameter.");
          setLoading(false);
        }
        return;
      }

      const fetchedProfile = await fetchPrintProfile(bearer);
      if (cancelled) {
        return;
      }

      if (fetchedProfile === null) {
        setError("Profile not found or access denied.");
        setLoading(false);
        return;
      }

      setProfile(fetchedProfile);
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pdfToken]);

  useEffect(() => {
    const isPuppeteer = searchParams.get("puppeteer") === "1";
    if (
      !loading
      && error === null
      && profile !== null
      && bundle !== null
      && !isPuppeteer
      && !printTriggered.current
    ) {
      printTriggered.current = true;
      const id = setTimeout(() => {
        window.print();
      }, 800);
      return () => {
        clearTimeout(id);
      };
    }
    return undefined;
  }, [loading, error, profile, bundle, searchParams]);

  const ready = !loading && error === null && dataError === null && bundle !== null;

  return (
    <div
      className="print-root"
      style={{
        background: C.cream,
        color: C.navy,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <style>{PRINT_STYLES}</style>

      {loading && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "96px 0" }}
          data-pdf-loading="true"
          className="print-hide"
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="inline-block h-10 w-10 animate-spin rounded-full"
              style={{ border: `3px solid ${C.coral}`, borderTopColor: "transparent" }}
            />
            <p style={{ marginTop: 16, color: C.coral, fontSize: 14 }}>
              Preparing your monthly consultation…
            </p>
          </div>
        </div>
      )}

      {!loading && (error !== null || dataError !== null) && (
        <div
          style={{
            border: "1px solid #f87171",
            background: "#fef2f2",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
          data-pdf-error="true"
          className="print-hide"
        >
          <p style={{ color: "#991b1b" }}>{error ?? dataError}</p>
        </div>
      )}

      {ready && bundle !== null && (
        <div
          data-pdf-render-ready="true"
          data-mc-print-body=""
          style={{ display: "flex", flexDirection: "column", gap: 0, padding: 0 }}
        >
          <MonthlyConsultationBody bundle={bundle} />
        </div>
      )}
    </div>
  );
};

export { MonthlyConsultationPrintDocument };
