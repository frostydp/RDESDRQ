import { qrFields } from "../constants/fields.js";
import Qr from "../models/Qrs.js";
import mongoose from "mongoose";
import { capitalizeWords } from "../utlis/general.js";
import { updateCustomDataFields } from "../utlis/bundler.js";
const getAllQrs = async (req, res) => {
  try {
    const qrs = await Qr.find(); // Sort by secretScore in descending order
    if (!qrs || qrs.length === 0) {
      return res.status(204).json({ message: "No qrs Found" });
    }
    return res.status(200).json(qrs);
  } catch (error) {
    console.error("Error fetching qrs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getLocationQrs = async (req, res) => {
  if (!req?.params?.location) {
    return res.status(400).json({ message: "location is required" });
  }
  const typeToFind = req?.params?.qrType;
  console.log(typeToFind);
  try {
    const qrs = await Qr.find({
      region: typeToFind,
    });
    console.log(qrs);
    if (!qrs || qrs.length === 0) {
      return res.status(204).json({ message: "No qrs Found" });
    }
    return res.status(200).json(qrs);
  } catch (error) {
    console.error("Error fetching qrs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const addNewQr = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const {
      driver_name,
      company,
      destination,
      starting_point,
      date,
      cargo_type,
      region,
    } = req.body;

    // Create the new QR entry without qr_link
    const newQr = {
      driver_name,
      company,
      destination,
      starting_point,
      date,
      cargo_type,
      region,
    };

    // Insert the new QR document
    const result = await Qr.create([newQr], { session });
    console.log(result);
    // Retrieve the inserted document's _id
    const createdQrId = result[0]._id;

    // Generate the qr_link using the new _id
    const qr_link = `https://qredats.netlify.app/qr/${createdQrId}`;

    // Update the newly created document with the qr_link
    const updatedQr = await Qr.findByIdAndUpdate(
      createdQrId,
      { qr_link },
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();

    // Return the updated document
    res.status(201).json(updatedQr);
  } catch (err) {
    // Abort the transaction on error
    if (session.inTransaction()) await session.abortTransaction();

    console.error(err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  } finally {
    // End the session
    session.endSession();
  }
};

const getInfoFromQR = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id is required" });
  }
  const reqId = req.params.id;
  try {
    const qr = await Qr.findById(reqId).exec();
    if (!qr) {
      return res.status(204).json({ message: `No qr found with ID ${reqId}` });
    }
    return res.status(200).json(qr);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const updateQr = async (req, res) => {
  const qrId = req?.body?.id;
  if (!qrId) {
    return res.status(400).json({ message: "Id is required" });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const qrFound = await Qr.findById(qrId).session(session);
    if (!qrFound) {
      await session.abortTransaction();
      return res.status(404).json({ message: "qr not found" });
    }
    // Update qr fields
    updateCustomDataFields(qrFound, req.body, qrFields);

    // Save the updated qr
    await qrFound.save({ session });

    await session.commitTransaction();

    res.status(201).json({ message: "qr Updated" });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  } finally {
    session.endSession();
  }
};

export { getAllQrs, addNewQr, getInfoFromQR, getLocationQrs, updateQr };
