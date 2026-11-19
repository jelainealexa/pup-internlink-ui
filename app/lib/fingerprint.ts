async function digest(bytes: Uint8Array | ArrayBuffer) {
  const hash = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(hash), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

export async function commandFingerprint(value: unknown): Promise<string> {
  async function canonical(item: unknown): Promise<unknown> {
    if (item instanceof Blob)
      return {
        blobDigest: await digest(await item.arrayBuffer()),
        size: item.size,
        mime: item.type,
      };
    if (Array.isArray(item)) return Promise.all(item.map(canonical));
    if (item && typeof item === "object") {
      const entries = await Promise.all(
        Object.entries(item)
          .filter(([, value]) => value !== undefined)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(async ([key, value]) => [key, await canonical(value)]),
      );
      return Object.fromEntries(entries);
    }
    if (typeof item === "number" && !Number.isFinite(item))
      return { invalidNumber: String(item) };
    return item;
  }
  return digest(
    new TextEncoder().encode(JSON.stringify(await canonical(value))),
  );
}
