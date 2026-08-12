const Resume = require("../models/resumeModel");
const puppeteer = require("puppeteer");

function getUserId(req) {
    return (
        req.session?.user?._id ||
        req.session?.user?.id ||
        req.session?.userId ||
        req.user?._id ||
        req.user?.id
    );
}


// ================= DASHBOARD =================

exports.dashboard = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.redirect("/login");
        }

        const resumes = await Resume.find({
            userId: userId
        }).sort({ createdAt: -1 });

        const user = req.session.user || req.user;

        res.render("dashboard/index", {
            user,
            resumes
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).send("Unable to load dashboard");
    }
};


// ================= CHOOSE TEMPLATE =================

exports.chooseTemplate = (req, res) => {
    res.render("templates/select");
};


// ================= CREATE RESUME =================

exports.create = async (req, res) => {
    try {

        const userId = getUserId(req);

        if (!userId) {
            return res.redirect("/login");
        }

        const {
            template,
            title
        } = req.body;

        if (!["modern", "professional", "minimal"].includes(template)) {
            return res.status(400).send("Invalid template");
        }

        const resume = await Resume.create({
            userId,
            title: title || "My Resume",
            template
        });

        req.session.selectedTemplate = template;
        req.session.resumeId = resume._id.toString();

        res.redirect("/resume/form");

    } catch (error) {

        console.error("Create Resume Error:", error);

        res.status(500).send("Unable to create resume");

    }
};


// ================= FORM =================

exports.form = async (req, res) => {
    try {

        const resumeId = req.session.resumeId;

        if (!resumeId) {
            return res.redirect("/templates");
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.redirect("/templates");
        }

        res.render("dashboard/form", {
            resume
        });

    } catch (error) {

        console.error("Resume Form Error:", error);

        res.status(500).send("Unable to load resume form");

    }
};


// ================= SAVE RESUME =================

exports.save = async (req, res) => {

    try {

        const resumeId = req.session.resumeId;

        const template = req.session.selectedTemplate;

        if (!resumeId || !template) {
            return res.redirect("/templates");
        }


        const resumeData = {

            name: req.body.name || "",

            role: req.body.role || "",

            email: req.body.email || "",

            phone: req.body.phone || "",

            location: req.body.location || "",

            github: req.body.github || "",

            linkedin: req.body.linkedin || "",

            portfolio: req.body.portfolio || "",

            summary: req.body.summary || "",

            skills: req.body.skills || "",

            education: req.body.education || "",

            experience: req.body.experience || "",

            projects: req.body.projects || "",

            certifications: req.body.certifications || "",

            achievements: req.body.achievements || "",

            languages: req.body.languages || ""

        };


        const resume = await Resume.findByIdAndUpdate(
            resumeId,
            {
                ...resumeData,
                template
            },
            {
                new: true,
                runValidators: true
            }
        );


        if (!resume) {
            return res.status(404).send("Resume not found");
        }


        // Store in session too
        req.session.resumeData = resume.toObject();


        // Render selected template

        return res.render(
            `resumes/${template}`,
            {
                resumeData: resume.toObject(),

                // Needed by professional/minimal
                // templates that use direct variables
                ...resume.toObject()
            }
        );


    } catch (error) {

        console.error("Save Resume Error:", error);

        res.status(500).send("Unable to save resume");

    }
};


// ================= PREVIEW =================

exports.preview = async (req, res) => {

    try {

        const resumeId = req.session.resumeId;

        if (!resumeId) {
            return res.redirect("/templates");
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.redirect("/templates");
        }


        const data = resume.toObject();


        res.render(
            `resumes/${resume.template}`,
            {
                resumeData: data,
                ...data
            }
        );


    } catch (error) {

        console.error("Preview Error:", error);

        res.status(500).send("Unable to preview resume");

    }
};


// ================= VIEW RESUME =================

exports.view = async (req, res) => {

    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).send("Resume not found");
        }

        const data = resume.toObject();

        res.render(
            `resumes/${resume.template}`,
            {
                resumeData: data,
                ...data
            }
        );

    } catch (error) {

        console.error("View Resume Error:", error);

        res.status(500).send("Unable to view resume");

    }
};


// ================= EDIT =================

exports.edit = async (req, res) => {

    try {

        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).send("Resume not found");
        }

        req.session.resumeId = resume._id.toString();
        req.session.selectedTemplate = resume.template;

        res.render("dashboard/form", {
            resume
        });

    } catch (error) {

        console.error("Edit Resume Error:", error);

        res.status(500).send("Unable to edit resume");

    }
};


// ================= DELETE =================

exports.delete = async (req, res) => {

    try {

        await Resume.findByIdAndDelete(req.params.id);

        res.redirect("/dashboard");

    } catch (error) {

        console.error("Delete Resume Error:", error);

        res.status(500).send("Unable to delete resume");

    }
};



// ================= DOWNLOAD PDF =================

exports.download = async (req, res) => {
    try {

        const resumeId = req.session.resumeId;

        if (!resumeId) {
            return res.redirect("/dashboard");
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).send("Resume not found");
        }

        const data = resume.toObject();

        // Render resume EJS into HTML
        const html = await new Promise((resolve, reject) => {

            req.app.render(
                `resumes/${resume.template}`,
                {
                    resumeData: data,
                    ...data
                },
                (error, html) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(html);
                    }

                }
            );

        });


        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });


        const page = await browser.newPage();


        // Load resume HTML
        await page.setContent(html, {
            waitUntil: "networkidle0"
        });


        // Generate PDF
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                right: "10mm",
                bottom: "10mm",
                left: "10mm"
            }
        });


        await browser.close();


        // Send PDF
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${resume.name || "resume"}-Resume.pdf"`
        });

        res.send(pdf);


    } catch (error) {

        console.error("PDF Download Error:", error);

        res.status(500).send("Unable to generate PDF");

    }
};