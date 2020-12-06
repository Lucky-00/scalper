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

  for (let shop in URLS) {
    for (let url of URLS[shop]) {
      openPage(browser, url)
        .then((page) => {
          console.log(`Finished loading ${url}`);
          checkAvail(page, shop);
        })
        .catch((err) => {
          console.log(`Error retrieving ${url}: ${err}`);
        });
    }
  }
})();

async function openPage(browser, url) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  return page;
}

async function checkAvail(page, shop) {
  await page.reload();
  const html = await page.evaluate(() => document.body.innerHTML);
  const { title, price, available } = await parse[shop](html);
  const name = title.slice(0, 35);
  if (available) console.log(`IN STOCK FOR ${price}: ${name}`);
  else console.log(`Unavailable: ${name}`);
}
