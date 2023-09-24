import "./useAccordionAnimation.scss";

export const nextFrame = (fn: () => void) => {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
};

export const useAccordionAnimation = (
  height: number | undefined = undefined
) => {
  const accordionEnter = (el: Element, done: () => void): void => {
    // @ts-ignore
    el.style.overflow = "hidden";
    // @ts-ignore
    el.style.height = "0";
    nextFrame(() => {
      // @ts-ignore
      el.style.height = `${height ? height : el.scrollHeight}px`;
    });
  };
  const accordionLeave = (el: Element, done: () => void): void => {
    // @ts-ignore
    el.style.overflow = "hidden";
    // @ts-ignore
    el.style.height = `${height ? height : el.scrollHeight}px`;
    nextFrame(() => {
      // @ts-ignore
      el.style.height = "0";
    });
  };
  const accordionAfterEnter = (el: Element): void => {
    // @ts-ignore
    el.style.height = "";
    // @ts-ignore
    el.style.overflow = "";
  };
  const accordionAfterLeave = (el: Element): void => {
    // @ts-ignore
    el.style.height = "";
    // @ts-ignore
    el.style.overflow = "";
  };
  return {
    nextFrame,
    accordionEnter,
    accordionLeave,
    accordionAfterEnter,
    accordionAfterLeave,
  };
};
