import { Params } from "./params.js";

export function getVignetteImg(vignette) {
  return vignette.shadowRoot?.querySelector(".media");
}

export function applyVignetteCss(vignette, { filter, transform }) {
  // Retrieve the image element inside the `media-item` custom element from Cargo.
  const targetElement = getVignetteImg(vignette);
  if (!targetElement)
    return Error("Vignette does not have a .media element!\n", vignette);
  // console.log(targetElement);

  // Apply the CSS strings to the style
  targetElement.style.filter = filter;
  targetElement.style.transform = transform;
}

/**
 * Manually set CSS of an element to the default hidden state (rotated + blurred).
 */
export function setVignetteCssDefault(vignette) {
  const filter = `blur(${Params.BLUR_STRENGTH_MAX}px) brightness(${Params.BRIGHTNESS_MIN * 100}%)`;
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

export function getMediaItems(container) {
  const mediaItemsCollection = container.getElementsByTagName("media-item");
  const mediaItems = Object.values(mediaItemsCollection).sort();
  return mediaItems;
}

/*
 * Attach each vignette to the observer
 **/
export function observeElementsInArray(observer, elementArray) {
  elementArray.forEach((vignette) => {
    observer.observe(vignette);
  });
}

/**
 * Generator with a closure that keeps track of whether the page has changed from the given URL.
 *
 * @param {string} rootPath - path to compare against
 * @return {(pathname) => boolean} - function to check whether the page changed.
 */
export function generatePageChangeFn(rootPath) {
  let urlChanged = false;

  return (pathname) => {
    const isHomePage = pathname == rootPath;

    if (!isHomePage && !urlChanged) {
      urlChanged = true;
      return false;
    }

    if (!isHomePage || !urlChanged) return false;

    urlChanged = false;
    return true;
  };
}

export async function getStore() {
  return new Promise((resolve, reject) => {
    let checkCounter = 0;
    setTimeout(() => {
      checkCounter++;
      if (!!window.store) resolve(window.store);
      if (checkCounter == 50) throw Error("Took too long to get store");
    }, 100);
  });
}

/**
 * Attach an event to the Preact/Cargo store that fires every time a page is rendered.
 * Retrieved from the Cargo dev team via Cargo support.
 *
 * @param {(HTMLElement) => void} callbackFn - Function to call every time a page is rendered
 */
export function onPageRender(store, callbackFn) {
  let lastRenderedPages = [];

  const onNewPageRender = (pageEl) => {
    console.log("new page element rendered", pageEl);
  };

  store.subscribe(() => {
    const currentRenderedPages = store.getState().frontendState.renderedPages;

    // rendered page list changed
    if (currentRenderedPages !== lastRenderedPages) {
      // grab all pages
      currentRenderedPages
        // filter only by pages not previously rendered
        .filter((pageEl) => !lastRenderedPages.includes(pageEl))
        // run the callback for those new pages
        .forEach(callbackFn);

      // update the last known rendered page list
      lastRenderedPages = currentRenderedPages;
    }
  });
}

export function resetObserverReferences(observer, container) {
  // Remove old references
  observer.disconnect();

  // Query new references
  const newVignetteElements = getMediaItems(container);

  // Set observer again
  observeElementsInArray(observer, newVignetteElements);
}
