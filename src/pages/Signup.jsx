import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/ui/AuthShell.jsx";
import FormField from "../components/ui/FormField.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import { useAuth } from "../context/auth.js";
import { useToast } from "../context/toast.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { AlertIcon } from "../components/ui/Icons.jsx";

const USERNAME_RE = /^[a-z0-9._]{3,20}$/i;

function validate({ username, password, confirm }) {
  const errors = {};
  if (!USERNAME_RE.test(username.trim())) errors.username = "3–20 characters: letters, numbers, dots or underscores.";
  if (password.length < 6) errors.password = "Use at least 6 characters.";
  if (confirm !== password) errors.confirm = "Passwords don't match.";
  return errors;
}

export default function Signup() {
  const { user, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";

  const [values, setValues] = useState({ username: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useDocumentTitle("Create account");

  if (done) return null;
  if (user) return <Navigate to="/login" replace />;

  const errors = validate(values);
  const show = (key) => (touched[key] || submitted ? errors[key] : undefined);
  const bind = (key) => ({
    value: values[key],
    onChange: (e) => setValues((v) => ({ ...v, [key]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setBusy(true);
    const result = await signup(values.username, values.password);
    setBusy(false);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setDone(true);
    toast.show({ title: `Welcome to RBS, ${values.username.trim()}!`, message: "Your account is ready." });
    navigate(from, { replace: true });
  };

  return (
    <AuthShell
      eyebrow="Join RBS"
      title="Create account"
      subtitle="Save your details for faster checkout and early access to new launches."
      image="images/products/menperfume37.webp"
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        {serverError && (
          <p className="auth-form__alert" role="alert">
            <AlertIcon /> {serverError}
          </p>
        )}
        <FormField
          id="signup-username"
          label="Username"
          autoComplete="username"
          error={show("username")}
          hint="Letters, numbers, dots or underscores."
          {...bind("username")}
        />
        <FormField id="signup-password" label="Password" error={show("password")} hint="At least 6 characters.">
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            error={show("password")}
            describedBy={show("password") ? "signup-password-error" : "signup-password-hint"}
            {...bind("password")}
          />
        </FormField>
        <FormField id="signup-confirm" label="Confirm password" error={show("confirm")}>
          <PasswordInput
            id="signup-confirm"
            autoComplete="new-password"
            error={show("confirm")}
            describedBy={show("confirm") ? "signup-confirm-error" : undefined}
            {...bind("confirm")}
          />
        </FormField>
        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? <span className="spinner" /> : "Create account"}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
      </p>
      <p className="auth__demo">
        Demo site: accounts are saved only in this browser, and passwords are stored hashed – never in plain text.
      </p>
    </AuthShell>
  );
}
