const path = require("path");
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        msdllib: path.resolve(path.join(__dirname, "src/"))
      }
    }
  }
};
