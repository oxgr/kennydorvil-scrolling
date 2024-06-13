import { Params } from "./params.js";

export function resetCSS(element) {
  element.style.filter = `none`;
  element.style.transform = `none`;
}

export function getIsMobile(document, cutoff) {
  const viewportWidth = document.documentElement.clientWidth;
  return viewportWidth < Params.MOBILE_WIDTH_CUTOFF_PX;
}
