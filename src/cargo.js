main();

function main() {
  console.log("main running from develop!");
  const io = registerIO();

  const linkedElements = document.querySelectorAll(".linked");

  linkedElements.forEach((vignette) => {
    io.observe(vignette);
  });
}

function registerIO() {
  const THRESHOLD_RATE = 50;
  const threshold = Array(THRESHOLD_RATE)
    .fill(0)
    .map((_, i) => i / THRESHOLD_RATE);

  const ioOptions = { root: null, rootMargin: "-10% 0% -10% 0%", threshold };

  const ioCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        // console.log({
        //   entry,
        //   target: entry.target,
        //   id: entry.target.id,
        //   ratio: entry.intersectionRatio,
        // });
      }

      /** adjust ratio behavior **/
      const RATIO_CORRECTION_FACTOR = 1.2;
      const ratio = entry.intersectionRatio * RATIO_CORRECTION_FACTOR;
      // const ratio = Math.pow(entry.intersectionRatio, 0.5);
      // console.log({ int: entry.intersectionRatio, ratio });

      /** blur effect **/
      const BLUR_PX_MAX = 20;
      const blurAmt = BLUR_PX_MAX - Math.round(ratio * BLUR_PX_MAX);
      entry.target.style.filter = `blur(${blurAmt}px)`;

      /** mech effect **/
      // const ROTATE_MAX = 0.5;
      // const rotateAmt = ROTATE_MAX - ratio * ROTATE_MAX;
      // entry.target.style.transform = `rotateX(${rotateAmt}turn)`;
    });
  };
  return new IntersectionObserver(ioCallback, ioOptions);
}
