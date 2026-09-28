import { useCallback, useMemo, useState } from "react";
import { AuthContext, DEMO_ACCOUNT } from "./auth.js";
import { readJSON, removeKey, writeJSON } from "../lib/storage.js";

// ---------------------------------------------------------------------------
// Front-end only demo authentication.
//
// The original site used login.php / signup.php with MySQL. A static React app
// has no server, so accounts are kept in this browser's localStorage and
// passwords are stored as SHA-256 hashes (never in plain text). To connect a
// real backend, replace the bodies of `login` and `signup` with fetch() calls
// to your API – the rest of the app only uses { user, login, signup, logout }.
// ---------------------------------------------------------------------------

const USERS_KEY = "rbs.users.v1";
const SESSION_KEY = "rbs.session.v1";

async function hash(text) {
  if (window.crypto?.subtle) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // crypto.subtle only exists on https/localhost. Fallback: FNV-1a (demo only).
  let h = 0x811c9dc5;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return `fnv-${h.toString(16)}`;
}

const normalise = (username) => username.trim().toLowerCase();

function loadSession() {
  return readJSON(SESSION_KEY, null) ?? readJSON(SESSION_KEY, null, "session");
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  const startSession = useCallback((username, remember) => {
    const session = { username };
    removeKey(SESSION_KEY);
    removeKey(SESSION_KEY, "session");
    writeJSON(SESSION_KEY, session, remember ? "local" : "session");
    setUser(session);
    return session;
  }, []);

  const login = useCallback(
    async (username, password, remember = true) => {
      const key = normalise(username);
      if (key === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password) {
        startSession(DEMO_ACCOUNT.username, remember);
        return { ok: true };
      }
      const users = readJSON(USERS_KEY, []);
      const found = users.find((u) => u.username === key);
      if (!found || found.passwordHash !== (await hash(password))) {
        return { ok: false, error: "Incorrect username or password." };
      }
      startSession(found.username, remember);
      return { ok: true };
    },
    [startSession],
  );

  const signup = useCallback(
    async (username, password) => {
      const key = normalise(username);
      const users = readJSON(USERS_KEY, []);
      if (key === DEMO_ACCOUNT.username || users.some((u) => u.username === key)) {
        return { ok: false, error: "That username is already taken." };
      }
      users.push({ username: key, passwordHash: await hash(password), createdAt: new Date().toISOString() });
      writeJSON(USERS_KEY, users);
      startSession(key, true);
      return { ok: true };
    },
    [startSession],
  );

  const logout = useCallback(() => {
    removeKey(SESSION_KEY);
    removeKey(SESSION_KEY, "session");
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
