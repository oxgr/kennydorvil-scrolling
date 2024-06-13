import { addElement } from "./element.js";
import { Params } from "./params.js";

export const debug = Debug(Params.DEBUG);

/**
 * Abstraction for debugging in real-time with an overlay HTML element.
 * @param {boolean} enable - allow dynamically enabling the debug object. Useful for disabling debugging, but keeping references to `debug.print()` in code.
 */
function Debug(enable) {
  if (!enable)
    return {
      enabled: false,
      element: null,
      obj: {},
      add: () => {},
      print: () => {},
    };

  const D = {};

  D.enabled = enable;

  /**
   * Element to render real-time data that's too fast for console.
   * @type {HTMLElement}
   */
  D.element = _addDebugElement(document.body);

  /**
   * Things to debug are added as fields to this element to simplify debug printing.
   * @type {object}
   */
  D.obj = {};

  D.add = (key, val) => {
    if (!D.enabled) return;
    D.obj[key] = val;
  };

  D.print = () => {
    if (!D.enabled) return;
    console.debug(D.obj);
    // const debugString = JSON.stringify(obj, null, 2).replaceAll('"', "");
    // D.element.innerHTML = debugString;
  };

  return D;

  function _addDebugElement(container) {
    const debugElement = addElement(container, "div", {
      id: "debug",
    });

    const debugCheckboxElement = addElement(debugElement, "button", {
      id: "debugCheckbox",
    });
    debugCheckboxElement.innerHTML = "Show debug";

    const debugTextElement = addElement(debugElement, "pre", {
      id: "debugText",
    });

    debugCheckboxElement.addEventListener("click", (e) => {
      e.preventDefault();
      debugTextElement.style.display =
        debugTextElement.style.display == "none" ? "block" : "none";
    });

    return debugTextElement;
  }
}
