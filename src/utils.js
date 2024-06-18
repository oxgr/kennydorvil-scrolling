import { Params } from "./params.js";

export function applyVignetteCss(vignette, { filter, transform }) {
  // Retrieve the image element inside the `media-item` custom element from Cargo.
  const targetElement = vignette.shadowRoot?.querySelector(".media");

  // Apply the CSS strings to the style
  targetElement.style.filter = filter;
  targetElement.style.transform = transform;
}

/**
 * Manually set CSS of an element to the default hidden state (rotated + blurred).
 */
export function setVignetteCssDefault(vignette) {
  const filter = `blur(${Params.BLUR_STRENGTH_MAX}px) brightness(${Params.OPACITY_MIN * 100}%)`;
  const transform = `perspective(${Params.MECH_PERSPECTIVE_AMT}vw) rotateX(${Params.MECH_ROTATE_MAX}turn) scale(${Params.MECH_SCALE_AMT}`;

  return applyVignetteCss(vignette, { filter, transform });
}

/**
 * Determine whether the viewport is mobile based on a pre-determined width cutoff point defined in `Params` Determine whether the viewport is mobile based on a pre-determined width cutoff point defined in `Params`.
 */
export function getIsMobile(document, cutoff) {
  const viewportWidth = document.documentElement.clientWidth;
  return viewportWidth < Params.MOBILE_WIDTH_CUTOFF_PX;
}
