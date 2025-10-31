import express from "express";
import { getCertificates, generateCertificate, verifyCertificate } from "../controllers/certificateControllers.js";

const router = express.Router();

router.get("/", getCertificates);
router.post("/generate", generateCertificate);
router.get("/verify/:certificateId", verifyCertificate);

export default router;
