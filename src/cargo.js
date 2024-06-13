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
  addVignetteEffectElement(document.body);

  // Create an observer that watches the movements of elements within its bounds
  const io = createIntersectionObserver(document);

  // Attach each vignette to the observer
  vignetteElements.forEach((vignette) => {
    // io.observe(vignette.shadowRoot.querySelector(".media"));
    io.observe(vignette);

    // Manually unset CSS variables on init to counteract inital sets
    resetCSS(vignette);
  });
}
