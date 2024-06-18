import { Params } from "./params.js";
import { createIntersectionObserver } from "./observer.js";
import { addVignetteEffectElement } from "./element.js";
import { resetCSS } from "./utils.js";

main();

function main() {
  console.log("Scrolling effects by @oxgr");

  // Retrieve exisiting elements
  const scriptElement = document.querySelector("#scrollingEffects");
  const vignetteElements = document.querySelectorAll(".linked");

  // Visual vignette element needs to layer on global viewport
  // and this is easier to do with `document.body`
  // NOTE: This feature was disabled for legibility of captions.
  //
  // addVignetteEffectElement(document.body);

  // Create an observer that watches the movements of elements within its bounds
  const io = createIntersectionObserver(document);

  // Attach each vignette to the observer
  vignetteElements.forEach((vignette) => {
    // io.observe(vignette.shadowRoot.querySelector(".media"));
    io.observe(vignette);

    // Set a custom class name to prep caption fade in if enabled.
    if (Params.CAPTION_FADEIN_ENABLE) {
      vignette.querySelector(".caption")?.classList.add("fadeIn");
    }

    // Manually unset CSS variables on init to counteract inital sets
    resetCSS(vignette);
  });
}
