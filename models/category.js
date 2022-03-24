// 分类模型
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  parent: {
    // mongodb的id类型
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Category", schema);
