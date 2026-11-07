/* Stripe Payment Link slots for Edge Trader Pro.
   Leave a slot as an empty string and the button falls back to email.
   Do not put secrets, account numbers, or prices in this file. */
(function (global) {
  var config = {
    contactEmail: "hello@edgetraderpro.com",
    mailto:
      "mailto:hello@edgetraderpro.com?subject=" +
      encodeURIComponent("Edge Trader Pro — request access"),
    stripePaymentLinks: {
      access: "",
      waitlist: "",
      customSetup: ""
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
