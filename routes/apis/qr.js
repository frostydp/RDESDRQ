import express from "express";
import {
  addNewQr,
  getAllQrs,
  getInfoFromQR,
  getLocationQrs,
  updateQr,
} from "../../controllers/qrController.js";

const router = express.Router();

router.route("/").get(getAllQrs).post(addNewQr);

router.route("/location/:location").get(getLocationQrs);
router.route("/:id").get(getInfoFromQR).patch(updateQr);

export default router;
