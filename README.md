# Scrolling effects for kennydorvil.com

This repo contains interactive scrolling effects developed by @oxgr for the portfolio website for Kenny Dorvil. The work was originally commissioned by Allen's Cruz - designer of the site.

The site runs on [Cargo](https://cargo.site) with code in this repository imported via [JSDelivr](https://www.jsdelivr.com/).

The production site can be seen at [kennydorvil.com](https://kennydorvil.com/)

## Development

Although Cargo provides a built-in code editor in their interface, the UI is horrible for making anything beyond simple changes and has no concept of versioning.

Development is mostly done by adding a `script` tag within Cargo's custom HTML editor and setting the `src` to somewhere we can make quick edits to.

```html
<link href="https://<url>/src/cargo.css" rel="stylesheet" />
<script
  id="scrollingEffects"
  src="https://<url>/src/cargo.js"
  type="module"
></script>
```

The best experience would be a local dev server (`npm run dev --port <port>`) and a [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) to expose the port to the internet for an ephemeral period. Tailscale has a decent free tier, though requires OIDC authentication through big tech accounts.

Otherwise, you can publish a specific branch of the repo to Github Pages and track the resulting link instead (`https://<user>.github.io/<repo>/src/cargo.js`). GH Pages has to run an Action in the background on every push to the branch so the delay between a `git push` and seeing code online can get cumbersome over time.

### Site clones & tracking URLs

To simplify development, it will be helpful to have two copies of the Cargo site, plus the production site:

- One for development. Ideally tracks working `[feat|fix]/` branch;
- One for staging and presenting ideas. Ideally tracks Tailscale Funnel URL or `develop` branch.
- Production site. Tracks _JsDelivr_ CDN with a versioned tag.

### Running

1. Run the Vite dev server.

```sh
npm install && npm run dev
```

2. Optional: run a Tailscale Funnel.

```sh
sudo tailscale funnel <port>
```

3. Open the development Cargo site.

### Building

Run `npm run build` and see artifacts in `dist/`.

## Deployment

1. Tag a release by either:
   a. Add a tag corresponding to the version on the commit on `main` to release, or;
   b. Create a release with the build artifacts.
   > If you don't explicitly create a release or use a Github Action, ensure that this commit includes the latest build in the `dist/` directory.
2. Add similar `link` and `script` tags to the production site.
3. Track the _JsDelivr_ link for the repo, making sure to add the version tag.

```html
<link
  href="https://cdn.jsdelivr.net/gh/<gh-user>/<gh-repo>@<tag>/dist/index.css"
  rel="stylesheet"
/>
<script
  id="scrollingEffects"
  src="https://cdn.jsdelivr.net/gh/<gh-user>/<gh-repo>@<tag>/dist/index.js"
  type="module"
></script>
```

> JsDelivr caches requests per link. If you track `main`, it might be a headache to have JsDelivr update their cache on-demand. Tracking per tag ensures you get the right version every time.

## Known issues

### `c is undefined`

On building the bundle, the resulting `dist/index.js` gives an error `c is undefined` when run and breaks the intended effect. This error does not occur when running `src/cargo.js`.

Due to this, the production site currently runs `src/cargo.js`. The difference is size (2.3KB `dist` vs 8.5KB `src`) might seem like a big percentage, but is still small enough to be negligible.

### Preact virtual DOM resets Observer references

Cargo uses Preact to build a Cargo site. With the way the routing and virtual DOM works, navigating backwards to the homepage renews the elements on the page to new references.

This causes the IntersectionObserver to not work. Old element referenced by the observer are not `null`, but they certainly don't look like they exist.

Resetting the observer reintroduces the scrolling. This is done by:

1. disconnecting with observer from all listeners;
2. querying `media-item` elements again;
3. reconnecting observer to new elements.

~Currently, the check is done via a timer than logs of the current URL and keeps track of whether it changed.~
~Ideally, we would listen to some sort of navigation event fired by Preact/Cargo that we could listen to in order to reset only when needed. A ticket has been sent to Cargo support.~

It was found that while the previous solution worked on most devices, it completely broke on iOS devices.

The Cargo dev team provided a way to attach an event to the Preact store that fires when a page is rendered (`onPageRender()`).
