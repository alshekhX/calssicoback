const express = require("express");
const Match = require("../models/Match");

const { protect, authorize } = require("../middlewares/protect");

const {
  deleteMatch,
  getMatch,
  joinMatch,
  getMatchs,
  getNearMatch,
  addPlayer,
  exitMatch,
  UpdateMatch,
  createMatch,
  removePlayer,
  joinMatchCode,
} = require("../controllers/matchC");
const advanceResults = require("../middlewares/advanceResults");

const router = express.Router();

router.route("/").get(advanceResults(Match,"stadium"), getMatchs);
router.route("/").post(protect, createMatch);

router.route("/join/code").put(protect, authorize("user"), joinMatchCode);
router
  .route("/join/:id")
  .get(protect, authorize("user"), joinMatch)
  .delete(protect, authorize("user"), exitMatch);
router.route("/player/:id").put(protect, authorize("user"), addPlayer);
router.route("/player/:id").delete(protect, authorize("user"), removePlayer);

router.route("/near").post(getNearMatch);

router
  .route("/:id")
  .put(protect, authorize("user"), UpdateMatch)
  .delete(protect, authorize("user"), deleteMatch)
  .get(getMatch);

module.exports = router;
