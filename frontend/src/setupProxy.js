const { createProxyMiddleware } = require("http-proxy-middleware");

// const proxyTarget = process.env.API_URL || "http://localhost:8080";
const proxyTarget = "http://localhost:8080";

module.exports = function (app) {
  app.use("/", createProxyMiddleware({ target: proxyTarget }));
};
