import { Params } from "./params.js";

export function resetCSS(element) {
  const imgElement = element.shadowRoot.querySelector("img.media");
  imgElement.style.filter = filterBlurString;
  imgElement.style.transform = transformMechString;

  // element.style.filter = `none`;
  // element.style.transform = `rotateX(0.25turn)`;
}

export function getIsMobile(document, cutoff) {
  const viewportWidth = document.documentElement.clientWidth;
  return viewportWidth < Params.MOBILE_WIDTH_CUTOFF_PX;
}
