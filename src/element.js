/**
 * Helper function to add elements to a given container.
 */
export function addElement(container, tag, { id, classList }) {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (classList) element.classList.add(...classList);
  container.append(element);
  return element;
}

export function addVignetteEffectElement(container) {
  return addElement(container, "div", {
    id: "vignetteEffect",
    classList: [],
  });
}
