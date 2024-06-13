import { Params } from "./params.js";
import { debug } from "./debug.js";
import { getIsMobile } from "./utils.js";

export function createIntersectionObserver(container) {
  const isMobile = getIsMobile(container);

  const rootMarginTop = isMobile
    ? Params.ROOT_MARGIN_TOP_MOBILE
    : Params.ROOT_MARGIN_TOP_DESKTOP;
  const rootMarginBottom = isMobile
    ? Params.ROOT_MARGIN_BOT_MOBILE
    : Params.ROOT_MARGIN_BOT_DESKTOP;

  // Fill an array with evenly dispersed normalised values (0.0-1.0)
  // Points are used to trigger at what visibility points the callback function is triggered.
  const intersectionThresholds = Array(Params.INTERSECTION_RATE)
    .fill(0)
    .map((_, index) => index / Params.INTERSECTION_RATE);

  // Options for IntersectionObserver
  // - `null` root uses viewport
  const ioOptions = {
    root: null,
    rootMargin: `-${rootMarginTop}% 0% -${rootMarginBottom}% 0% `,
    threshold: intersectionThresholds,
  };

  return new IntersectionObserver(ioCallback, ioOptions);

  /**
   * Function that is called every an element crosses a point in `ioOptions.threshold`
   */
  function ioCallback(entries) {
    entries.forEach((entry) => {
      // How much of the element is visible within the intersection bounds?
      const intRatio = entry.intersectionRatio;

      // Determine whether the element is above or below the focused center
      const viewportTop = entry.rootBounds.top;
      const boundRectTop = entry.boundingClientRect.top;
      const isHigh = boundRectTop < viewportTop;

      // Get the relevant CSS strings to apply
      const filterBlurString = filterBlur(intRatio);
      const transformMechString = transformMech(intRatio, isHigh);
      // const opacityString = opacity(initRatio);

      const targetElement =
        entry.target.shadowRoot.lastChild.firstChild.firstChild.firstChild
          .firstChild;
      // Apply the CSS strings to the style
      targetElement.style.filter = filterBlurString;
      targetElement.style.transform = transformMechString;

      // Fade in captions
      const captionElement = entry.target.querySelector(".caption");
      if (captionElement) {
        if (intRatio > 0.8) {
          captionElement.classList.add("captionVisible");
        } else {
          captionElement.classList.remove("captionVisible");
        }
      }
      // imageCaptionElement.style.opacity = (() => {
      //   const offset = 0.5;
      //   if (intRatio < offset) return 0;
      //
      //   return offset + intRatio * offset;
      // })();

      debug.add("outline", entry.target);

      if (Params.DEBUG && entry.target.href.includes("02")) {
        debug.print();
      }

      return;

      function opacity(ratio) {
        const opacityAmt =
          ratio * (1 - Params.OPACITY_MIN) + Params.OPACITY_MIN;
        return `${opacityAmt}`;
      }

      function filterBlur(ratio) {
        const blurAmt =
          Params.BLUR_STRENGTH_MAX -
          Math.round(ratio * Params.BLUR_STRENGTH_MAX);
        return `blur(${blurAmt}px) brightness(${opacity(ratio) * 100}%)`;
      }

      function transformMech(ratio, isHigh) {
        if (ratio == 1) return "";

        const perspectiveAmt = Params.MECH_PERSPECTIVE_AMT;

        const rotateAmtBase =
          Params.MECH_ROTATE_MAX - ratio * Params.MECH_ROTATE_MAX;
        const rotateAmt = isHigh ? rotateAmtBase : -rotateAmtBase;

        const scaleOffset = 1 - Params.MECH_SCALE_AMT;
        const scaleAmt = scaleOffset + ratio * Params.MECH_SCALE_AMT;

        if (Params.DEBUG) {
          debug.rotateAmtBase = rotateAmtBase;
          debug.rotateAmt = rotateAmt;
          debug.rotateRatio = ratio;
          debug.scaleAmt = scaleAmt;
          debug.initRatio = ratio;
        }

        return `perspective(${perspectiveAmt}vw) rotateX(${rotateAmt}turn) scale(${scaleAmt})  `;
      }
    });
  }
}
