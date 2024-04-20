import mongoose from "mongoose";
const Schema = mongoose.Schema;

const qrSchema = new Schema({
  driver_name: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  starting_point: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  cargo_type: {
    type: String,
    required: true,
  },
  qr_link: {
    type: String,
  },
});

export default mongoose.model("QR", qrSchema);
