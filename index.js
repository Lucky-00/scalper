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
          checkAvailability(page, shop, url);
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

async function checkAvailability(page, shop, url) {
  let lastState = false; // we assume the item is not available
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

// customize the actions below
// logging on the console by default

function becameAvailable(details) {
  const { item, shop, url, timestamp } = details;
  const { title, price } = item;
  console.log(
    // green text
    "\x1b[32m",
    `${timestamp}: "${title.slice(
      0,
      35
    )}" BACK IN STOCK at ${shop} for £${price}: ${url}`,
    "\x1b[0m"
  );
}

function becameUnavailable(details) {
  const { item, shop, url, timestamp } = details;
  const { title, price } = item;
  console.log(
    // red text
    "\x1b[31m",
    `${timestamp}: "${title.slice(0, 35)}" not in stock at ${shop} anymore`,
    "\x1b[0m"
  );
}

function hasNotChanged(details) {
  const { item, shop, url, timestamp } = details;
  const { title, price, available } = item;
  console.log(
    `${timestamp}: still${
      available ? "" : " not"
    } in stock at ${shop} "${title.slice(0, 35)}"`
  );
}
