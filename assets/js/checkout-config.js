/* Checkout slots for EdgeDashPro.
   paidMonthly and paidAnnual open the app pricing page.
   Leave waitlist as an empty string and that button falls back to email.
   Do not put secrets, account numbers, or prices in this file. */
(function (global) {
  var config = {
    contactEmail: "hello@edgedashpro.com",
    mailto:
      "mailto:hello@edgedashpro.com?subject=" +
      encodeURIComponent("EdgeDashPro — request access"),
    stripePaymentLinks: {
      paidMonthly: "https://app.edgedashpro.com/pricing",
      paidAnnual: "https://app.edgedashpro.com/pricing",
      waitlist: ""
    }
  };

  config.resolve = function (slot) {
    var table = config.stripePaymentLinks || {};
    var raw = Object.prototype.hasOwnProperty.call(table, slot) ? table[slot] : "";
    var href = typeof raw === "string" ? raw.trim() : "";
    if (href) {
      return { href: href, via: "stripe" };
    }
    return { href: config.mailto, via: "mailto" };
  };

  global.ETPCheckout = config;
})(window);
