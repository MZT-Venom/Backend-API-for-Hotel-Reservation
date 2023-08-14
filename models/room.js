const { default: mongoose } = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    maxCount: {
      type: Number,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    images: [],
    roomType: {
      type: String,
      required: true,
    },
    currentBookings: [],
    description: {
      type: String,
      requierd: true,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomSchema);

module.exports = roomModel;
