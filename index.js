const puppeteer = require("puppeteer");
const parse = require("./parse");
const URLS = require("./urls");
const os = require("os");

(async () => {
  const options = {
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
  };

  if (os.arch() === "arm") options.executablePath = "/usr/bin/chromium-browser";

  const browser = await puppeteer.launch(options);

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
  while (true) {
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);
      await page.goto(url, { waitUntil: "load" });
      return page;
    } catch (e) {
      console.log(e);
    }
  }
}

async function checkAvail(page, shop) {
  while (true) {
    try {
      await page.reload();
      const { title, price, available } = await parse[shop](page);
      // action when the item is available - customize here
      if (available) {
        console.log(
          "\x1b[33m%s\x1b[0m",
          `>>>> IN STOCK at ${shop} (£${price}): "${title.slice(0, 35)}"`
        );
        return; // stop checking the item
      } else console.log(`"${title.slice(0, 35)}" not in stock at ${shop}`);
      // consider adding some delay here
      // otherwise we will keep refreshing as soon as possible
    } catch (e) {
      console.log(e);
    }
  }
}
