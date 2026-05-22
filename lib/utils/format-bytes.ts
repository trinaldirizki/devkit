const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(decimals)} ${UNITS[i] ?? "??"}`;
}
