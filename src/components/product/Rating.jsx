import { StarIcon } from "../ui/Icons.jsx";
import "./Rating.css";

export default function Rating({ value, size = "sm", children }) {
  return (
    <span className={`rating rating--${size}`}>
      <span className="rating__stars" role="img" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} filled={n <= value} className={n <= value ? undefined : "is-empty"} />
        ))}
      </span>
      {children && <span className="rating__extra">{children}</span>}
    </span>
  );
}
