const mongoose = require("mongoose");

const collaborationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("collaborations", collaborationSchema);
