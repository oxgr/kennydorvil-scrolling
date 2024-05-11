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
    resetCSS(vignette);
  });
}

function resetCSS(element) {
  element.style.filter = `none`;
  element.style.transform = `rotateX(0.25turn)`;
}

function createIntersectionObserver(rootElement) {
  const viewportWidth = document.documentElement.clientWidth;

  // General approximation of bottom nav bar
  // desktop ~= 90-100px
  // mobile ~= 70-80px
  const NAVBAR_HEIGHT = 100;

  // Rate at which the following callback function is called.
  const MOBILE_WIDTH_CUTOFF = 640;
  const isMobile = viewportWidth < MOBILE_WIDTH_CUTOFF;
  const ROOT_MARGIN_TOP = isMobile ? 10 : 5;
  const ROOT_MARGIN_BOT = isMobile ? 25 : 20;
  // const ROOT_MARGIN_BOT = 20;
  const THRESHOLD_RATE = 100;
  const CENTER_CUTOFF_Y = 60;

  const OPACITY_MAX = 0.5;

  // Max strength of blur in pixels
  const BLUR_STRENGTH_MAX = 20;

  // If element is above this value, set to max (1.0 = whole element is visible)
  const BLUR_MIN_VISIBILITY_THRESHOLD = 1;
  const MECH_MIN_VISIBILITY_THRESHOLD = 0.95;

  //
  const MECH_ROTATE_MAX = 0.25;
  const MECH_PERSPECTIVE_AMT = 40;
  const MECH_SCALE_AMT = 0.3;
  const MECH_SCALE_OFFSET = 1 - MECH_SCALE_AMT;

  // Fill an array with evenly dispersed values normalised 0.0-1.0
  // Points are used to trigger at what visibility points the callback function is triggered.
  const intersectionThresholds = Array(THRESHOLD_RATE)
    .fill(0)
    .map((_, i) => i / THRESHOLD_RATE);

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

      const viewportCenterY = entry.rootBounds.height * 0.5;
      const intRatioY = entry.intersectionRect.top;

      const intRatio = entry.intersectionRatio;

      // console.log({
      //   id: entry.target.href,
      //   intRatio,
      //   intRatioY,
      //   viewportCenterY,
      // });

      // if (intRatio == 1 && intRatioY > viewportCenterY) {
      //   console.log("intRatio is 1! :: ", entry);
      //   return;
      // }

      // console.log(intRatio);
      // if (intRatio == 0) {
      //   resetCSS(entry.target);
      //   return;
      // }

      const filterBlurString = filterBlur(intRatio);
      const transformMechString = transformMech(intRatio);
      // const opacityString = opacity(initRatio);

      entry.target.style.filter = filterBlurString;
      entry.target.style.transform = transformMechString;
      // entry.target.style.opacity = opacityString;

      // entry.target.classList.add("spin");
      // if (initRatio < 0.1) {
      //   entry.target.classList.remove("spin");
      //   // entry.target.style.animation = "none";
      // }

      if (entry.target.href == "04-yseult") {
        const debugStr = JSON.stringify(debug, null, 2).replaceAll('"', "");
        // const entryY = entries.map((e) => e.target.getBoundingClientRect().y);
        // const entryStr = JSON.stringify(entryY, null, 2).replaceAll('"', "");
        // debugElement.innerHTML = `${debugStr}\n${entryStr}`;
        debugElement.innerHTML = `${debugStr}`;
      }

      return;

      function opacity(initRatio) {
        const opacityAmt = initRatio * OPACITY_MAX + (1 - OPACITY_MAX);
        return `${opacityAmt}`;
      }

      function filterBlur(initRatio) {
        // Set ratio to max if element is above minimum visibility threshold.
        const blurRatio =
          initRatio > BLUR_MIN_VISIBILITY_THRESHOLD ? 1 : initRatio;

        // Set blur effect as a ratio of how visible an element is.
        const blurAmt =
          BLUR_STRENGTH_MAX - Math.round(blurRatio * BLUR_STRENGTH_MAX);
        return `blur(${blurAmt}px) brightness(${opacity(blurRatio) * 100}%)`;
      }

      function transformMech(initRatio) {
        const mechRatio =
          initRatio > MECH_MIN_VISIBILITY_THRESHOLD ? 1 : initRatio;

        if (mechRatio == 1) return "";

        /** mech effect **/
        const rotateAmtBase = MECH_ROTATE_MAX - mechRatio * MECH_ROTATE_MAX;
        // const isLow = eb.y > CENTER_CUTOFF_Y;
        // const rotateAmt = isLow ? rotateAmtBase * -1 : rotateAmtBase;

        const rotateAmt = -rotateAmtBase;
        const scaleAmt = MECH_SCALE_OFFSET + mechRatio * MECH_SCALE_AMT;
        // const scaleAmt = 1;

        debug.rotateAmtBase = rotateAmtBase;
        debug.rotateAmt = rotateAmt;
        debug.rotateRatio = mechRatio;
        debug.scaleAmt = scaleAmt;
        debug.initRatio = initRatio;

        return `perspective(${MECH_PERSPECTIVE_AMT}vw) rotateX(${rotateAmt}turn) scale(${scaleAmt})  `;
        // return `rotateX(${rotateAmt}turn)  `;
        //
      }
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
