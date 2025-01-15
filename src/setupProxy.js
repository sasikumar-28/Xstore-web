const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      // target: "https://aspiresys-ai-server.vercel.app",
      changeOrigin: true,
      secure: false,
    })
  );
};
