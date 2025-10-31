import Certificate from "../models/Certificate.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads", "certificates");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ✅ Generate Certificate
export const generateCertificate = async (req, res) => {
  try {
    const { employeeName, course, startDate, endDate } = req.body;
    if (!employeeName || !course || !startDate || !endDate)
      return res.status(400).json({ message: "All fields required" });

    const certificateId = ("CERT-" + uuidv4().slice(0, 8)).toUpperCase();
    const cinId = "CIN-" + Math.floor(100000 + Math.random() * 900000);
    const issuerName = "FHJ";

    const pdfName = `${certificateId}.pdf`;
    const pdfPath = path.join(uploadsDir, pdfName);

    // Create PDF
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(28).text("Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(`This certifies that ${employeeName}`, { align: "center" });
    doc.moveDown();
    doc.text(`has successfully completed the course: ${course}`, { align: "center" });
    doc.moveDown();
    doc.text(`Duration: ${startDate} to ${endDate}`, { align: "center" });
    doc.moveDown();
    doc.text(`Issued by ${issuerName}`, { align: "center" });

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const certificate = await Certificate.create({
      employeeName,
      course,
      startDate,
      endDate,
      issuerName,
      certificateId,
      cinId,
      pdfPath: `uploads/certificates/${pdfName}`,
    });

    res.json({ message: "Certificate generated successfully", certificate });
  } catch (err) {
    console.error("Generate Certificate Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Verify Certificate
export const verifyCertificate = async (req, res) => {
  try {
    let { certificateId } = req.params;
    certificateId = certificateId.trim().toUpperCase();

    const certificate = await Certificate.findOne({
      certificateId: { $regex: `^${certificateId}$`, $options: "i" },
    });

    if (!certificate)
      return res.status(404).json({ valid: false, message: "Certificate not found" });

    res.json({ valid: true, certificate });
  } catch (err) {
    console.error("Verify Certificate Error:", err);
    res.status(500).json({ valid: false, message: "Server error" });
  }
};

// ✅ Get All Certificates (optional)
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

