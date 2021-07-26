const puppeteer = require("puppeteer");
const devices = puppeteer.devices;
const iPhonex = devices["iPhone X"];
const express = require("express");
const app = express();
const port = 5000;
var cors = require("cors");
const { urlencoded } = require("express");
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/url", (req, res) => {
  const url = req.body.url;
  console.log(url);
});

app.post("/", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  console.log(req.body);
  const page = await browser.newPage();

  await page.emulate(iPhonex);

  await page.goto(req.body.url);
  await page
    .waitForSelector('button[aria-label="AGREE"]')
    .then(() => page.click('button[aria-label="AGREE"]'));

  await page.addScriptTag({
    content: `JITAPB.setConfig({
  debugging: {
  enabled: true, // suppresses bids from other bidders
  bidders: []
  }
  });`,
  });

  await page.evaluate(async (page) => {
    new Promise((resolve, reject) => {
      totalHeight = 0;
      var distance = 300;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  try {
    await page
      .waitForSelector("#common_15click_overlay", { timeout: 15000 })
      .then(() => res.json({ penalty: true }));
    browser.close();
  } catch {
    res.json({ penalty: false });
    browser.close();
  }
});

app.listen(port, () => console.log(`running on ${port}`));
