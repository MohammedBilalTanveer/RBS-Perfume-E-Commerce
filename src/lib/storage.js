// Small wrappers around localStorage / sessionStorage.
// Storage can be unavailable (private mode, blocked cookies) or hold bad JSON,
// so every read and write is guarded and falls back quietly.

function getStore(kind) {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON(key, fallback, kind = "local") {
  try {
    const raw = getStore(kind)?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value, kind = "local") {
  try {
    getStore(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked – the app keeps working in memory.
  }
}

export function removeKey(key, kind = "local") {
  try {
    getStore(kind)?.removeItem(key);
  } catch {
    // ignore
  }
}
