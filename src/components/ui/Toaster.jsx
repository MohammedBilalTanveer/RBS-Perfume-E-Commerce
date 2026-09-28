import { Link } from "react-router-dom";
import { CheckIcon, CloseIcon } from "./Icons.jsx";
import "./Toaster.css";

export default function Toaster({ toasts, onDismiss }) {
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.image ? (
            <img className="toast__img" src={t.image} alt="" width="52" height="52" />
          ) : (
            <span className="toast__icon">
              <CheckIcon />
            </span>
          )}
          <div className="toast__body">
            <p className="toast__title">{t.title}</p>
            {t.message && <p className="toast__msg">{t.message}</p>}
          </div>
          {t.action &&
            (t.action.to ? (
              <Link className="toast__action" to={t.action.to} onClick={() => onDismiss(t.id)}>
                {t.action.label}
              </Link>
            ) : (
              <button
                className="toast__action"
                type="button"
                onClick={() => {
                  t.action.onClick();
                  onDismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            ))}
          <button className="toast__close" type="button" aria-label="Dismiss" onClick={() => onDismiss(t.id)}>
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
