import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons.jsx";

export default function PasswordInput({ id, error, describedBy, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password">
      <input
        id={id}
        className="input"
        type={visible ? "text" : "password"}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      <button
        type="button"
        className="password__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
