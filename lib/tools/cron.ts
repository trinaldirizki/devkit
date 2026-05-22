export interface CronField {
  name: string;
  value: string;
  description: string;
  min: number;
  max: number;
}

export interface CronParseResult {
  success: true;
  fields: CronField[];
  description: string;
  nextRuns: Date[];
}

export interface CronError {
  success: false;
  error: string;
}

export type CronResult = CronParseResult | CronError;

const FIELD_DEFS = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of Month", min: 1, max: 31 },
  { name: "Month", min: 1, max: 12 },
  { name: "Day of Week", min: 0, max: 6 },
] as const;

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const DOW_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

export function parseCron(expression: string): CronResult {
  const trimmed = expression.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length !== 5) {
    return {
      success: false,
      error: `Expected 5 fields, got ${parts.length}. Format: minute hour day-of-month month day-of-week`,
    };
  }

  const fields: CronField[] = [];
  for (let i = 0; i < 5; i++) {
    const def = FIELD_DEFS[i];
    const raw = parts[i];
    const desc = describeField(raw, def.name, def.min, def.max);
    if (desc === null) {
      return { success: false, error: `Invalid ${def.name} field: "${raw}"` };
    }
    fields.push({ name: def.name, value: raw, description: desc, min: def.min, max: def.max });
  }

  const description = buildDescription(fields);
  const nextRuns = computeNextRuns(parts, 5);

  return { success: true, fields, description, nextRuns };
}

function describeField(
  value: string,
  name: string,
  min: number,
  max: number,
): string | null {
  if (value === "*") return `Every ${name.toLowerCase()}`;

  // Replace names for month/dow
  let normalized = value.toLowerCase();
  if (name === "Month") {
    for (const [n, v] of Object.entries(MONTH_NAMES)) {
      normalized = normalized.replace(new RegExp(n, "gi"), String(v));
    }
  }
  if (name === "Day of Week") {
    for (const [n, v] of Object.entries(DOW_NAMES)) {
      normalized = normalized.replace(new RegExp(n, "gi"), String(v));
    }
  }

  // */step
  const stepMatch = normalized.match(/^\*\/(\d+)$/);
  if (stepMatch) {
    return `Every ${stepMatch[1]} ${name.toLowerCase()}(s)`;
  }

  // range a-b
  const rangeMatch = normalized.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    return `${name} ${rangeMatch[1]} through ${rangeMatch[2]}`;
  }

  // list
  if (normalized.includes(",")) {
    return `${name} ${normalized}`;
  }

  // single value
  const num = Number(normalized);
  if (!isNaN(num) && num >= min && num <= max) {
    return `At ${name.toLowerCase()} ${num}`;
  }

  return null;
}

function buildDescription(fields: CronField[]): string {
  const [minute, hour, dom, month, dow] = fields;
  const parts: string[] = [];

  if (minute.value === "0" && hour.value === "*") {
    parts.push("At the start of every hour");
  } else if (minute.value !== "*" && hour.value !== "*") {
    parts.push(`At ${hour.value.padStart(2, "0")}:${minute.value.padStart(2, "0")}`);
  } else {
    parts.push(minute.description);
    parts.push(hour.description.toLowerCase());
  }

  if (dom.value !== "*") parts.push(`on day ${dom.value} of the month`);
  if (month.value !== "*") parts.push(`in month ${month.value}`);
  if (dow.value !== "*") parts.push(`on day-of-week ${dow.value}`);

  return parts.join(", ");
}

function expandField(value: string, min: number, max: number): number[] {
  const results = new Set<number>();

  for (const part of value.split(",")) {
    const stepMatch = part.match(/^(\d+|\*)-?(\d+)?(?:\/(\d+))?$/) ||
                      part.match(/^\*\/(\d+)$/);

    if (part === "*") {
      for (let i = min; i <= max; i++) results.add(i);
    } else if (part.match(/^\*\/\d+$/)) {
      const step = parseInt(part.split("/")[1]);
      for (let i = min; i <= max; i += step) results.add(i);
    } else if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      const step = part.includes("/") ? parseInt(part.split("/")[1]) : 1;
      for (let i = start; i <= end; i += step) results.add(i);
    } else {
      const num = parseInt(part);
      if (!isNaN(num)) results.add(num);
    }
  }

  return Array.from(results).sort((a, b) => a - b);
}

function computeNextRuns(parts: string[], count: number): Date[] {
  const minutes = expandField(parts[0], 0, 59);
  const hours = expandField(parts[1], 0, 23);
  const doms = expandField(parts[2], 1, 31);
  const months = expandField(parts[3], 1, 12);
  const dows = expandField(parts[4], 0, 6);

  const runs: Date[] = [];
  const now = new Date();
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIter = 525960; // ~1 year of minutes
  for (let i = 0; i < maxIter && runs.length < count; i++) {
    const m = cursor.getMinutes();
    const h = cursor.getHours();
    const d = cursor.getDate();
    const mo = cursor.getMonth() + 1;
    const dow = cursor.getDay();

    if (
      minutes.includes(m) &&
      hours.includes(h) &&
      doms.includes(d) &&
      months.includes(mo) &&
      dows.includes(dow)
    ) {
      runs.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return runs;
}

export const cronExamples = {
  everyMinute: "* * * * *",
  everyHour: "0 * * * *",
  daily9am: "0 9 * * *",
  weekdays: "0 9 * * 1-5",
  monthly: "0 0 1 * *",
};
