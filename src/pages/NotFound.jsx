import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import "./NotFound.css";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <div className="container not-found">
      <p className="not-found__code" aria-hidden="true">
        404
      </p>
      <h1 className="page-title">This scent has evaporated</h1>
      <p className="muted">The page you're looking for doesn't exist or has moved.</p>
      <div className="not-found__actions">
        <Link to="/shop" className="btn btn--primary">
          Shop perfumes
        </Link>
        <Link to="/" className="btn btn--ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
