/**
 * Unpacks the certificate note field which may contain a packed image URL.
 * Format: "IMG:url::NOTE:text" or raw text.
 */
export function unpackNote(rawNote: string): { imageUrl?: string; note: string } {
  if (!rawNote) return { note: "" };

  if (rawNote.startsWith("IMG:")) {
    const parts = rawNote.split("::NOTE:");
    if (parts.length === 2) {
      const imageUrl = parts[0].replace("IMG:", "").trim();
      const note = parts[1].trim();
      return { imageUrl, note };
    }
  }

  return { note: rawNote };
}
