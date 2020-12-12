const puppeteer = require("puppeteer");
const parse = require("./parse");
const os = require("os");
const {
  URLS,
  becameAvailable,
  becameUnavailable,
  hasNotChanged,
} = require("./config");

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
      "--disable-accelerated-2d-canvas",
      // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X   10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0    Safari/537.36"',
    ],
  };

  // a workaround for ARM based architectures
  // puppeteer does not work out-of-the box
  // but it can be fixed!
  // check if your path to chromium browser matches this
  if (os.arch() === "arm") options.executablePath = "/usr/bin/chromium-browser";

  const browser = await puppeteer.launch(options);

  for (let shop in URLS) {
    for (let url of URLS[shop]) {
      openPage(browser, url)
        .then((page) => {
          console.log(`Finished loading ${url}`);
          checkAvailability(page, shop, url);
        })
        .catch((err) => {
          console.log(`Error retrieving ${url}: ${err}`);
        });
    }
  }
})();

async function openPage(browser, url) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  while (true) {
    try {
      await page.goto(url, { waitUntil: "load" });
      return page;
    } catch (e) {
      console.log(e);
    }
  }
}

async function checkAvailability(page, shop, url) {
  let lastState = false; // we assume the item is not available at first
  while (true) {
    try {
      await page.reload();
      const item = await parse[shop](page);
      const { available } = item;
      const timestamp = new Date().toISOString();
      const details = { item, shop, url, timestamp };
      if (lastState != available) {
        lastState = available;
        if (available) becameAvailable(details);
        else becameUnavailable(details);
      } else hasNotChanged(details);
      // consider adding some delay here
      // otherwise we will keep refreshing as soon as possible
    } catch (e) {
      console.log(e);
    }
  }
}
