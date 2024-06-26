export const Params = {
  // Used to identify the script element and the container it's in.
  // WARNING: This script relies on manually setting this id to the script element added in Cargo's HTML editor.
  // ```
  //  <script id="scrollingEffects" src="..."></script>
  // ```
  SCRIPT_ID: "scrollingEffects",

  // Margins of intersection observer as ratios of the viewport.
  // Determines the point where vignettes start to react.
  ROOT_MARGIN_TOP_DESKTOP: 5,
  ROOT_MARGIN_BOT_DESKTOP: 20,
  ROOT_MARGIN_TOP_MOBILE: 20,
  ROOT_MARGIN_BOT_MOBILE: 25,

  // If viewport is under this value, consider it mobile.
  MOBILE_WIDTH_CUTOFF_PX: 640,

  // Extra padding added to top
  MOBILE_TOP_PADDING_VH: 40,

  // Rate at which the following callback function is called
  // as fraction of an element's visibility inside the intersection bounds.
  INTERSECTION_RATE: 100,

  // Max strength of blur in pixels
  BLUR_STRENGTH_MAX: 20,

  // Params for mechanical rotate effect.
  MECH_ROTATE_MAX: 0.2,
  MECH_PERSPECTIVE_AMT: 40,
  MECH_SCALE_AMT: 0.5,

  // Min/max brightness of images throughout intersection
  // Can be negative.
  BRIGHTNESS_MIN: 2,
  BRIGHTNESS_MAX: 1,

  // Enables a global visual vignette effect.
  // NOTE: Disabled for legibility of captions.
  VIGNETTE_EFFECT_ENABLE: false,

  // Enable fadein of vignette caption titles
  CAPTION_FADEIN_ENABLE: false,

  // Minimum amount an image is visible before the caption fades in
  CAPTION_FADEIN_THRESHOLD: 0.8,

  // Interval in ms between checks to see if the observer needs to update its element references
  OBSERVER_RESET_WATCHER_INTERVAL: 200,

  DEBUG: false,
};
