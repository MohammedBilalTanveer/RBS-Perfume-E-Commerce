import { asset } from "../../lib/catalog.js";
import "./AuthShell.css";

/** Split layout used by the sign-in and sign-up pages. */
export default function AuthShell({ eyebrow, title, subtitle, image, children }) {
  return (
    <div className="auth">
      <div className="auth__art" aria-hidden="true">
        <img src={asset(image)} alt="" />
        <div className="auth__quote">
          <p>“A signature scent is the most intimate accessory you’ll ever wear.”</p>
        </div>
      </div>
      <div className="auth__panel">
        <div className="auth__box">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="auth__title">{title}</h1>
          {subtitle && <p className="auth__subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
