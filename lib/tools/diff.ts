export interface DiffChange {
  type: "equal" | "added" | "removed";
  value: string;
  lineNumber?: { left?: number; right?: number };
}

export interface DiffResult {
  changes: DiffChange[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}

/**
 * Simple line-based diff using the LCS (Longest Common Subsequence) approach.
 * For a production app, consider importing a library like `diff` for O(ND).
 */
export function computeLineDiff(left: string, right: string): DiffResult {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");

  const lcs = longestCommonSubsequence(leftLines, rightLines);

  const changes: DiffChange[] = [];
  let li = 0;
  let ri = 0;
  let leftNum = 1;
  let rightNum = 1;
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const common of lcs) {
    while (li < leftLines.length && leftLines[li] !== common) {
      changes.push({
        type: "removed",
        value: leftLines[li],
        lineNumber: { left: leftNum++ },
      });
      deletions++;
      li++;
    }
    while (ri < rightLines.length && rightLines[ri] !== common) {
      changes.push({
        type: "added",
        value: rightLines[ri],
        lineNumber: { right: rightNum++ },
      });
      additions++;
      ri++;
    }
    changes.push({
      type: "equal",
      value: common,
      lineNumber: { left: leftNum++, right: rightNum++ },
    });
    unchanged++;
    li++;
    ri++;
  }

  while (li < leftLines.length) {
    changes.push({
      type: "removed",
      value: leftLines[li],
      lineNumber: { left: leftNum++ },
    });
    deletions++;
    li++;
  }
  while (ri < rightLines.length) {
    changes.push({
      type: "added",
      value: rightLines[ri],
      lineNumber: { right: rightNum++ },
    });
    additions++;
    ri++;
  }

  return { changes, stats: { additions, deletions, unchanged } };
}

function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return result;
}

export interface JsonDiffNode {
  path: string;
  type: "added" | "removed" | "changed" | "equal";
  leftValue?: unknown;
  rightValue?: unknown;
}

export function computeJsonDiff(
  left: unknown,
  right: unknown,
  path = "",
): JsonDiffNode[] {
  if (left === right) {
    return [{ path: path || "(root)", type: "equal", leftValue: left }];
  }

  if (
    typeof left !== typeof right ||
    left === null ||
    right === null ||
    Array.isArray(left) !== Array.isArray(right)
  ) {
    return [
      { path: path || "(root)", type: "changed", leftValue: left, rightValue: right },
    ];
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const nodes: JsonDiffNode[] = [];
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= left.length) {
        nodes.push({ path: childPath, type: "added", rightValue: right[i] });
      } else if (i >= right.length) {
        nodes.push({ path: childPath, type: "removed", leftValue: left[i] });
      } else {
        nodes.push(...computeJsonDiff(left[i], right[i], childPath));
      }
    }
    return nodes;
  }

  if (typeof left === "object" && typeof right === "object") {
    const nodes: JsonDiffNode[] = [];
    const leftObj = left as Record<string, unknown>;
    const rightObj = right as Record<string, unknown>;
    const allKeys = new Set([
      ...Object.keys(leftObj),
      ...Object.keys(rightObj),
    ]);
    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in leftObj)) {
        nodes.push({ path: childPath, type: "added", rightValue: rightObj[key] });
      } else if (!(key in rightObj)) {
        nodes.push({ path: childPath, type: "removed", leftValue: leftObj[key] });
      } else {
        nodes.push(...computeJsonDiff(leftObj[key], rightObj[key], childPath));
      }
    }
    return nodes;
  }

  return [
    { path: path || "(root)", type: "changed", leftValue: left, rightValue: right },
  ];
}

export const diffExamples = {
  left: `{
  "name": "devtools",
  "version": "1.0.0",
  "author": "Alice"
}`,
  right: `{
  "name": "devtools-hub",
  "version": "1.1.0",
  "license": "MIT"
}`,
};
