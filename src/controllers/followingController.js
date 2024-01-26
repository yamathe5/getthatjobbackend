// followingController.js
const followingModel = require("../models/followingModel");

const getFollowings = async (req, res) => {
  const { professionalId } = req.params;
  try {
    const jobs = await followingModel.getFollowings(professionalId);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFollow = async (req, res) => {
  const {  professionalId } = req.params;
  try {
    const existinFollow = await followingModel.findExistingFollowing(professionalId, req.body);
    if (existinFollow) {
      return res.status(409).json({ message: "Follow already exist" });
    }

    const jobs = await followingModel.createFollow( professionalId, req.body);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFollow = async (req, res) => {
  const { followingId } = req.params;

  // Verificar si followingId es un número válido o no
  if (!followingId || isNaN(Number(followingId))) {
    return res.status(400).send("Invalid ID.");
  }

  try {
    const deletedCount = await followingModel.deleteFollow(followingId);
    // console.log("req params", req.params, "deletedCount:", deletedCount);

    if (deletedCount === 0) {
      res.status(404).json({ message: `Following with ID ${followingId} not found.` });
    } else {
      res.status(200).json({ message: `Following with ID ${followingId} deleted successfully.` });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getFollowings, createFollow, deleteFollow };
