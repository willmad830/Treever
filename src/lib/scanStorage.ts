export const SCAN_RESULT_STORAGE_KEY = "treever:last-scan-result";
export const SCAN_INDEX_STORAGE_KEY = "treever:scan-index";
const LEGACY_SESSION_KEY = "treever:last-scan-result";

export type StoredScanResult = {
  id: string;
  createdAt: number;
  imagePreview?: string | null;
  analysis: import("@/types/scan").ScanAnalysis;
};

function scanItemKey(id: string) {
  return `treever:scan:${id}`;
}

function readJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function loadScanIndex(): string[] {
  if (typeof window === "undefined") return [];
  const ids = readJson<string[]>(
    localStorage.getItem(SCAN_INDEX_STORAGE_KEY),
  );
  return ids ?? [];
}

function persistScanIndex(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      SCAN_INDEX_STORAGE_KEY,
      JSON.stringify(ids.slice(0, 100)),
    );
  } catch {
  }
}

function migrateLegacySessionScan(): StoredScanResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LEGACY_SESSION_KEY);
    const parsed = readJson<StoredScanResult>(raw);
    if (!parsed?.id) return null;
    localStorage.setItem(scanItemKey(parsed.id), JSON.stringify(parsed));
    localStorage.setItem(SCAN_RESULT_STORAGE_KEY, JSON.stringify(parsed));
    const ids = loadScanIndex();
    if (!ids.includes(parsed.id)) {
      persistScanIndex([parsed.id, ...ids]);
    }
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
    return parsed;
  } catch {
    return null;
  }
}

export function saveScanResult(result: StoredScanResult) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify(result);
    localStorage.setItem(scanItemKey(result.id), payload);
    localStorage.setItem(SCAN_RESULT_STORAGE_KEY, payload);

    const ids = loadScanIndex();
    const next = [result.id, ...ids.filter((id) => id !== result.id)];
    persistScanIndex(next);
  } catch {
  }
}

export function loadScanResultById(id: string): StoredScanResult | null {
  if (typeof window === "undefined") return null;
  migrateLegacySessionScan();

  const fromId = readJson<StoredScanResult>(
    localStorage.getItem(scanItemKey(id)),
  );
  if (fromId) return fromId;

  const last = loadScanResult();
  if (last?.id === id) return last;

  return null;
}

export function loadScanResult(): StoredScanResult | null {
  if (typeof window === "undefined") return null;
  migrateLegacySessionScan();

  const last = readJson<StoredScanResult>(
    localStorage.getItem(SCAN_RESULT_STORAGE_KEY),
  );
  if (last?.id) {
    const byId = readJson<StoredScanResult>(
      localStorage.getItem(scanItemKey(last.id)),
    );
    return byId ?? last;
  }

  return null;
}

export function listScanIds(): string[] {
  if (typeof window === "undefined") return [];
  migrateLegacySessionScan();
  return loadScanIndex();
}

export function listScanResults(): StoredScanResult[] {
  return listScanIds()
    .map((id) => loadScanResultById(id))
    .filter((item): item is StoredScanResult => item !== null);
}
