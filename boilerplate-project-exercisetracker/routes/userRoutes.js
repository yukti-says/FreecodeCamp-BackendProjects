const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 1. Create a user
router.post("/", async (req, res) => {
  try {
    const newUser = new User({ username: req.body.username });
    const savedUser = await newUser.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: "User creation failed" });
  }
});

// 2. Get all users
router.get("/", async (req, res) => {
  const users = await User.find({}, "username _id");
  res.json(users);
});

// 3. Add exercise
router.post("/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const user = await User.findById(req.params._id);

  if (!user) return res.status(404).json({ error: "User not found" });

  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date) : new Date(),
  };

  user.log.push(exercise);
  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date.toDateString(),
    duration: exercise.duration,
    description: exercise.description,
  });
});

// 4. Get logs
router.get("/:_id/logs", async (req, res) => {
  const { from, to, limit } = req.query;
  const user = await User.findById(req.params._id);

  if (!user) return res.status(404).json({ error: "User not found" });

  let logs = user.log.map((log) => ({
    description: log.description,
    duration: log.duration,
    date: log.date.toDateString(),
  }));

  // Filter logs
  if (from) {
    const fromDate = new Date(from);
    logs = logs.filter((log) => new Date(log.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    logs = logs.filter((log) => new Date(log.date) <= toDate);
  }

  if (limit) {
    logs = logs.slice(0, parseInt(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: logs.length,
    log: logs,
  });
});

module.exports = router;
