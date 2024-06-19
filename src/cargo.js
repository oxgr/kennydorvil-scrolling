import { Params } from "./params.js";
import { createIntersectionObserver } from "./observer.js";
import { addVignetteEffectElement } from "./element.js";
import {
  setVignetteCssDefault,
  getMediaItems,
  observeElementsInArray,
  generatePageChangeFn,
} from "./utils.js";

main();

function main() {
  console.log("Scrolling effects by @oxgr");

  // Retrieve exisiting elements
  const vignetteElements = getMediaItems(document);

  // Visual vignette element needs to layer on global viewport
  // and this is easier to do with `document.body`
  // NOTE: This feature was disabled for legibility of captions.
  //
  // addVignetteEffectElement(document.body);

  // Create an observer that watches the movements of elements within its bounds
  const scrollObserver = createIntersectionObserver(document);

  observeElementsInArray(scrollObserver, vignetteElements);

  vignetteElements.forEach((vignette) => {
    // Set a custom class name to prep caption fade in if enabled.
    if (Params.CAPTION_FADEIN_ENABLE) {
      vignette.querySelector(".caption")?.classList.add("fadeIn");
    }

    // Manually unset CSS variables on init for all except first vignette
    if (!vignette.href?.includes("01")) {
      setVignetteCssDefault(vignette);
    }
  });

  // Generate detector function that compares against the home page
  const pageChanged = generatePageChangeFn("/");

  // Set up a watcher to observe new references to elements
  // See: README.md#preact-virtual-dom-resets-observer-references
  setInterval(() => {
    if (!pageChanged(window.location.pathname)) return;

    // Remove old references
    scrollObserver.disconnect();

    // Query new references
    const newVignetteElements = getMediaItems(document);

    // Set observer again
    observeElementsInArray(scrollObserver, newVignetteElements);
  }, Params.OBSERVER_RESET_WATCHER_INTERVAL);
}
