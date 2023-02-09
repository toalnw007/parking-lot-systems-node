const express = require("express");

const app = express();

const parkingLot = {
  size: 10,
  slots: [],
  cars: {},
};

app.post("/create-parking-lot", (req, res) => {
  const { size } = req.body;
  parkingLot.size = size;
  parkingLot.slots = new Array(size).fill(null);
  res.json({ message: `Created parking lot with ${size} slots` });
});

app.post("/park", (req, res) => {
  const { plateNumber, size } = req.body;
  for (let i = 0; i < parkingLot.slots.length; i++) {
    if (!parkingLot.slots[i]) {
      parkingLot.slots[i] = plateNumber;
      parkingLot.cars[plateNumber] = { size, slot: i };
      return res.json({ message: `Allocated slot number: ${i + 1}` });
    }
  }
  res.status(400).json({ message: "Sorry, parking lot is full" });
});

app.post("/leave", (req, res) => {
  const { plateNumber } = req.body;
  const car = parkingLot.cars[plateNumber];
  if (!car) return res.status(400).json({ message: "Car not found" });
  parkingLot.slots[car.slot] = null;
  delete parkingLot.cars[plateNumber];
  res.json({ message: `Slot number ${car.slot + 1} is free` });
});

app.get("/status", (req, res) => {
  const status = parkingLot.slots.map((plateNumber, index) => {
    return {
      slot: index + 1,
      plateNumber,
    };
  });
  res.json({ status });
});

app.get("/registration-numbers-for-cars-with-colour", (req, res) => {
  const { size } = req.query;
  const plateNumbers = Object.entries(parkingLot.cars)
    .filter(([_, car]) => car.size === size)
    .map(([plateNumber, _]) => plateNumber);
  res.json({ plateNumbers });
});

app.get("/slot-numbers-for-cars-with-colour", (req, res) => {
  const { size } = req.query;
  const slotNumbers = Object.values(parkingLot.cars)
    .filter((car) => car.size === size)
    .map((car) => car.slot + 1);
  res.json({ slotNumbers });
});

app.listen(3000, () => {
  console.log("Parking lot API server is running on port 3000");
});