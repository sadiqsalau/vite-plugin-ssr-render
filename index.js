import colors from "picocolors";
import parse from "co-body";

const defaultOptions = { path: "/render" };

/**
 * @returns {import("vite").Plugin}
 */
export default function(module, options = defaultOptions) {
    return {
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === options.path && req.method === "POST") {
                    try {
                        const body = await parse.json(req);
                        const { render } = await server.ssrLoadModule(module);
                        const result = await render(body);

                        res.setHeader("Content-type", "application/json");
                        res.end(JSON.stringify(result));
                    } catch (e) {
                        server.config.logger.error(
                            `${colors.red(
                                `${colors.bold("Error during SSR!")}`
                            )}`
                        );
                        server.config.logger.error(e);
                        res.writeHead(500);
                        res.end(JSON.stringify(e.message));
                    }
                } else {
                    next();
                }
            });

            server.httpServer?.once("listening", () => {
                setTimeout(() => {
                    server.config.logger.info(
                        `\n  ${colors.blue(
                            `${colors.bold("SSR PLUGIN")}`
                        )}\n  ${colors.white(
                            `${colors.bold("PATH:")} ${options.path}`
                        )}
                        `
                    );
                }, 100);
            });
        },
    };
};
