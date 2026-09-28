import { useEffect } from "react";

const SITE = "RBS Perfumes";

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · Luxury fragrances for him, her & everyone`;
  }, [title]);
}
