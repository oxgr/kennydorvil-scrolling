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
  // Register IntersectionObserver
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log({
          entry,
          target: entry.target,
          id: entry.target.id,
          ratio: entry.intersectionRatio,
        });
        if (entry.intersectionRatio > 0.5) {
          // Add 'active' class if observation target is inside viewport
          entry.target.classList.add("active");
          debug.innerHTML = `#${entry.target.id.toString()} -> ${entry.target.classList.toString()}`;
        } else {
          // Remove 'active' class otherwise
          entry.target.classList.remove("active");
        }
      });
    },
    { root: null, threshold: [0.2, 0.5] },
  );
}
