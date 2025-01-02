const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

const mongo_uri = process.env.db_uri;
const PORT = 5000;
const serverURL = process.env.server_url;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Use the cookie-parser middleware

// Connect to MongoDB
mongoose.connect(mongo_uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Root Route
app.get("/", async (req, res) => {
  res.send("Welcome To Restaurant App");
});

// Fetch user-specific bookings
app.get("/bookings", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  try {
    const userBookings = await Booking.find({ userId });
    res.json(userBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to validate bookings
const validateBooking = async (req, res, next) => {
  const { date, time } = req.body;
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  const bookingDate = new Date(`${date}T${time}`);
  const currentDate = new Date();

  // Check if the date and time are in the past
  if (bookingDate < currentDate) {
    return res.status(400).json({ error: "Cannot book for a past date or time." });
  }

  // Check for duplicate bookings
  const existingBooking = await Booking.findOne({ date, time, userId });
  if (existingBooking) {
    return res.status(400).json({ error: "Duplicate booking: This time slot is already booked." });
  }

  next(); // Proceed to the next middleware or route handler
};

// Create new bookings
app.post("/bookings", validateBooking, async (req, res) => {
  const { date, time, guests, name, contact, contactemail } = req.body;
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  const newBooking = new Booking({
    date,
    time,
    guests,
    name,
    contact,
    userId,
    contactemail,
  });

  try {
    await newBooking.save();
    return res.status(201).json(newBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ error: "Error creating booking" });
  }
});

// Delete specific booking
app.delete("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  try {
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId, userId });

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found or unauthorized" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on ${serverURL}:${PORT}`));
