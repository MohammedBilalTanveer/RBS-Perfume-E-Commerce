import { useSyncExternalStore } from "react";

function subscribe(onChange) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** True once the page has been scrolled past `offset` pixels. */
export default function useScrolled(offset = 24) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > offset,
    () => false,
  );
}
