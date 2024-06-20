import { Params } from "./params.js";
import { createIntersectionObserver } from "./observer.js";
import { addVignetteEffectElement } from "./element.js";
import {
  setVignetteCssDefault,
  getMediaItems,
  observeElementsInArray,
  generatePageChangeFn,
  onPageRender,
  resetObserverReferences,
  getStore,
} from "./utils.js";

main();

async function main() {
  console.log("Scrolling effects by @oxgr");

  const scriptElement = document.querySelector(`#${Params.SCRIPT_ID}`);
  if (!scriptElement)
    console.warn(
      `Script element could not be found!
Does the ID set on the element in Cargo match Params.SCRIPT_ID?

SCRIPT_ID: '${Params.SCRIPT_ID}'

ID is required to track page element changes and reset IntersectionObserver reliably.
Proceeding with timer reset...`,
    );

  // Visual vignette element needs to layer on global viewport
  // and this is easier to do with `document.body`
  if (Params.VIGNETTE_EFFECT_ENABLE) {
    addVignetteEffectElement(document.body);
  }

  // Retrieve exisiting elements
  const vignetteElements = getMediaItems(document);

  // Create an observer that watches the movements of elements within its bounds
  const scrollObserver = createIntersectionObserver(document);

  observeElementsInArray(scrollObserver, vignetteElements);

  // Misc actions for prep
  vignetteElements.forEach((vignette, index) => {
    // Set a custom class name to prep caption fade in if enabled.
    if (Params.CAPTION_FADEIN_ENABLE) {
      vignette.querySelector(".caption")?.classList.add("fadeIn");
    }

    // Manually unset CSS variables on init for all except first vignette
    if (index == 0) return;

    setVignetteCssDefault(vignette);
  });

  try {
    store = await getStore();
  } catch (err) {
    console.error(err);
  }

  // Watch for Cargo/Preact rendered pages only if script element is found
  if (scriptElement && store) {
    onPageRender(store, (pageEl) => {
      const pageContainsScript = pageEl.querySelector(`#${Params.SCRIPT_ID}`);

      // Ignore if script is not found inside the element
      if (!pageContainsScript) return;

      resetObserverReferences(scrollObserver, document);
    });
    return;
  }

  // Else, reset observer with timed checks as backup ( WARNING: Breaks on iPhone/iPad )
  //
  // Generate detector function that compares against the home page
  const pageChanged = generatePageChangeFn("/");

  // Set up a watcher to observe new references to elements
  // See: README.md#preact-virtual-dom-resets-observer-references
  setInterval(() => {
    if (!pageChanged(window.location.pathname)) return;
    resetObserverReferences(scrollObserver, document);
  }, Params.OBSERVER_RESET_WATCHER_INTERVAL);
}
