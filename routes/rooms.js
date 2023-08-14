const express = require("express");
var router = express.Router();

const Room = require("../models/room");

router.get("/getAllRooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    return res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getroombyid", async (req, res) => {
  const roomId = req.body.roomid;
  try {
    const room = await Room.findOne({ _id: roomId });
    return res.send(room);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/addroom", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.send("Room added Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
