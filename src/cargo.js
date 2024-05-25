const Params = {
  DEBUG: false,

  ROOT_MARGIN_TOP_DESKTOP: 5,
  ROOT_MARGIN_BOT_DESKTOP: 20,
  ROOT_MARGIN_TOP_MOBILE: 25,
  ROOT_MARGIN_BOT_MOBILE: 30,

  MOBILE_WIDTH_CUTOFF: 640,
  MOBILE_TOP_PADDING_VH: 40,

  // Rate at which the following callback function is called.
  THRESHOLD_RATE: 100,
  CENTER_CUTOFF_Y: 60,

  OPACITY_MIN: 0,

  // Max strength of blur in pixels
  BLUR_STRENGTH_MAX: 20,

  //
  MECH_ROTATE_MAX: 0.2,
  MECH_PERSPECTIVE_AMT: 40,
  MECH_SCALE_AMT: 0.3,
};

const debugElement = Params.DEBUG ? addDebugElement(document.body) : undefined;
const debug = {};

main();

function main() {
  console.log("Scrolling effects by @oxgr");

  const scriptElement = document.querySelector("#scrollingEffects");
  const linkedElements = document.querySelectorAll(".linked");
  const vignetteElements = document.querySelectorAll(".vignette");

  addMainElements({ scriptElement, linkedElements });

  /* mobile checks */
  const viewportWidth = document.documentElement.clientWidth;
  const isMobile = viewportWidth < Params.MOBILE_WIDTH_CUTOFF;
  if (isMobile) {
    vignetteContainer.style.paddingTop = `${Params.MOBILE_TOP_PADDING_VH}vh`;
  }

  /* intersection observer logic */
  const io = createIntersectionObserver({ isMobile });

  // intersection observer listens to movements of each vignette
  linkedElements.forEach((vignette) => {
    io.observe(vignette);

    // // Manually unset filter on init
    resetCSS(vignette);
  });
}

function resetCSS(element) {
  element.style.filter = `none`;
  element.style.transform = `rotateX(0.25turn)`;
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
  const intersectionThresholds = Array(Params.THRESHOLD_RATE)
    .fill(0)
    .map((_, index) => index / Params.THRESHOLD_RATE);

  // Options for IntersectionObserver, `null` root uses viewport
  const ioOptions = {
    root: null,
    rootMargin: `-${rootMarginTop}% 0% -${rootMarginBottom}% 0% `,
    threshold: intersectionThresholds,
  };

  return new IntersectionObserver(ioCallback, ioOptions);

  // Function that is called when an element crosses a point in intersectionThresholds
  function ioCallback(entries) {
    entries.forEach((entry) => {
      const viewportTop = entry.rootBounds.top;
      const boundRectTop = entry.boundingClientRect.top;
      const isHigh = boundRectTop < viewportTop;

      const intRatio = entry.intersectionRatio;

      if (Params.DEBUG) {
        debug.boundRect = entry.boundingClientRect;
        debug.viewport = entry.rootBounds;
      }

      const filterBlurString = filterBlur(intRatio);
      const transformMechString = transformMech(intRatio, isHigh);
      // const opacityString = opacity(initRatio);

      entry.target.style.filter = filterBlurString;
      entry.target.style.transform = transformMechString;
      // entry.target.style.opacity = opacityString;

      if (Params.DEBUG && entry.target.href == "04-yseult") {
        const debugStr = JSON.stringify(debug, null, 2).replaceAll('"', "");
        debugElement.innerHTML = `${debugStr}`;
      }

      return;

      function opacity(initRatio) {
        const opacityAmt =
          initRatio * (1 - Params.OPACITY_MIN) + Params.OPACITY_MIN;
        return `${opacityAmt}`;
      }

      function filterBlur(ratio) {
        // Set blur effect as a ratio of how visible an element is.
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

function addMainElements({ scriptElement, linkedElements }) {
  const mainContainer = scriptElement.parentElement;
  const vignetteContainer = addElement(mainContainer, "div", {
    id: "vignetteContainer",
    classList: ["vignetteContainer"],
  });

  // These elements need to layer on global viewport
  // and this is easier to do with `document.body`
  addVignetteEffectElement(document.body);
  addIntersectionElement(document.body);

  linkedElements.forEach((linkedElement) => {
    // add vignette elements into container
    const vignetteElement = addElement(vignetteContainer, "div", {
      id: linkedElement.href,
      classList: ["vignette"],
    });

    // move .linked images into vignette elements
    vignetteElement.append(linkedElement);
  });
}

function addElement(container, tag, { id, classList }) {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (classList) element.classList.add(...classList);
  container.append(element);
  return element;
}

function addIntersectionElement(container) {
  return addElement(container, "div", {
    id: "intersectionMarker",
    classList: ["passthrough"],
  });
}

function addVignetteEffectElement(container) {
  return addElement(container, "div", {
    id: "vignetteEffect",
    classList: ["passthrough"],
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
