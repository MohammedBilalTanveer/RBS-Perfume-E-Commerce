import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/ui/AuthShell.jsx";
import FormField from "../components/ui/FormField.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import { DEMO_ACCOUNT, useAuth } from "../context/auth.js";
import { useToast } from "../context/toast.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { AlertIcon } from "../components/ui/Icons.jsx";

export default function Login() {
  const { user, login, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useDocumentTitle("Sign in");

  if (done) return null;

  if (user) {
    return (
      <AuthShell
        eyebrow="Account"
        title="You're signed in"
        subtitle={`Signed in as ${user.username}.`}
        image="images/products/womenperfume42.webp"
      >
        <div className="auth-form">
          <Link to="/shop" className="btn btn--primary btn--block">
            Continue shopping
          </Link>
          <button type="button" className="btn btn--ghost btn--block" onClick={logout}>
            Sign out
          </button>
        </div>
      </AuthShell>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setBusy(true);
    const result = await login(username, password, remember);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
    toast.show({ title: `Welcome back, ${username.trim()}!`, message: "You're now signed in." });
    navigate(from, { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Please enter your details to access your account."
      image="images/products/womenperfume42.webp"
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        {error && (
          <p className="auth-form__alert" role="alert">
            <AlertIcon /> {error}
          </p>
        )}
        <FormField
          id="login-username"
          label="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <FormField id="login-password" label="Password">
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <div className="auth-form__row">
          <label className="checkbox">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
        </div>
        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? <span className="spinner" /> : "Sign in"}
        </button>
      </form>

      <p className="auth__switch">
        New to RBS? <Link to="/signup" state={location.state}>Create an account</Link>
      </p>

      <p className="auth__demo">
        Demo account: <code>{DEMO_ACCOUNT.username}</code> / <code>{DEMO_ACCOUNT.password}</code>
        <button
          type="button"
          onClick={() => {
            setUsername(DEMO_ACCOUNT.username);
            setPassword(DEMO_ACCOUNT.password);
            setError("");
          }}
        >
          Fill in
        </button>
      </p>
    </AuthShell>
  );
}
