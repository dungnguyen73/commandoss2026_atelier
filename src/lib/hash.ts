/**
 * Computes a deterministic SHA-256 hash for a certificate's core metadata.
 * 
 * To prevent payload injection, this enforces a strict ordering and delimiter
 * pattern: name|category|artisanName|location|materials|note
 */
export async function computeCertificateHash(data: {
  name: string;
  category: string;
  artisanName: string;
  location: string;
  materials: string;
  note?: string;
}): Promise<string> {
  // Normalize and strictly order the properties
  const payload = [
    data.name.trim(),
    data.category.trim(),
    data.artisanName.trim(),
    data.location.trim(),
    data.materials.trim(),
    (data.note || "N/A").trim()
  ].join("|");

  // Encode the payload to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(payload);

  // Digest using native Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

  // Convert ArrayBuffer to Hex String
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
