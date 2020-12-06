const $ = require("cheerio");

module.exports.amazon = async (html) => {
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
  } else {
    return { title, price: null, available: false };
  }
};
