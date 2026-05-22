export interface RegexMatch {
  fullMatch: string;
  index: number;
  groups: string[];
  namedGroups: Record<string, string>;
}

export interface RegexResult {
  success: true;
  matches: RegexMatch[];
  totalMatches: number;
  executionTimeMs: number;
}

export interface RegexError {
  success: false;
  error: string;
}

export type RegexTestResult = RegexResult | RegexError;

export function testRegex(
  pattern: string,
  flags: string,
  testString: string,
): RegexTestResult {
  if (!pattern) {
    return { success: true, matches: [], totalMatches: 0, executionTimeMs: 0 };
  }

  try {
    const re = new RegExp(pattern, flags);
    const start = performance.now();
    const matches: RegexMatch[] = [];

    if (flags.includes("g")) {
      let match: RegExpExecArray | null;
      let safety = 0;
      while ((match = re.exec(testString)) !== null && safety < 10000) {
        matches.push(matchToResult(match));
        if (match[0].length === 0) re.lastIndex++;
        safety++;
      }
    } else {
      const match = re.exec(testString);
      if (match) matches.push(matchToResult(match));
    }

    const executionTimeMs = performance.now() - start;
    return {
      success: true,
      matches,
      totalMatches: matches.length,
      executionTimeMs,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof SyntaxError ? e.message : "Invalid regular expression",
    };
  }
}

function matchToResult(match: RegExpExecArray): RegexMatch {
  return {
    fullMatch: match[0],
    index: match.index,
    groups: match.slice(1),
    namedGroups: (match.groups as Record<string, string>) ?? {},
  };
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const regexExamples = {
  pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
  flags: "g",
  testString:
    "Dates: 2024-01-15, 2024-06-30, and 2025-12-25 are important dates.",
};
