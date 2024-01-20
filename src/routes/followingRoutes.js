// followingRoutes.js
const express = require('express');
const followingController = require('../controllers/followingController');
const router = express.Router();

router.get('/professionals/:professionalId/following', followingController.getFollowings);
router.post('/professionals/:professionalId/follow', followingController.createFollow);
router.delete('/professionals/:professionalId/unfollow/:followingId', followingController.deleteFollow);

module.exports = router;
