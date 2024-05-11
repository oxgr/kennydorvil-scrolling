const debugElement = addDebugElement(document.body);
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

  const vignetteElements = document.querySelectorAll(".vignette");
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
  const ROOT_MARGIN_TOP = 10;
  const ROOT_MARGIN_BOT = 25;
  const CENTER_CUTOFF_Y = 60;

  // Max strength of blur in pixels
  const BLUR_STRENGTH_MAX = 20;

  // If element is above this value, set to max (1.0 = whole element is visible)
  const BLUR_MIN_VISIBILITY_THRESHOLD = 0.7;
  const MECH_MIN_VISIBILITY_THRESHOLD = 0.8;

  //
  const MECH_ROTATE_MAX = 0.2;
  const MECH_PERSPECTIVE_AMT = 90;
  const MECH_SCALE_AMT = 0.3;
  const MECH_SCALE_OFFSET = 1 - MECH_SCALE_AMT;

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
      let debug = {};
      // const elem = entry.target;
      // console.log(entry);

      const rb = entry.rootBounds;
      const eb = entry.boundingClientRect;

      const rbMidY = rb.top + rb.height * 0.5;
      const ebAtCenterY = rbMidY - eb.height * 0.5;
      const IS_CENTER_CORRECTION = 100;

      const initRatio = entry.intersectionRatio;

      const filterBlurString = (() => {
        // Set ratio to max if element is above minimum visibility threshold.
        const blurRatio =
          initRatio > BLUR_MIN_VISIBILITY_THRESHOLD ? 1 : initRatio;

        // Set blur effect as a ratio of how visible an element is.
        const blurAmt =
          BLUR_STRENGTH_MAX - Math.round(blurRatio * BLUR_STRENGTH_MAX);
        return `blur(${blurAmt}px)`;
      })();

      const transformMechString = (() => {
        const mechRatio =
          initRatio > MECH_MIN_VISIBILITY_THRESHOLD ? 1 : initRatio;

        if (mechRatio == 1) return "";

        /** mech effect **/
        const rotateAmtBase = MECH_ROTATE_MAX - mechRatio * MECH_ROTATE_MAX;
        // const isLow = eb.y > CENTER_CUTOFF_Y;
        // const rotateAmt = isLow ? rotateAmtBase * -1 : rotateAmtBase;

        const rotateAmt = -rotateAmtBase;
        // const scaleAmt =
        //   MECH_SCALE_OFFSET +
        //   (MECH_SCALE_AMT - (MECH_SCALE_AMT - mechRatio * MECH_SCALE_AMT));
        const scaleAmt = 1;

        debug.rotateAmtBase = rotateAmtBase;
        debug.rotateAmt = rotateAmt;
        debug.rotateRatio = mechRatio;
        debug.scaleAmt = scaleAmt;
        debug.initRatio = initRatio;

        return `perspective(${MECH_PERSPECTIVE_AMT}vw) rotateX(${rotateAmt}turn)  scale(${scaleAmt})`;
        // return `rotateX(${rotateAmt}turn)  `;
        //
      })();

      entry.target.style.filter = filterBlurString;
      // entry.target.style.transform = transformMechString;
      entry.target.classList.add("spin");
      if (initRatio < 0.1) {
        entry.target.classList.remove("spin");
        // entry.target.style.animation = "none";
      }

      const debugStr = JSON.stringify(debug, null, 2).replaceAll('"', "");

      const entryY = entries.map((e) => e.target.getBoundingClientRect().y);
      const entryStr = JSON.stringify(entryY, null, 2).replaceAll('"', "");

      debugElement.innerHTML = `${debugStr}\n${entryStr}`;
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
