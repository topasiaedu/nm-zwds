import puppeteer from "puppeteer";

/**
 * Total budget for launch, navigation, wait-for-ready, and PDF render.
 * Must cover {@link GOTO_TIMEOUT_MS} + {@link WAIT_FOR_PDF_PAGE_MS} + settle + {@link PAGE_PDF_CDPTIMEOUT_MS}.
 */
const DEFAULT_MAX_JOB_MS = 270_000;

/** `page.goto` idle wait; increase if flaky on slow SPAs. */
const GOTO_TIMEOUT_MS = 60_000;
/**
 * Wait for React print route: new markers (`data-pdf-*`) or legacy `.print-cover-page`
 * (deployed frontends may not have the PrintResult.tsx marker patch yet).
 */
const WAIT_FOR_PDF_PAGE_MS = 75_000;
/** Extra time for chart/SVG/fonts after the DOM signals ready. */
const PDF_SETTLE_AFTER_READY_MS = 3_500;
/**
 * `page.pdf()` defaults to 30s in Puppeteer; large print layouts (charts, backgrounds)
 * often exceed that and throw TimeoutError before our outer job timeout runs.
 */
const PAGE_PDF_CDPTIMEOUT_MS = 120_000;

/**
 * Thrown when the PDF job exceeds {@link DEFAULT_MAX_JOB_MS}.
 */
export class PdfTimeoutError extends Error {
  constructor() {
    super("PDF_GENERATION_TIMEOUT");
    this.name = "PdfTimeoutError";
  }
}

/**
 * Print page reported an error (e.g. profile missing) or never reached ready state.
 */
export class PdfPageContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfPageContentError";
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new PdfTimeoutError());
    }, ms);
    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err: unknown) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

/**
 * Renders a print-ready page at `url` to a PDF buffer using headless Chromium.
 */
export async function renderPdfFromUrl(url: string): Promise<Buffer> {
  const target = new URL(url);
  const redactedTarget = `${target.origin}${target.pathname}`;
  const executablePathRaw = process.env.PUPPETEER_EXECUTABLE_PATH;
  const executablePath =
    executablePathRaw !== undefined && executablePathRaw !== ""
      ? executablePathRaw
      : undefined;

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    console.info(`pdf-server: launching chromium for ${redactedTarget}`);
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const launched = browser;

    return await withTimeout(
      (async () => {
        const page = await launched.newPage();
        page.on("console", (msg) => {
          const text = msg.text();
          if (msg.type() === "error") {
            console.error(`pdf-server: page console [error]: ${text}`);
          }
        });
        page.on("pageerror", (err) => {
          console.error("pdf-server: page uncaught error:", err);
        });
        console.info(`pdf-server: navigating to print page ${redactedTarget}`);
        await page.goto(url, {
          // `networkidle2` avoids hanging forever on pages with persistent background polling.
          waitUntil: "networkidle2",
          timeout: GOTO_TIMEOUT_MS,
        });
        try {
          await page.waitForFunction(
            () => {
              const w = globalThis as unknown as {
                document: { querySelector: (sel: string) => { textContent: string | null } | null };
              };
              return (
                w.document.querySelector("[data-pdf-render-ready=\"true\"]") !== null ||
                w.document.querySelector("[data-pdf-error=\"true\"]") !== null ||
                w.document.querySelector(".print-cover-page") !== null
              );
            },
            { timeout: WAIT_FOR_PDF_PAGE_MS }
          );
        } catch {
          throw new PdfPageContentError(
            "Print page did not finish loading in time. Check the print URL, Supabase env on the app host, and browser console logs above."
          );
        }
        const pageState = await page.evaluate(() => {
          const w = globalThis as unknown as {
            document: { querySelector: (sel: string) => { textContent: string | null } | null };
          };
          const errEl = w.document.querySelector("[data-pdf-error=\"true\"]");
          if (errEl !== null) {
            const text = errEl.textContent?.trim() ?? "";
            return { kind: "error" as const, message: text.length > 0 ? text : "Print page reported an error." };
          }
          if (w.document.querySelector("[data-pdf-render-ready=\"true\"]") !== null) {
            return { kind: "ready" as const, message: "" };
          }
          if (w.document.querySelector(".print-cover-page") !== null) {
            return { kind: "legacy_ready" as const, message: "" };
          }
          return { kind: "unknown" as const, message: "Print page did not expose a ready or error marker." };
        });
        if (pageState.kind === "error") {
          throw new PdfPageContentError(pageState.message);
        }
        if (pageState.kind !== "ready" && pageState.kind !== "legacy_ready") {
          throw new PdfPageContentError(pageState.message);
        }
        await page.evaluate(async () => {
          const w = globalThis as typeof globalThis & {
            document?: { fonts?: { ready: Promise<unknown> } };
          };
          const fonts = w.document?.fonts;
          if (fonts !== undefined) {
            try {
              await fonts.ready;
            } catch {
              /* no-op */
            }
          }
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, PDF_SETTLE_AFTER_READY_MS);
        });
        console.info(`pdf-server: generating PDF bytes for ${redactedTarget}`);
        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          timeout: PAGE_PDF_CDPTIMEOUT_MS,
          margin: {
            top: "12mm",
            bottom: "12mm",
            left: "10mm",
            right: "10mm",
          },
        });
        console.info(`pdf-server: PDF generated for ${redactedTarget}`);
        return Buffer.from(pdf);
      })(),
      DEFAULT_MAX_JOB_MS
    );
  } finally {
    if (browser !== undefined) {
      await browser.close();
    }
  }
}
