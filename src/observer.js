import { Params } from "./params.js";
import { debug } from "./debug.js";
import { applyVignetteCss, getIsMobile } from "./utils.js";

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
  const ioOptions = {
    threshold: intersectionThresholds,

    // `null` root uses viewport
    root: null,

    // root margins are set as negative values to narrow down the viewport into a smaller container.
    rootMargin: `-${rootMarginTop}% 0% -${rootMarginBottom}% 0% `,
  };

  return new IntersectionObserver(ioCallback, ioOptions);

  /**
   * Function that is called every an element crosses a point in `ioOptions.threshold`
   */
  function ioCallback(entries) {
    entries.forEach((entry) => {
      const vignette = entry.target;

      // How much the element is visible within the intersection bounds
      const intRatio = entry.intersectionRatio;

      // Determine whether the element is above or below the focused center
      const viewportTop = entry.rootBounds.top;
      const boundRectTop = entry.boundingClientRect.top;
      const isHigh = boundRectTop < viewportTop;

      // Get the relevant CSS strings to apply
      const filterBlurString = filterBlur(intRatio);
      const transformMechString = transformMech(intRatio, isHigh);
      // const opacityString = opacity(initRatio);

      // Apply the CSS strings to the style
      applyVignetteCss(vignette, {
        filter: filterBlurString,
        transform: transformMechString,
      });

      // Fade in captions
      if (Params.CAPTION_FADEIN_ENABLE) {
        const captionElement = vignette.querySelector(".caption");
        if (captionElement) {
          captionElement.style.filter = filterBlurString;
          if (intRatio > Params.CAPTION_FADEIN_THRESHOLD) {
            captionElement.classList.add("captionVisible");
          } else {
            captionElement.classList.remove("captionVisible");
          }
        }
      }

      if (Params.DEBUG && vignette.href?.includes("02")) {
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

        return `perspective(${perspectiveAmt}vw) rotateX(${rotateAmt}turn) scale(${scaleAmt})  `;
      }
    });
  }
}
