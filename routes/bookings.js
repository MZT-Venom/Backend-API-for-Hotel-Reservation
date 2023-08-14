const express = require("express");
var router = express.Router();
const room = require("../models/room");
const bookings = require("../models/booking");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51NeLZlFniPfFU8qjQ6ZBOxN8k3b1jYS3Xz8iRNzuayOFyu8fEA5pDaWbLn2vcBxtnVISFJjwIbIPptvwcnGwnQAS002vtyCpBJ"
);
const { v4: uuidv4 } = require("uuid");

router.post("/book", async (req, res) => {
  const { rooms, userid, fromdate, todate, totalDays, totalAmount, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "PKR",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBooking = new bookings({
        room: rooms.name,
        roomid: rooms._id,
        userid,
        fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        totalAmount,
        totalDays,
        transactionid: "123465423",
      });
      const booking = await newBooking.save();

      const roomtemp = await room.findOne({ _id: booking.roomid });

      roomtemp.currentBookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();
    }
    res.send("Payment Successful , Your Room is Booked");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});
router.post("/getbokingbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const booking = await bookings.find({ userid: userid });
    res.json(booking);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});
router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const booking = await bookings.findOne({ _id: bookingid });
    booking.status = "cancelled";
    await booking.save();
    const temproom = await room.findOne({ _id: roomid });
    const current = temproom.currentBookings;
    const temp = current.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    temproom.currentBookings = temp;

    await temproom.save();

    res.send("Your Booking Cancelled Successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bk = await bookings.find();
    res.send(bk);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});
module.exports = router;
