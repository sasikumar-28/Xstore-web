const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      // target: "https://chat-gpt-server-eight.vercel.app/",
      changeOrigin: true,
      secure: false,
    })
  );
};
