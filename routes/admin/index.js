module.exports = (app) => {
  const express = require("express");
  // token 插件
  const jwt = require("jsonwebtoken");
  const adminUse = require("../../models/adminUser");
  const router = express.Router({
    // 合并url到route里面来
    mergeParams: true,
  });

  // 添加分类列表
  router.post("/create", async (req, resp) => {
    const model = await req.Model.create(req.body);
    resp.send(model);
  });

  // 获取分类列表
  router.get("/list", async (req, resp) => {
    // populate 关联取出parent这个ID的数据
    let tableData;
    let queryOpions = {};
    if (req.Model.modelName === "Categories") {
      queryOpions.populate = "parent";
    }
    tableData = await req.Model.find().setOptions(queryOpions).limit(10);
    resp.send(tableData);
  });

  // 根据id查询分类列表
  router.get("/:id", async (req, resp) => {
    const list = await req.Model.findById(req.params.id);
    resp.send(list);
  });

  // 根据id修改分类名称
  router.put("/:id", async (req, resp) => {
    // parent为空的话则会转换id失败
    req.body.parent = req.params.id;
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    resp.send(model);
  });

  // 根据id删除分类
  router.delete("/:id", async (req, resp) => {
    await req.Model.findByIdAndDelete(req.params.id);
    resp.send({
      success: true,
    });
  });

  // 处理模型的中间件
  const middleModel = require("../../middlewear/model");

  //处理登陆中间件
  const middleAdmin = require("../../middlewear/admin");

  app.use("/admin/api/rest/:resource", middleAdmin(), middleModel(), router);

  // 使用multer插件处理上传图片
  const multer = require("multer");
  const path = require("path");
  // 使用path连接地址
  const upload = multer({ dest: path.join(__dirname, "../../uploads") });
  app.post(
    "/admin/api/upload",

    upload.single("file"),
    async function (req, res) {
      const file = req.file;
      file.url = `http://localhost:3000/uploads/${file.filename}`;
      res.send(file);
    },
    middleAdmin
  );

  // 登陆接口
  app.post("/admin/api/login", async (req, res) => {
    // 1. 通过用户名查找数据库
    const { username, password } = req.body;

    const user = await adminUse
      .findOne({
        username: username,
      })
      .select("+password");
    if (!user) {
      return res.status(422).send({
        message: "用户不存在",
      });
    }
    // 2. 校验密码
    const isValid = require("bcrypt").compareSync(password, user.password);
    if (!isValid) {
      return res.status(422).send({
        message: "密码错误",
      });
    }
    // 3. 返回token
    const token = jwt.sign({ id: user._id }, app.get("secret"));
    res.send({
      token: token,
      userId: user._id,
    });
  });
};
