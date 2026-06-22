import React from "react";
import { secondaryBrandGradientTextClass } from "../../../styles/typographyUi";

const MAX_HIGHLIGHT_PHRASES = 7;
const MIN_PHRASE_LENGTH = 3;
const MAX_PHRASE_LENGTH = 40;

/**
 * Escapes special characters for use in a RegExp.
 */
const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Adds a phrase when it is unique and within length bounds.
 */
const pushUniquePhrase = (phrases: string[], phrase: string): void => {
  const trimmed = phrase.trim();
  if (trimmed.length < MIN_PHRASE_LENGTH || trimmed.length > MAX_PHRASE_LENGTH) {
    return;
  }

  const isDuplicate = phrases.some(
    (existing) => existing.toLowerCase() === trimmed.toLowerCase()
  );
  if (!isDuplicate) {
    phrases.push(trimmed);
  }
};

/**
 * Splits an em-dash clause into comma / "and" segments for highlighting.
 */
const splitDashClauseSegments = (clause: string): string[] =>
  clause
    .split(",")
    .flatMap((segment) => segment.split(/\s+and\s+/i))
    .map((segment) => segment.trim())
    .filter((segment) => segment.length >= MIN_PHRASE_LENGTH);

/**
 * Pulls vivid noun phrases and editorial patterns from follow-on sentences.
 */
const extractFollowOnHighlightPhrases = (
  text: string,
  phrases: string[]
): void => {
  const atLimit = (): boolean => phrases.length >= MAX_HIGHLIGHT_PHRASES;

  const followOnSentences = text.split(/\.(?=\s|$)/).slice(1).join(". ");
  if (!followOnSentences.trim()) {
    return;
  }

  const editorialPatterns: readonly RegExp[] = [
    /\blies\s+(?:a|an)\s+([^,.\n—]+?)(?=\s+that|\s+who|\s+which|[.,\n—]|$)/gi,
    /\bdriven\s+by\s+([^,.\n—]+?)(?=\s+that|\s+who|\s+which|[.,\n—]|$)/gi,
    /\b(refuses\s+to\s+[^,.\n—]+?)(?=\s+that|\s+who|\s+which|[.,\n—]|$)/gi,
  ];

  for (const pattern of editorialPatterns) {
    if (atLimit()) {
      return;
    }

    for (const match of followOnSentences.matchAll(pattern)) {
      if (atLimit()) {
        return;
      }

      const phrase = match[1];
      if (phrase) {
        pushUniquePhrase(phrases, phrase);
      }
    }
  }

  const vividPhrasePatterns: readonly RegExp[] = [
    /\byour\s+([a-z]+(?:-[a-z]+)?)\s+([a-z]+(?:-[a-z]+)?)\b/gi,
    /\b(?:a|an)\s+([a-z]+(?:-[a-z]+)?)\s+([a-z]+(?:-[a-z]+)?)\b/gi,
  ];

  for (const pattern of vividPhrasePatterns) {
    if (atLimit()) {
      return;
    }

    for (const match of followOnSentences.matchAll(pattern)) {
      if (atLimit()) {
        return;
      }

      const adjective = match[1];
      const noun = match[2];
      if (adjective && noun) {
        pushUniquePhrase(phrases, `${adjective} ${noun}`);
      }
    }
  }
};

/**
 * Pulls editorial highlight phrases from a personality paragraph.
 * Uses identity opener, all em-dash clauses, and vivid follow-on phrases.
 */
export const extractPersonalityHighlightPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  const atLimit = (): boolean => phrases.length >= MAX_HIGHLIGHT_PHRASES;

  const identityPatterns: readonly RegExp[] = [
    /You are (?:a |an )?([^—.\n,]+)/i,
    /You were born to ([^—.\n,]+)/i,
    /You were born with (?:a |an )?([^—.\n,]+)/i,
    /You (?:exude|possess|embody|represent|carry|radiate) (?:a |an )?([^—.\n,]+)/i,
  ];

  for (const pattern of identityPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      pushUniquePhrase(phrases, match[1]);
      break;
    }
  }

  for (const dashMatch of text.matchAll(/—\s*([^.]+)/g)) {
    if (atLimit()) {
      break;
    }

    const segments = splitDashClauseSegments(dashMatch[1] ?? "");
    for (const segment of segments) {
      if (atLimit()) {
        break;
      }
      pushUniquePhrase(phrases, segment);
    }
  }

  extractFollowOnHighlightPhrases(text, phrases);

  if (phrases.length > 0) {
    return phrases.slice(0, MAX_HIGHLIGHT_PHRASES);
  }

  return extractListStyleHighlightPhrases(text);
};

/**
 * Pulls highlight phrases from list-style copy (commas, semicolons, "and").
 */
const extractListStyleHighlightPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  const firstSentence = text.split(/\.(?=\s|$)/)[0] ?? text;
  const segments = firstSentence
    .split(/[;,]/)
    .flatMap((segment) => segment.split(/\s+and\s+/i))
    .map((segment) => segment.replace(/^(or|and)\s+/i, "").trim())
    .filter((segment) => segment.length >= MIN_PHRASE_LENGTH);

  for (const segment of segments) {
    if (phrases.length >= MAX_HIGHLIGHT_PHRASES) {
      break;
    }
    pushUniquePhrase(phrases, segment);
  }

  return phrases.slice(0, MAX_HIGHLIGHT_PHRASES);
};

/**
 * Pulls 1–3 editorial highlight phrases from growth-tip copy.
 * Targets reframes, contrasts, core insights, and trailing action clauses.
 */
export const extractGrowthTipHighlightPhrases = (text: string): string[] => {
  const phrases: string[] = [];

  const dashMatch = text.match(/—\s*([^.]+)/);
  if (dashMatch?.[1]) {
    const segments = dashMatch[1]
      .split(",")
      .map((segment) => segment.trim())
      .filter((segment) => segment.length >= MIN_PHRASE_LENGTH);

    for (const segment of segments) {
      if (phrases.length >= MAX_HIGHLIGHT_PHRASES) {
        break;
      }
      pushUniquePhrase(phrases, segment);
    }
  }

  const reframeMatch = text.match(
    /\byou are not [^,]+,\s*you are (.+?)(?:\.|$)/i
  );
  if (reframeMatch?.[1]) {
    pushUniquePhrase(phrases, reframeMatch[1]);
  }

  const butMatch = text.match(/,\s*but\s+(.+?)(?:\.|$)/i);
  if (butMatch?.[1]) {
    pushUniquePhrase(phrases, butMatch[1]);
  }

  const becauseMatch = text.match(/\bbecause you can (.+?)(?:\.|$)/i);
  if (becauseMatch?.[1]) {
    pushUniquePhrase(phrases, becauseMatch[1]);
  }

  const yourInsightMatch = text.match(
    /^\s*Your\s+.+?\s+(?:is|are)\s+(?:the\s+)?([^,]+?)(?:,|\.|$)/i
  );
  if (yourInsightMatch?.[1] && !/^not\b/i.test(yourInsightMatch[1])) {
    pushUniquePhrase(phrases, yourInsightMatch[1]);
  }

  if (phrases.length < MAX_HIGHLIGHT_PHRASES) {
    const commaClauses = text.split(/,(?=\s)/);
    if (commaClauses.length > 1) {
      const trailingClause =
        commaClauses[commaClauses.length - 1]?.replace(/\.$/, "").trim() ?? "";
      const alreadyCaptured = phrases.some((phrase) =>
        trailingClause.toLowerCase().includes(phrase.toLowerCase())
      );

      if (
        trailingClause.length >= MIN_PHRASE_LENGTH &&
        !alreadyCaptured
      ) {
        pushUniquePhrase(phrases, trailingClause);
      }
    }
  }

  if (phrases.length > 0) {
    return phrases.slice(0, MAX_HIGHLIGHT_PHRASES);
  }

  const personalityPhrases = extractPersonalityHighlightPhrases(text);
  if (personalityPhrases.length > 0) {
    return personalityPhrases;
  }

  return extractListStyleHighlightPhrases(text);
};

/**
 * Pushes comma / "and" segments from an insight opener clause.
 */
const pushInsightClauseSegments = (phrases: string[], clause: string): void => {
  const segments = splitDashClauseSegments(clause).map((segment) =>
    segment.replace(/^(or|and)\s+/i, "").trim()
  );

  for (const segment of segments) {
    if (phrases.length >= MAX_HIGHLIGHT_PHRASES) {
      break;
    }
    if (segment.length >= MIN_PHRASE_LENGTH) {
      pushUniquePhrase(phrases, segment);
    }
  }
};

/**
 * Strips leading conjunctions and trailing verb clauses from nobleman list segments.
 */
const cleanNoblemanListSegment = (segment: string): string =>
  segment
    .replace(/^(or|and)\s+/i, "")
    .replace(/\s+(?:who|that|which)\s+.+$/i, "")
    .replace(/\s+(?:pushes?|helps?|gives?|supports?|moves?)\s+you.*$/i, "")
    .trim();

/**
 * Returns true when a list segment looks like a role/trait noun phrase (not a full clause).
 */
const isNoblemanListSegment = (segment: string): boolean => {
  if (segment.length < MIN_PHRASE_LENGTH) {
    return false;
  }
  if (/^(they|this|if|when|your|not)\b/i.test(segment)) {
    return false;
  }
  if (
    /\b(?:through|who|gives|helps|pushes|supports|moves|can|is|are|was|were|see|build|break)\b/i.test(
      segment
    )
  ) {
    return false;
  }
  return true;
};

/**
 * Pushes comma / "and" segments from a nobleman role-or-trait clause.
 */
const pushNoblemanClauseSegments = (
  phrases: string[],
  clause: string
): void => {
  const segments = clause
    .split(",")
    .flatMap((segment) => segment.split(/\s+and\s+/i))
    .map(cleanNoblemanListSegment)
    .filter(isNoblemanListSegment);

  for (const segment of segments) {
    if (phrases.length >= MAX_HIGHLIGHT_PHRASES) {
      break;
    }
    pushUniquePhrase(phrases, segment);
  }
};

/**
 * Pulls highlight phrases from nobleman profile characteristics copy.
 * Handles semicolon/comma role lists, "They guide you through…", and vivid descriptors.
 */
export const extractNoblemanHighlightPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  const atLimit = (): boolean => phrases.length >= MAX_HIGHLIGHT_PHRASES;

  const firstSentence = text.split(/\.(?=\s|$)/)[0] ?? text;
  const openingClauses = firstSentence.split(";").map((clause) => clause.trim());

  for (const clause of openingClauses) {
    if (atLimit()) {
      break;
    }
    pushNoblemanClauseSegments(phrases, clause);
  }

  const noblemanActionPatterns: readonly RegExp[] = [
    /They guide you through ([^.]+)/i,
    /They help you (?:get things done |see |build )?through ([^.]+)/i,
    /They (?:open doors|support you) (?:for you )?through ([^.]+)/i,
    /(?:helps?|pushes?) you (?:to |through )([^.]+)/i,
    /gives? you ([^.]+?)(?:\s+through|\s+who|\s+that|\.|$)/i,
    /open doors through ([^.]+)/i,
    /Great at ([^.]+)/i,
    /(?:Excel|Excels) in ([^.]+)/i,
  ];

  for (const pattern of noblemanActionPatterns) {
    if (atLimit()) {
      break;
    }

    const match = text.match(pattern);
    if (match?.[1]) {
      pushNoblemanClauseSegments(phrases, match[1]);
    }
  }

  const descriptorPatterns: readonly RegExp[] = [
    /your Nobleman is ([^.]+)/i,
    /someone (?:with|who) ([^.]+)/i,
    /This is (?:the type of person |someone )who ([^.]+)/i,
    /This is (?:a |an )?([^—.\n,]+)/i,
    /(?:^|[.;]\s*)([^.;]+?)\s+who (?:gives|helps|opens|can)/i,
  ];

  for (const pattern of descriptorPatterns) {
    if (atLimit()) {
      break;
    }

    const match = text.match(pattern);
    if (match?.[1]) {
      const descriptor = match[1]
        .replace(/\s+who\s+can\s+.+$/i, "")
        .replace(/\s+who\s+.+$/i, "")
        .trim();
      if (descriptor.includes(",") || descriptor.includes(" or ")) {
        pushNoblemanClauseSegments(phrases, descriptor);
      } else {
        pushUniquePhrase(phrases, descriptor);
      }
    }
  }

  for (const dashMatch of text.matchAll(/—\s*([^.]+)/g)) {
    if (atLimit()) {
      break;
    }
    pushNoblemanClauseSegments(phrases, dashMatch[1] ?? "");
  }

  if (phrases.length > 0) {
    return phrases.slice(0, MAX_HIGHLIGHT_PHRASES);
  }

  return extractListStyleHighlightPhrases(text);
};

/**
 * Pulls highlight phrases from wealth / insight summary copy.
 * Handles "Natural ability to…", "Strong at…", comma-separated strengths, and em-dash clauses.
 */
export const extractInsightHighlightPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  const atLimit = (): boolean => phrases.length >= MAX_HIGHLIGHT_PHRASES;

  const insightOpenerPatterns: readonly RegExp[] = [
    /Natural ability to ([^.]+)/i,
    /Strong at ([^.]+)/i,
    /Excel in ([^.]+)/i,
    /Win through ([^.]+)/i,
    /Monetize ([^.]+)/i,
  ];

  for (const pattern of insightOpenerPatterns) {
    if (atLimit()) {
      break;
    }

    const match = text.match(pattern);
    if (match?.[1]) {
      pushInsightClauseSegments(phrases, match[1]);
    }
  }

  for (const dashMatch of text.matchAll(/—\s*([^.]+)/g)) {
    if (atLimit()) {
      break;
    }

    pushInsightClauseSegments(phrases, dashMatch[1] ?? "");
  }

  if (phrases.length > 0) {
    return phrases.slice(0, MAX_HIGHLIGHT_PHRASES);
  }

  return extractListStyleHighlightPhrases(text);
};

type HighlightPhraseExtractor = (text: string) => string[];

export type RenderPersonalityTextOptions = {
  gradientClassName?: string;
};

/**
 * Wraps extracted phrases in the secondary brand clip-text gradient.
 */
const renderTextWithHighlightPhrases = (
  text: string,
  extractPhrases: HighlightPhraseExtractor,
  options: RenderPersonalityTextOptions = {}
): React.ReactNode => {
  const phrases = extractPhrases(text);
  if (phrases.length === 0) {
    return text;
  }

  const sortedPhrases = [...phrases].sort((a, b) => b.length - a.length);
  const pattern = sortedPhrases.map(escapeRegExp).join("|");
  const regex = new RegExp(`(${pattern})`, "g");
  const parts = text.split(regex);

  const spanClassName = [
    secondaryBrandGradientTextClass,
    options.gradientClassName ?? "font-semibold italic",
  ]
    .filter(Boolean)
    .join(" ");

  return parts.map((part, index) => {
    const isHighlight = sortedPhrases.some(
      (phrase) => phrase.toLowerCase() === part.toLowerCase()
    );

    if (isHighlight) {
      return (
        <span key={`highlight-${index}`} className={spanClassName}>
          {part}
        </span>
      );
    }

    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
};

/**
 * Personality copy with auto-detected gradient keyword highlights.
 */
export const renderPersonalityTextWithHighlights = (
  text: string,
  options: RenderPersonalityTextOptions = {}
): React.ReactNode =>
  renderTextWithHighlightPhrases(text, extractPersonalityHighlightPhrases, options);

/**
 * Growth-tip copy with auto-detected gradient keyword highlights.
 */
export const renderGrowthTipTextWithHighlights = (
  text: string,
  options: RenderPersonalityTextOptions = {}
): React.ReactNode =>
  renderTextWithHighlightPhrases(text, extractGrowthTipHighlightPhrases, options);

/**
 * Wealth / insight summary copy with auto-detected gradient keyword highlights.
 */
export const renderInsightTextWithHighlights = (
  text: string,
  options: RenderPersonalityTextOptions = {}
): React.ReactNode =>
  renderTextWithHighlightPhrases(text, extractInsightHighlightPhrases, options);

/**
 * Nobleman profile characteristics with auto-detected gradient keyword highlights.
 */
export const renderNoblemanTextWithHighlights = (
  text: string,
  options: RenderPersonalityTextOptions = {}
): React.ReactNode =>
  renderTextWithHighlightPhrases(text, extractNoblemanHighlightPhrases, options);

export type PersonalityDescriptionParagraphProps = {
  text: string;
  prominent?: boolean;
};

/**
 * Personality copy with auto-detected gradient keyword highlights.
 */
export const PersonalityDescriptionParagraph: React.FC<
  PersonalityDescriptionParagraphProps
> = ({ text, prominent = false }) => {
  return (
    <p
      className={
        prominent
          ? "text-base font-medium leading-relaxed text-gray-900 dark:text-white sm:text-lg"
          : "text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      }
    >
      {renderPersonalityTextWithHighlights(text)}
    </p>
  );
};
