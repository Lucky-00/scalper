module.exports.URLS = {
  amazon: [
    "https://www.amazon.co.uk/GoPro-HERO-Black-Waterproof-Stabilization/dp/B08G2HBBB6",
    "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452",
    "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H97NYGP",
    "https://www.amazon.co.uk/Xbox-RRT-00007-Series-X/dp/B08H93GKNJ/",
    "https://www.amazon.co.uk/AMD-Ryzen-5950X-Processor-Cache/dp/B0815Y8J9N/",
  ],
};

// customize the actions below
// logging on the console by default

module.exports.becameAvailable = (details) => {
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
};

module.exports.becameUnavailable = (details) => {
  const { item, shop, url, timestamp } = details;
  const { title, price } = item;
  console.log(
    // red text
    "\x1b[31m",
    `${timestamp}: "${title.slice(0, 35)}" not in stock at ${shop} anymore`,
    "\x1b[0m"
  );
};

module.exports.hasNotChanged = (details) => {
  const { item, shop, url, timestamp } = details;
  const { title, price, available } = item;
  console.log(
    `${timestamp}: still${
      available ? "" : " not"
    } in stock at ${shop} "${title.slice(0, 35)}"`
  );
};
