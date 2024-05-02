import "./style.css";

main();

function main() {
  const debugText = document.querySelector("#debugText")!;
  const debugBtn = document.querySelector("#debugBtn")!;

  // const app = document.querySelector<HTMLDivElement>("#app")!;
  const vignettes = document.querySelector<HTMLDivElement>(".vignettes")!;

  const intersection = document.querySelector(".intersection")!;

  const vignetteElements = addElements(vignettes);
  const io = registerIO(intersection, debugText);

  vignetteElements.forEach((vignette) => {
    io.observe(vignette);
  });

  debugBtn.addEventListener("click", (_) => {
    io.takeRecords();
  });
}

function addElements(container: Element) {
  const vignettePaths = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
  ];

  vignettePaths.forEach((path, i) => {
    container.innerHTML += `
    <div id="${++i} "class="vignette">
      <img src="/images/${path}">
    </div>
  `;
  });

  return document.querySelectorAll(".vignette");
}

function registerIO(root: Element, debug: Element) {
  const threshold = Array(100)
    .fill(0)
    .map((_, i) => i * 0.01);

  console.log({ threshold });
  // Register IntersectionObserver
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          // console.log({
          //   entry,
          //   target: entry.target,
          //   id: entry.target.id,
          //   ratio: entry.intersectionRatio,
          // });
        }

        // if (entry.intersectionRatio > 0.8) {
        //   entry.target.style.filter = `blur(0px)`;
        //   return;
        // }

        const BLUR_PX_MAX = 20;
        // const ratio = Math.pow(entry.intersectionRatio, 0.5);
        const RATIO_CORRECTION_FACTOR = 1.5;
        const ratio = entry.intersectionRatio * RATIO_CORRECTION_FACTOR;
        // console.log({ int: entry.intersectionRatio, ratio });
        const blurAmt = BLUR_PX_MAX - Math.round(ratio * BLUR_PX_MAX);
        entry.target.style.filter = `blur(${blurAmt}px)`;

        // if (entry.intersectionRatio > 0.5) {
        //   // Add 'active' class if observation target is inside viewport
        //   entry.target.classList.add("active");
        //   debug.innerHTML = `#${entry.target.id.toString()} -> ${entry.target.classList.toString()}`;
        // } else {
        //   // Remove 'active' class otherwise
        //   entry.target.classList.remove("active");
        // }
      });
    },
    { root: null, rootMargin: "-20% 0% -20% 0%", threshold },
  );
}
