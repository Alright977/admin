const express = require("express");
const path = require("path");

const app = express();

// 设置全局app变量
app.set("secret", "asdasdad");
// 使用cors跨域
app.use(require("cors")());
app.use(express.json());
// 访问静态资源
app.use("/uploads", express.static(__dirname + "/uploads"));
// 直接导出函数进行调用传app
require("./routes/admin/index")(app);
require("./plugins/mgdb")(app);
require("./middlewear/admin")(app);

app.listen(3000, () => {
  console.log("server is start port:3000");
});
