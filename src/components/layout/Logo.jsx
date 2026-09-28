import { Link } from "react-router-dom";
import "./Logo.css";

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" aria-label="RBS Perfumes – home" onClick={onClick}>
      <span className="logo__mark">RBS</span>
      <span className="logo__sub">Perfumes</span>
    </Link>
  );
}
