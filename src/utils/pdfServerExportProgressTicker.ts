/**
 * Options for {@link createPdfServerExportProgressTicker}.
 */
export interface PdfServerExportProgressTickerOptions {
  /** Initial displayed percent when the ticker starts (e.g. 10). */
  readonly startPercent: number;
  /** Asymptotic cap while the server request is still pending (must be less than 100). */
  readonly maxWhilePending: number;
  /** Interval between UI updates in milliseconds. */
  readonly tickMs: number;
  /**
   * Time constant for progress curve 1 - exp(-elapsed / timeConstantMs); larger values creep more slowly.
   */
  readonly timeConstantMs: number;
  /** Called on each tick with monotonic non-decreasing percentage. */
  readonly onTick: (args: {
    readonly percentage: number;
    readonly elapsedMs: number;
  }) => void;
}

/**
 * Sensible defaults for server-side PDF export (long-running fetch with no byte-level progress).
 */
export const DEFAULT_PDF_SERVER_EXPORT_TICKER: Pick<
  PdfServerExportProgressTickerOptions,
  "startPercent" | "maxWhilePending" | "tickMs" | "timeConstantMs"
> = {
  startPercent: 10,
  maxWhilePending: 90,
  tickMs: 400,
  timeConstantMs: 40_000,
};

/**
 * Creates a timer that simulates forward progress during a long-running server PDF export,
 * so the progress bar and modal checklist do not appear stuck at the first step.
 */
export function createPdfServerExportProgressTicker(
  options: PdfServerExportProgressTickerOptions
): { readonly start: () => void; readonly stop: () => void } {
  const {
    startPercent,
    maxWhilePending,
    tickMs,
    timeConstantMs,
    onTick,
  } = options;

  if (maxWhilePending >= 100 || maxWhilePending < startPercent) {
    throw new Error(
      "createPdfServerExportProgressTicker: maxWhilePending must be < 100 and >= startPercent"
    );
  }

  let intervalId: ReturnType<typeof setInterval> | undefined;
  let startedAtMs: number | undefined;
  let lastShownPercent = startPercent;

  /**
   * Maps elapsed time to a target percent that approaches maxWhilePending asymptotically.
   */
  const computeTargetPercent = (elapsedMs: number): number => {
    const span = maxWhilePending - startPercent;
    const factor = 1 - Math.exp(-elapsedMs / timeConstantMs);
    return startPercent + span * factor;
  };

  return {
    start: (): void => {
      lastShownPercent = startPercent;
      startedAtMs = Date.now();
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
      onTick({ percentage: startPercent, elapsedMs: 0 });
      intervalId = setInterval(() => {
        if (startedAtMs === undefined) {
          return;
        }
        const elapsedMs = Date.now() - startedAtMs;
        const target = computeTargetPercent(elapsedMs);
        const rounded = Math.round(target);
        const next = Math.max(
          lastShownPercent,
          Math.min(maxWhilePending, rounded)
        );
        lastShownPercent = next;
        onTick({ percentage: next, elapsedMs });
      }, tickMs);
    },
    stop: (): void => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
      startedAtMs = undefined;
    },
  };
}
