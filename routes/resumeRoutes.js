const express = require("express");


console.log("✅ resumeRoutes.js loaded");
const router = express.Router();

const resumeController = require("../controllers/resumeController");
console.log("DOWNLOAD FUNCTION:", typeof resumeController.download);


// Dashboard
router.get("/dashboard", resumeController.dashboard);

// Select template
router.get("/templates", resumeController.chooseTemplate);


// Create resume
router.post("/resume/create", resumeController.create);


// Resume form
router.get("/resume/form", resumeController.form);


// Save resume
router.post("/resume/save", resumeController.save);


// Preview
router.get("/resume/preview", resumeController.preview);


// View resume
router.get("/resume/view/:id", resumeController.view);


// Edit resume
router.get("/resume/edit/:id", resumeController.edit);


// Delete resume
router.get("/resume/delete/:id", resumeController.delete);


// Download PDF
router.get("/resume/download", (req, res) => {
    console.log("🔥 DOWNLOAD ROUTE HIT");
    resumeController.download(req, res);
});

module.exports = router;