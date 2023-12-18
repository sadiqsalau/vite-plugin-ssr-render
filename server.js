import http from "http";
import parse from "co-body";

const defaultOptions = { pathPrefix: "", port: 5173 };

export default function (render, options = defaultOptions) {
  /** Configurations */
  const pathPrefix = options.pathPrefix || defaultOptions.pathPrefix;
  const port = options.port || defaultOptions.port;

  /** Routes */
  const routes = {
    /** Index Route */
    [pathPrefix + "/"]: () => ({
      status: "OK",
    }),

    /** Render Route */
    [pathPrefix + "/render"]: async (req) => {
      const body = await parse.json(req);
      return await render(body);
    },

    /** 404 Route */
    [pathPrefix + "/404"]: () => ({
      status: "NOT FOUND",
    }),
  };

  http
    .createServer(async (req, res) => {
      let statusCode = 200,
        result;
      try {
        const dispatch = routes[req.url] || routes[pathPrefix + "/404"];
        result = await dispatch(req);
      } catch (e) {
        /** Log error */
        console.error(e);

        /** Set response */
        statusCode = 500;
        result = {
          status: "Failed!",
        };
      }

      /** Send Response */
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    })
    .listen(port);
}
