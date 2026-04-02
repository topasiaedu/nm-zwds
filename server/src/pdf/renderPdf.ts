import puppeteer from "puppeteer";

/** Total budget for launch, navigation, and PDF render (Prompt 3: ~90s). */
const DEFAULT_MAX_JOB_MS = 90_000;

/** `page.goto` idle wait; increase if flaky on slow SPAs. */
const GOTO_TIMEOUT_MS = 60_000;
const WAIT_FOR_PRINT_LAYOUT_MS = 45_000;

/**
 * Thrown when the PDF job exceeds {@link DEFAULT_MAX_JOB_MS}.
 */
export class PdfTimeoutError extends Error {
  constructor() {
    super("PDF_GENERATION_TIMEOUT");
    this.name = "PdfTimeoutError";
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
        console.info(`pdf-server: navigating to print page ${redactedTarget}`);
        await page.goto(url, {
          // `networkidle2` avoids hanging forever on pages with persistent background polling.
          waitUntil: "networkidle2",
          timeout: GOTO_TIMEOUT_MS,
        });
        /**
         * SPA: wait for print layout (cover + chart) and fonts so SVG zodiac / text render
         * before `page.pdf` (avoids blank heroes and missing icons).
         */
        try {
          await page.waitForSelector(".print-cover-page", { timeout: WAIT_FOR_PRINT_LAYOUT_MS });
        } catch {
          /* Route may omit cover; still attempt PDF */
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
          setTimeout(resolve, 1500);
        });
        console.info(`pdf-server: generating PDF bytes for ${redactedTarget}`);
        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
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
