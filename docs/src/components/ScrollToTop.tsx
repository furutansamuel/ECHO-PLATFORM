import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position to top on every route change.
 * Prevents pages from opening pre-scrolled after navigation.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    // Also reset any inner scrollable main containers (dashboard layout)
    const scrollables = document.querySelectorAll<HTMLElement>('main[data-scroll-root], main.overflow-y-auto');
    scrollables.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
