import { useEffect, useRef } from "react";

/**
 * Thin wrapper around the native <dialog> element. `showModal()` gives us a
 * focus trap, Esc-to-close and an inert page behind it for free.
 * Children are only mounted while open, so their state resets each time.
 */
export default function Dialog({ open, onClose, className = "", label, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onClose={onClose}
      // A click that lands on the <dialog> itself (not its content) is a backdrop click.
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && children}
    </dialog>
  );
}
