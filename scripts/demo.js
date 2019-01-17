const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const mm = require("micromatch");

const devMock = require("react-coat-dev-utils/express-middleware/dev-mock").default;

const paths = require(path.join(__dirname, "../config/paths"));
const appPackage = require(path.join(paths.rootPath, "./package.json"));
const htmlTpl = fs.readFileSync(path.join(paths.distPath, "index.html"), "utf8");
const [, , port] = appPackage.devServer.url.split(/:\/*/);

const getProxys = proxyMap => {
  if (typeof proxyMap === "function") {
    proxyMap = proxyMap();
  }
  if (Array.isArray(proxyMap)) {
    proxyMap = proxyMap.reduce((pre, cur) => {
      const url = cur.context;
      if (typeof url === "string") {
        pre[url] = true;
      } else {
        url.forEach(key => {
          pre[key] = true;
        });
      }
      return pre;
    }, {});
  }
  return Object.keys(proxyMap);
};

const devServer = proxyMap => {
  const passUrls = getProxys(proxyMap);
  return (req, res, next) => {
    if (passUrls.some(reg => mm.isMatch(req.url, reg))) {
      next();
    } else {
      res.send(htmlTpl);
    }
  };
};
const app = express();
app.use("/", express.static(paths.distPath, {fallthrough: true}));
app.use(devServer(appPackage.devServer.proxy));
app.use(devMock(appPackage.devServer.mock, appPackage.devServer.proxy, true));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green ${appPackage.devServer.url}/} \n`));
