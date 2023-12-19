# Vite SSR Render Plugin

## Installation

Install with a package manager:

```bash
# Install via npm
npm install --save-dev vite-plugin-ssr-render

# or yarn
yarn add vite-plugin-ssr-render --dev

# or pnpm
pnpm add -D vite-plugin-ssr-render
```

## Usage

The plugin adds a middleware to Vite to enable SSR during development by handling JSON post requests to the Vite server. The default path is `/render`.

Example.

`vite.config.js`

```js
import ssrRender from "vite-plugin-ssr-render";

plugins: [
  /** Plugins */
  react(),
  ssrRender("./src/ssr.jsx"),
];
```

`src/ssr.jsx`

```js
export const render = async ({ url }) => {
  const html = ReactDOMServer.renderToString(<App url={url} />);

  return {
    html,
  };
};
```

You can now make a post request once the Vite server has started.
An example based on the above code:

A post request to `http://localhost:5173/render`

```json
{
  "url": "/home"
}
```

`Response`

```json
{
  "html": "<div>Welcome to our site!</div>"
}
```

## Standalone SSR Server

You can also create a standalone SSR server using the plugin.

`ssr-server.js`

```js
import createSsrServer from "vite-plugin-ssr-render/server";
import { render } from "./src/ssr.jsx";

createSsrServer(async (body) => {
  return await render(body);
});
```

## Options

The plugin accepts the following options

| Options      | Default Value |                    Description |
| ------------ | :-----------: | -----------------------------: |
| `pathPrefix` |     `''`      |               SSR route prefix |
| `port`       |    `5173`     | Port for the standalone server |

`vite.config.js`

```js
import ssrRender from "vite-plugin-ssr-render";

plugins: [
  /** Plugins */
  react(),
  ssrRender("./src/ssr.jsx", { pathPrefix: "/ssr" }),
];
```

`ssr-server.js`

```js
import createSsrServer from "vite-plugin-ssr-render/server";
import { render } from "./src/ssr.jsx";

createSsrServer(
  async (options) => {
    return await render(options);
  },
  {
    pathPrefix: "/ssr",
    port: 3000,
  }
);
```
