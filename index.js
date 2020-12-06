const puppeteer = require("puppeteer");
const parse = require("./parse");

const URLS = {
  amazon: [
    "https://www.amazon.co.uk/GoPro-HERO-Black-Waterproof-Stabilization/dp/B08G2HBBB6",
    "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452",
    "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H97NYGP",
  ],
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
      // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X   10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0    Safari/537.36"',
    ],
  });

  const openPages = {};

  for (let shop in URLS) {
    console.log(`---- ${shop} ----`);
    openPages[shop] = [];
    for (let url of URLS[shop]) {
      console.log(url);
      let page = await browser.newPage();
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      openPages[shop].push(page);
      await page.reload();
      const html = await page.evaluate(() => document.body.innerHTML);
      if (shop == "amazon") await parse.amazon(html);
      // setInterval here
      // checkAvail(page);
    }
  }
})();

async function checkAvailability() {}
