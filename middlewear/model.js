module.exports = () => {
  return (req, resp, next) => {
    const adminUse = require("../models/adminUser");
    // 通过inflection插件将取到的动态resource的地址第一个转为大写并且会把复数形式变为单数
    const modelName = require("inflection").classify(req.params.resource);
    if (modelName == "AdminUser") {
      req.Model = adminUse;
    } else {
      req.Model = require(`../models/${modelName}`);
    }

    next();
  };
};
