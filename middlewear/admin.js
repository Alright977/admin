module.exports = (app) => {
  return async (req, res, next) => {
    // const assert = require("http-assert");
    // mongoose 的模型不能重复导入
    const adminUse = require("../models/adminUser");
    const jwt = require("jsonwebtoken");
    let token = String(req.headers.authorization).split(" ").pop();
    if (token == "undefined") {
      return res.status(401).send({
        message: "请先登陆，没有token",
      });
    }
    // 将token解密
    const { id } = jwt.verify(token, req.app.get("secret"));
    if (!id) {
      return res.status(401).send({
        message: "请先登陆,缺少id",
      });
    }
    req.user = await adminUse.findById(id);
    console.log(req.user);
    if (!req.user) {
      return res.status(401).send({
        message: "请先登陆,没有账户模型",
      });
    }
    await next();
  };
};
