import "./style.css";

const vignettes = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="vignettes"></div>

`;

for (const path of vignettes) {
  document.querySelector<HTMLDivElement>(".vignettes")!.innerHTML += `
    <div class="vignette">
      <img src="/images/${path}">
    </div>
  `;
}
