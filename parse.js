const $ = require("cheerio");

// implement parsers for different shops/websites here
// parameters: page object
// returns: { title: String, price: Number, available: Boolean }

module.exports.amazon = async (page) => {
  const html = await page.evaluate(() => document.body.innerHTML);
  const title = $("#productTitle", html)
    .text()
    .replace(/(\r\n|\n|\r)/gm, "");
  if ($("#buy-now-button", html).length > 0) {
    const price = Number(
      $("#price_inside_buybox", html)
        .text()
        .replace(/[^0-9.-]+/g, "")
    );
    return { title, price, available: true };
  }
  return { title, price: null, available: false };
};
