import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth.js";
import { useToast } from "../../context/toast.js";
import { UserIcon } from "../ui/Icons.jsx";

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <Link to="/login" className="icon-btn" aria-label="Sign in">
        <UserIcon />
      </Link>
    );
  }

  return (
    <div className="account" ref={ref}>
      <button
        type="button"
        className="account__avatar"
        aria-expanded={open}
        aria-label={`Account menu for ${user.username}`}
        onClick={() => setOpen((o) => !o)}
      >
        {user.username[0]}
      </button>
      {open && (
        <div className="account__menu">
          <p className="account__who">
            Signed in as <strong>{user.username}</strong>
          </p>
          <Link className="account__item" to="/cart" onClick={() => setOpen(false)}>
            My cart
          </Link>
          <Link className="account__item" to="/shop" onClick={() => setOpen(false)}>
            Continue shopping
          </Link>
          <button
            type="button"
            className="account__item"
            onClick={() => {
              logout();
              setOpen(false);
              toast.show({ title: "You've been signed out", message: "See you again soon." });
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
