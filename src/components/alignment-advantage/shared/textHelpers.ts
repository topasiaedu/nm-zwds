/** Returns the first N sentences from prose copy. */
export function firstSentences(text: string, count: number): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) return "";
  const parts = trimmed.match(/[^.!?]+[.!?]+/g);
  if (parts === null) return trimmed;
  return parts.slice(0, count).join(" ").trim();
}
