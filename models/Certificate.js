import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  course: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  issuerName: { type: String },
  certificateId: { type: String, unique: true, required: true },
  cinId: { type: String },
  pdfPath: { type: String },
});

export default mongoose.model("Certificate", certificateSchema);


