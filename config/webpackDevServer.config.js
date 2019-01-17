const devMock = require("react-coat-dev-utils/express-middleware/dev-mock").default;
const path = require("path");
const paths = require("./paths");

const appPackage = require(path.join(paths.rootPath, "./package.json"));

const config = {
  contentBase: paths.publicPath,
  watchContentBase: true,
  publicPath: "/",
  compress: true,
  historyApiFallback: true,
  hot: true,
  overlay: {
    warnings: true,
    errors: true,
  },
  stats: {
    colors: true,
  },
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  proxy: appPackage.devServer.proxy,
  before: app => {
    app.use(devMock(appPackage.devServer.mock, appPackage.devServer.proxy, true));
  },
};
module.exports = config;
