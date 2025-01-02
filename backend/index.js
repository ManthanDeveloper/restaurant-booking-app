const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();

require("dotenv").config();

const PORT = 5000;
const serverURL = process.env.server_url;

// Path to the booking.json file
const bookingFilePath = path.join(__dirname, "booking.json");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Ensure the `booking.json` file exists
if (!fs.existsSync(bookingFilePath)) {
  fs.writeFileSync(bookingFilePath, JSON.stringify([])); // Initialize as an empty array
}

// Helper function to read from booking.json
const readBookings = () => {
  const data = fs.readFileSync(bookingFilePath, "utf-8");
  return JSON.parse(data);
};

// Helper function to write to booking.json
const writeBookings = (bookings) => {
  fs.writeFileSync(bookingFilePath, JSON.stringify(bookings, null, 2), "utf-8");
};

// Root route
app.get("/", (req, res) => {
  res.send("Welcome To Restaurant App");
});

// Fetch user-specific bookings
app.get("/bookings", (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  const bookings = readBookings();
  const userBookings = bookings.filter((booking) => booking.userId === userId);
  res.json(userBookings);
});

// Middleware to validate bookings
const validateBooking = (req, res, next) => {
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

  const bookings = readBookings();
  const existingBooking = bookings.find(
    (booking) => booking.date === date && booking.time === time && booking.userId === userId
  );

  if (existingBooking) {
    return res.status(400).json({ error: "Duplicate booking: This time slot is already booked." });
  }

  next();
};

// Create new bookings
app.post("/bookings", validateBooking, (req, res) => {
  const { date, time, guests, name, contact, contactemail } = req.body;
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  const bookings = readBookings();
  const newBooking = {
    id: Date.now().toString(), // Generate a unique ID
    date,
    time,
    guests,
    name,
    contact,
    userId,
    contactemail,
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  res.status(201).json(newBooking);
});

// Delete specific booking
app.delete("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not logged in" });
  }

  const bookings = readBookings();
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId && booking.userId === userId
  );

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found or unauthorized" });
  }

  bookings.splice(bookingIndex, 1); // Remove the booking
  writeBookings(bookings);

  res.json({ message: "Booking deleted successfully" });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on ${serverURL}:${PORT}`));
