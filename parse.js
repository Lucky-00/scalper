const $ = require("cheerio");

module.exports.amazon = async (html) => {
  const title = $("#productTitle", html)
    .text()
    .replace(/(\r\n|\n|\r)/gm, "")
    .slice(0, 40);
  if ($("#buy-now-button", html).length > 0) {
    const price = Number(
      $("#price_inside_buybox", html)
        .text()
        .replace(/[^0-9.-]+/g, "")
    );
    console.log(`"${title}" IN STOCK for ${price}`);
  } else {
    console.log(`"${title}" not available`);
  }
};
