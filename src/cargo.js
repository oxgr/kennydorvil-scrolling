const debug = addDebugElement(document.body);
main();

function main() {
  console.log("main running from develop!");

  const vignetteContainer = document.querySelector(".vignetteContainer");

  const mainParentElement = vignetteContainer.parentNode;

  const vignetteEffectElement = addVignetteEffectElement(document.body);
  const intersectionMarkerElement = addIntersectionElement(document.body);

  const linkedElements = document.querySelectorAll(".linked");

  linkedElements.forEach((linkedElement) => {
    const vignetteElement = addElement(vignetteContainer, "div", {
      id: linkedElement.href,
      classList: ["vignette"],
    });

    vignetteElement.append(linkedElement);
  });

  const io = createIntersectionObserver(vignetteContainer);

  linkedElements.forEach((vignette) => {
    io.observe(vignette);

    // // Manually unset filter on init
    vignette.style.filter = `none`;
    // vignette.style.filter = `rotateX(0.5turn)`;
  });
}

function createIntersectionObserver(rootElement) {
  // Rate at which the following callback function is called.
  const THRESHOLD_RATE = 100;
  const ROOT_MARGIN_TOP = 20;
  const ROOT_MARGIN_BOT = 30;
  const CENTER_CUTOFF_Y = 80;

  // Max strength of blur in pixels
  const BLUR_STRENGTH_MAX = 20;

  // If element is above this value, set to max (1.0 = whole element is visible)
  const BLUR_MIN_VISIBILITY_THRESHOLD = 0.7;
  const MECH_MIN_VISIBILITY_THRESHOLD = 1.0;

  //
  const MECH_ROTATE_MAX = 0.2;
  const MECH_PERSPECTIVE_AMT = 80;
  const MECH_SCALE_FACTOR = 0.2;

  // Fill an array with evenly dispersed values normalised 0.0-1.0
  // Points are used to trigger at what visibility points the callback function is triggered.
  const intersectionThresholds = Array(THRESHOLD_RATE)
    .fill(0)
    .map((_, i) => i / THRESHOLD_RATE);

  console.log(rootElement);

  // Options for IntersectionObserver, `null` root uses viewport
  const ioOptions = {
    root: null,
    // root: rootElement,
    rootMargin: `-${ROOT_MARGIN_TOP}% 0% -${ROOT_MARGIN_BOT}% 0% `,
    threshold: intersectionThresholds,
  };

  // Function that is called when an element crosses a point in intersectionThresholds
  const ioCallback = (entries) => {
    entries.forEach((entry) => {
      const elem = entry.target;
      console.log(entry);

      const rb = entry.rootBounds;
      const eb = entry.boundingClientRect;

      const rbMidY = rb.top + rb.height * 0.5;
      const ebAtCenterY = rbMidY - eb.height * 0.5;
      const IS_CENTER_CORRECTION = 100;

      const initRatio = entry.intersectionRatio;

      // if (elem.href == "07-aw-adieu") console.log({ elem: entry });

      // Set ratio to max if element is above minimum visibility threshold.
      const blurRatio =
        initRatio > BLUR_MIN_VISIBILITY_THRESHOLD ? 1 : initRatio;

      // Set blur effect as a ratio of how visible an element is.
      // const blurAmt = BLUR_STRENGTH_MAX - Math.round(blurRatio * BLUR_STRENGTH_MAX);
      // entry.target.style.filter = `blur(${blurAmt}px)`;

      const rotateRatio =
        initRatio > MECH_MIN_VISIBILITY_THRESHOLD ? 1 : initRatio;
      /** mech effect **/
      const rotateAmtBase = MECH_ROTATE_MAX - rotateRatio * MECH_ROTATE_MAX;
      const bounds = entry.target.getBoundingClientRect();
      const isLow = bounds.y > CENTER_CUTOFF_Y;
      const rotateAmt = isLow ? rotateAmtBase * -1 : rotateAmtBase;
      // const perspeAmt = 500 - rotateRatio * 500;
      const scaleAmt = initRatio * MECH_SCALE_FACTOR + (1 - MECH_SCALE_FACTOR);
      entry.target.style.transform = `perspective(${MECH_PERSPECTIVE_AMT}vw) rotateX(${rotateAmt}turn)  scale(${scaleAmt})`;
      // entry.target.style.transform = `rotateX(${rotateAmt}turn)  `;

      const d = {
        rotateAmt,
        initRatio,
      };
      const dStr = JSON.stringify(d, null, 2).replaceAll('"', "");

      const e = entries.map((e) => e.target.getBoundingClientRect().y);
      const eStr = JSON.stringify(e, null, 2).replaceAll('"', "");

      debug.innerHTML = `${dStr}\n${eStr}`;
    });
  };

  return new IntersectionObserver(ioCallback, ioOptions);
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
  return addElement(container, "pre", {
    id: "debug",
  });
}
