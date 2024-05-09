main();

function main() {
  console.log("main running from develop!");
  const io = registerIO();

  const linkedElements = document.querySelectorAll(".linked");

  linkedElements.forEach((vignette) => {
    io.observe(vignette);
    vignette.style.filter = `blur(0px)`;
  });
}

function registerIO() {
  // Fill an array with 20 evenly dispersed values normalised 0.0-1.0
  // Determines at which points of visibiility (1.0 = whole element is visible)
  // that the callback function is called.
  const THRESHOLD_RATE = 20;
  const threshold = Array(THRESHOLD_RATE)
    .fill(0)
    .map((_, i) => i / THRESHOLD_RATE);

  // Options for IntersectionObserver, `null` root uses viewport
  const ioOptions = { root: null, rootMargin: "-10% 0% -10% 0%", threshold };

  // Max strength of blur in pixels
  const BLUR_STRENGTH_MAX = 20;
  const MIN_VISIBILITY_THRESHOLD = 0.8;

  const ioCallback = (entries) => {
    entries.forEach((entry) => {
      // console.log({ entry });

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
