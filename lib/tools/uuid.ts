export interface UuidInfo {
  uuid: string;
  version: number | null;
  variant: string;
  isValid: boolean;
}

export function generateUuidV4(): string {
  return crypto.randomUUID();
}

export function generateBulkUuids(count: number): string[] {
  const capped = Math.min(Math.max(1, count), 1000);
  return Array.from({ length: capped }, () => generateUuidV4());
}

export function validateUuid(input: string): UuidInfo {
  const trimmed = input.trim().toLowerCase();
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{12}$/;
  const match = trimmed.match(uuidRegex);

  if (!match) {
    return { uuid: trimmed, version: null, variant: "unknown", isValid: false };
  }

  const version = parseInt(match[1], 16);
  const variantChar = parseInt(match[2], 16);
  let variant: string;
  if ((variantChar & 0x8) === 0) {
    variant = "NCS (reserved)";
  } else if ((variantChar & 0xc) === 0x8) {
    variant = "RFC 4122";
  } else if ((variantChar & 0xe) === 0xc) {
    variant = "Microsoft (reserved)";
  } else {
    variant = "Future (reserved)";
  }

  return { uuid: trimmed, version, variant, isValid: true };
}

export function formatUuidCases(uuid: string) {
  return {
    lowercase: uuid.toLowerCase(),
    uppercase: uuid.toUpperCase(),
    noDashes: uuid.replace(/-/g, ""),
    braces: `{${uuid}}`,
    urn: `urn:uuid:${uuid}`,
  };
}
