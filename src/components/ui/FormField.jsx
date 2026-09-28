import { AlertIcon } from "./Icons.jsx";

/** Label + input + error message, wired up for screen readers. */
export default function FormField({ id, label, error, hint, className = "", children, ...inputProps }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children ?? (
        <input id={id} className="input" aria-invalid={Boolean(error)} aria-describedby={describedBy} {...inputProps} />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          <AlertIcon width="14" height="14" /> {error}
        </p>
      )}
    </div>
  );
}
