const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    let currentDate = new Date().toISOString().split("T")[0];
    let tasks = [];
    if (req.query.sortBy) {
      if (req.query.sortBy === "today") {
        tasks = await Task.find({ deadline: { $eq: currentDate } }, null, {
          sort: { priority: 1 },
        });
      }
      if (req.query.sortBy === "overdue") {
        tasks = await Task.find({ deadline: { $lte: currentDate } }, null, {
          sort: { priority: 1 },
        });
      }
      if (req.query.sortBy === "upcoming") {
        tasks = await Task.find({ deadline: { $gte: currentDate } }, null, {
          sort: { priority: 1 },
        });
      }
    } else {
      tasks = await Task.find({}, null, { sort: { priority: 1 } });
    }
    res.send(tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/tasks/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:_id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "completed",
    "priority",
    "deadline",
    "priorityVal",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates data!" });
  }

  try {
    const { _id } = req.params;
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:_id", auth, async (req, res) => {
  try {
    const { _id } = req.params;
    // const task = await Task.findOne({ _id, owner: req.user._id });
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }
    // task.remove();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
