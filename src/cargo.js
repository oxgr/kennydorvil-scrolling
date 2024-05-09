main();

function main() {
  console.log("main running from develop!");

  const vignetteEffectElement = addVignetteEffectElement(document.body);
  const intersectionElement = addIntersectionElement(document.body);
  const vignetteContainer = document.querySelector(".vignetteContainer");

  const io = registerIO(vignetteContainer);

  const linkedElements = document.querySelectorAll(".linked");

  linkedElements.forEach((vignette) => {
    io.observe(vignette);
    vignette.style.filter = `blur(0px)`;
  });
}

function registerIO(rootElement) {
  // Rate at which the following callback function is called.
  const THRESHOLD_RATE = 20;

  // Max strength of blur in pixels
  const BLUR_STRENGTH_MAX = 20;

  // If element is above this value, set to max (1.0 = whole element is visible)
  const MIN_VISIBILITY_THRESHOLD = 0.9;

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
    rootMargin: "-20% 0% -20% 0%",
    threshold: intersectionThresholds,
  };

  // Function that is called when an element crosses a point in intersectionThresholds
  const ioCallback = (entries) => {
    entries.forEach((entry) => {
      const elem = entry.target;

      // if (elem.href == "07-aw-adieu") console.log({ elem: entry });

      // Set ratio to max if element is above minimum visibility threshold.
      const ratio =
        entry.intersectionRatio > MIN_VISIBILITY_THRESHOLD
          ? 1
          : entry.intersectionRatio;

      // Set blur effect as a ratio of how visible an element is.
      const blurAmt = BLUR_STRENGTH_MAX - Math.round(ratio * BLUR_STRENGTH_MAX);
      entry.target.style.filter = `blur(${blurAmt}px)`;

      /** mech effect **/
      // const ROTATE_MAX = 0.5;
      // const rotateAmt = ROTATE_MAX - ratio * ROTATE_MAX;
      // entry.target.style.transform = `rotateX(${rotateAmt}turn)`;
    });
  };
  return new IntersectionObserver(ioCallback, ioOptions);
}

function addIntersectionElement(container) {
  const element = document.createElement("div");
  element.classList.add("intersection", "passthrough");
  container.append(element);
  return element;
}

function addVignetteEffectElement(container) {
  const element = document.createElement("div");
  element.classList.add("passthrough");
  element.id = "vignetteEffect";
  container.append(element);
  return element;
}