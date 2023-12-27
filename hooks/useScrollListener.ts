import { useEffect } from "react";

interface UseScrollListener {
  element?: React.RefObject<HTMLElement>;
  handleScroll: (event: Event) => void;
}
/**
 *
 * @param element - `(OPTIONAL)` React ref object of the element to listen to scroll events on, if not provided, will listen to scroll events on `window`
 * @param handleScroll - Function to handle scroll events
 */
const useScrollListener = ({ element, handleScroll }: UseScrollListener) => {
  useEffect(() => {
    const target = element?.current || window;
    if (!target) return;
    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, [element, handleScroll]);
};

export default useScrollListener;
