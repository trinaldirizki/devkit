export function downloadText(
  content: string,
  filename: string,
  mimeType = "text/plain",
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string): void {
  downloadText(JSON.stringify(data, null, 2), filename, "application/json");
}
