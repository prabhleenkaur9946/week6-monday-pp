const Tour = require("../models/tourModel");
const mongoose = require("mongoose");

// 1. Get all tours for logged-in user
const getAllTours = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tours = await Tour.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tours" });
  }
};

// 2. Get a single tour
const getTourById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tour" });
  }

  try {
    const user_id = req.user._id;
    const tour = await Tour.findOne({ _id: id, user_id });

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tour" });
  }
};

// 3. Create new tour
const createTour = async (req, res) => {
  try {
    const user_id = req.user._id;
    const newTour = await Tour.create({ ...req.body, user_id });
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: "Failed to create tour", error: error.message });
  }
};

// 4. Update tour
const updateTour = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tour" });
  }

  try {
    const user_id = req.user._id;
    const tour = await Tour.findOneAndUpdate(
      { _id: id, user_id },
      { ...req.body },
      { new: true }
    );

    if (!tour) {
      return res.status(404).json({ message: "Tour not found or unauthorized" });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(400).json({ message: "Failed to update tour", error: error.message });
  }
};

// 5. Delete tour
const deleteTour = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tour" });
  }

  try {
    const user_id = req.user._id;
    const tour = await Tour.findOneAndDelete({ _id: id, user_id });

    if (!tour) {
      return res.status(404).json({ message: "Tour not found or unauthorized" });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(400).json({ message: "Failed to delete tour", error: error.message });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};