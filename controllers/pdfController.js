const puppeteer = require("puppeteer");

exports.generate = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // 1) Grab the current session cookie from the logged-in user
    const cookieName = "resumecloud.sid"; // must match session name in server.js
    const sessionCookie = req.cookies[cookieName];

    if (!sessionCookie) {
      await browser.close();
      return res.status(401).send("Not authenticated for PDF generation");
    }

    // 2) Set that cookie inside Puppeteer
    await page.setCookie({
      name: cookieName,
      value: sessionCookie,
      domain: "localhost",
      path: "/"
    });

    // 3) Now open the protected preview page
    await page.goto("http://localhost:3000/preview", {
      waitUntil: "networkidle0"
    });

    // 4) Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });

    await browser.close();

    // 5) Send to browser
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf"
    });

    res.send(pdf);

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).send("PDF generation failed");
  }
};
