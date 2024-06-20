import { Params } from "./params.js";
import { applyVignetteCss, getIsMobile, getVignetteImg } from "./utils.js";

/**
 * Instantiates an IntersectionObserver object with the necessary parameters and callback function.
 */
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
}

/**
 * Function that is called every an element crosses a point in `ioOptions.threshold`
 */
function ioCallback(entries) {
  entries.forEach(entryHandler);
  return;

  function entryHandler(entry) {
    const vignette = entry.target;

    // Guard for media-items outside of home page
    if (!getVignetteImg(vignette)) return;

    // How much the element is visible within the intersection bounds
    const intRatio = entry.intersectionRatio;

    // Determine whether the element is above or below the focused center
    const isHigh = entry.boundingClientRect.top < entry.rootBounds.top;

    // Get the relevant CSS strings to apply
    const filterBlurString = filterBlur(intRatio);
    const transformMechString = transformMech(intRatio, isHigh);
    const opacityString = intRatio.toString();

    // const opacityString = intRatio == 0 ? "0" : "1";
    //   entry.target.style.opacity = opacityString;

    // Apply the CSS strings to the style
    try {
      applyVignetteCss(vignette, {
        filter: filterBlurString,
        transform: transformMechString,
      });
      entry.target.style.opacity = opacityString;
    } catch (err) {
      console.error(err);
    }

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
    return;
  }
}

function filterBlur(ratio) {
  const blurAmt =
    Params.BLUR_STRENGTH_MAX - Math.round(ratio * Params.BLUR_STRENGTH_MAX);
  const brightnessAmt =
    ratio * (Params.BRIGHTNESS_MAX - Params.BRIGHTNESS_MIN) +
    Params.BRIGHTNESS_MIN;
  return `blur(${blurAmt}px) brightness(${brightnessAmt * 100}%)`;

  // const blurAmt =
  //   Params.BLUR_STRENGTH_MAX - Math.round(ratio * Params.BLUR_STRENGTH_MAX);
  //
  // return `blur(${blurAmt}px)`;
}

function transformMech(ratio, isHigh) {
  if (ratio == 1) return "";

  const perspectiveAmt = Params.MECH_PERSPECTIVE_AMT;

  const rotateAmtBase = Params.MECH_ROTATE_MAX - ratio * Params.MECH_ROTATE_MAX;
  const rotateAmt = isHigh ? rotateAmtBase : -rotateAmtBase;

  const scaleOffset = 1 - Params.MECH_SCALE_AMT;
  const scaleAmt = scaleOffset + ratio * Params.MECH_SCALE_AMT;

  return `perspective(${perspectiveAmt}vw) rotateX(${rotateAmt}turn) scale(${scaleAmt})  `;
}
