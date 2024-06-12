const Params = {
  // Margins of intersection observer as ratios of the viewport.
  // Determines the point where vignettes start to react.
  ROOT_MARGIN_TOP_DESKTOP: 5,
  ROOT_MARGIN_BOT_DESKTOP: 20,
  ROOT_MARGIN_TOP_MOBILE: 25,
  ROOT_MARGIN_BOT_MOBILE: 30,

  // If viewport is under this value, consider it mobile.
  MOBILE_WIDTH_CUTOFF_PX: 640,

  // Extra padding added to top
  MOBILE_TOP_PADDING_VH: 40,

  // Rate at which the following callback function is called
  // as fraction of an element's visibility inside the intersection bounds.
  INTERSECTION_RATE: 100,

  // Max strength of blur in pixels
  BLUR_STRENGTH_MAX: 20,

  //
  MECH_ROTATE_MAX: 0.2,
  MECH_PERSPECTIVE_AMT: 40,
  MECH_SCALE_AMT: 0.5,

  OPACITY_MIN: 0,

  DEBUG: true,
};

// Debug element to render real-time data that's too fast for console.
const debugElement = Params.DEBUG ? addDebugElement(document.body) : undefined;

// Fields are added to this element to simplify debug printing.
const debug = {};

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
  const io = createIntersectionObserver({ isMobile: isMobile(document) });

  // Attach each vignette to the observer
  vignetteElements.forEach((vignette) => {
    io.observe(vignette.shadowRoot.querySelector(".media"));

    // Manually unset CSS variables on init to counteract inital sets
    // resetCSS(vignette);
  });
}

function resetCSS(element) {
  const imgElement = element.shadowRoot.querySelector("img.media");
  imgElement.style.filter = filterBlurString;
  imgElement.style.transform = transformMechString;

  // element.style.filter = `none`;
  // element.style.transform = `rotateX(0.25turn)`;
}

function isMobile(document) {
  const viewportWidth = document.documentElement.clientWidth;
  return viewportWidth < Params.MOBILE_WIDTH_CUTOFF_PX;
}

function createIntersectionObserver({ isMobile }) {
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
  // - `null` root uses viewport
  const ioOptions = {
    root: null,
    rootMargin: `-${rootMarginTop}% 0% -${rootMarginBottom}% 0% `,
    threshold: intersectionThresholds,
  };

  return new IntersectionObserver(ioCallback, ioOptions);

  /**
   * Function that is called every an element crosses a point in `ioOptions.threshold`
   */
  function ioCallback(entries) {
    entries.forEach((entry) => {
      if (Params.DEBUG) {
        // debug.boundRect = entry.boundingClientRect;
        // debug.viewport = entry.rootBounds;
      }

      // How much of the element is visible within the intersection bounds?
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
      // const imgElement = entry.target.shadowRoot.querySelector("img.media");
      const imgElement = entry.target;
      imgElement.style.filter = filterBlurString;
      imgElement.style.transform = transformMechString;
      //
      // entry.target.style.filter = filterBlurString;
      // entry.target.style.transform = transformMechString;

      // Fade in captions
      const imageCaptionElement = entry.target.querySelector(".image-caption");
      if (imageCaptionElement)
        imageCaptionElement.style.opacity = intRatio * intRatio;

      if (Params.DEBUG && entry.target.href.includes("02")) {
        console.log(imgElement.style);
        debug.img = imgElement.style[0];
        const debugString = JSON.stringify(debug, null, 2).replaceAll('"', "");
        debugElement.innerHTML = debugString;
      }

      return;

      function opacity(initRatio) {
        const opacityAmt =
          initRatio * (1 - Params.OPACITY_MIN) + Params.OPACITY_MIN;
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

        if (Params.DEBUG) {
          debug.rotateAmtBase = rotateAmtBase;
          debug.rotateAmt = rotateAmt;
          debug.rotateRatio = ratio;
          debug.scaleAmt = scaleAmt;
          debug.initRatio = ratio;
        }

        return `perspective(${perspectiveAmt}vw) rotateX(${rotateAmt}turn) scale(${scaleAmt})  `;
      }
    });
  }
}

/**
 * Helper function to add elements to a given container.
 */
function addElement(container, tag, { id, classList }) {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (classList) element.classList.add(...classList);
  container.append(element);
  return element;
}

function addVignetteEffectElement(container) {
  return addElement(container, "div", {
    id: "vignetteEffect",
    classList: [],
  });
}

function addDebugElement(container) {
  const debugElement = addElement(container, "div", {
    id: "debug",
  });

  const debugCheckboxElement = addElement(debugElement, "button", {
    id: "debugCheckbox",
  });
  debugCheckboxElement.innerHTML = "Show debug";

  const debugTextElement = addElement(debugElement, "pre", {
    id: "debugText",
  });

  debugCheckboxElement.addEventListener("click", (e) => {
    e.preventDefault();
    debugTextElement.style.display =
      debugTextElement.style.display == "none" ? "block" : "none";
  });

  return debugTextElement;
}
