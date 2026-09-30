const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// =====================================
// DASHBOARD
// =====================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================================
// DRIVER HEALTH SIMULATOR
// =====================================

app.get("/simulator/driver-health.html", (req, res) => {
  res.sendFile(path.join(__dirname, "driver-health.html"));
});

// =====================================
// BUS DATA
// =====================================

let buses = [
  {
    id: 101,
    status: "WARNING",
    footboard: "SAFE",
    driverHealth: "NORMAL",
    door: "OPEN",
  },
  {
    id: 102,
    status: "WARNING",
    footboard: "WARNING",
    driverHealth: "NORMAL",
    door: "SAFE",
  },
  {
    id: 103,
    status: "NORMAL",
    footboard: "SAFE",
    driverHealth: "NORMAL",
    door: "SAFE",
  },
  {
    id: 104,
    status: "CRITICAL",
    footboard: "SAFE",
    driverHealth: "ABNORMAL",
    door: "SAFE",
  },
];

// =====================================
// OVERALL BUS SAFETY STATUS
// =====================================

function updateBusStatus(bus) {
  if (
    bus.driverHealth === "ABNORMAL" ||
    bus.footboard === "CRITICAL" ||
    bus.door === "CRITICAL"
  ) {
    bus.status = "CRITICAL";
  } else if (
    bus.footboard === "WARNING" ||
    bus.door === "OPEN"
  ) {
    bus.status = "WARNING";
  } else {
    bus.status = "NORMAL";
  }
}

// =====================================
// TEST API
// =====================================

app.get("/api/status", (req, res) => {
  res.json({
    message: "Smart Move Backend is running!",
  });
});

// =====================================
// BUS API
// =====================================

app.get("/api/buses", (req, res) => {
  res.json(buses);
});

// =====================================
// DRIVER HEALTH API
// =====================================

app.post("/api/driver-health", (req, res) => {
  const { busId, health } = req.body;

  const bus = buses.find(
    (b) => b.id === Number(busId)
  );

  if (!bus) {
    return res.status(404).json({
      message: "Bus not found",
    });
  }

  bus.driverHealth = health;

  updateBusStatus(bus);

  console.log(
    `Bus ${bus.id} → Driver Health: ${health}`
  );

  res.json({
    message: "Driver health updated successfully",
    bus: bus,
  });
});

// =====================================
// FOOTBOARD SAFETY API
// =====================================

app.post("/api/footboard", (req, res) => {
  const { busId, footboard } = req.body;

  const bus = buses.find(
    (b) => b.id === Number(busId)
  );

  if (!bus) {
    return res.status(404).json({
      message: "Bus not found",
    });
  }

  bus.footboard = footboard;

  updateBusStatus(bus);

  console.log(
    `Bus ${bus.id} → Footboard: ${footboard}`
  );

  res.json({
    message: "Footboard status updated successfully",
    bus: bus,
  });
});

// =====================================
// DOOR SAFETY API
// =====================================

app.post("/api/door", (req, res) => {
  const { busId, door } = req.body;

  const bus = buses.find(
    (b) => b.id === Number(busId)
  );

  if (!bus) {
    return res.status(404).json({
      message: "Bus not found",
    });
  }

  bus.door = door;

  updateBusStatus(bus);

  console.log(
    `Bus ${bus.id} → Door: ${door}`
  );

  res.json({
    message: "Door status updated successfully",
    bus: bus,
  });
});

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {
  console.log(
    `Smart Move running on port ${PORT}`
  );
});
