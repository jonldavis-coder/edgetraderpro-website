(function () {
  document.documentElement.classList.add("js");

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var checkout = window.ETPCheckout;
  if (checkout && typeof checkout.resolve === "function") {
    document.querySelectorAll("[data-checkout]").forEach(function (el) {
      var slot = el.getAttribute("data-checkout") || "access";
      var resolved = checkout.resolve(slot);
      if (el.tagName === "A") {
        el.setAttribute("href", resolved.href);
        if (resolved.via === "stripe") {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener noreferrer");
        } else {
          el.removeAttribute("target");
        }
      }
      var note = document.querySelector('[data-checkout-note="' + slot + '"]');
      if (note && resolved.via === "stripe") {
        note.textContent =
          "Opens " +
          resolved.href +
          " in a new tab. Straight to Stripe Checkout. There is no free trial of the subscription.";
      }
    });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var topic = String(data.get("topic") || "").trim();
      var message = String(data.get("message") || "").trim();
      var body = "Name: " + name + "\nEmail: " + email + "\nTopic: " + topic + "\n\n" + message;
      var href =
        "mailto:hello@edgedashpro.com?subject=" +
        encodeURIComponent("EdgeDashPro — " + (topic || "message")) +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = href;
    });
  }

  var root = document.body.getAttribute("data-root") || "";
  var toggle = document.querySelector(".assistant-toggle");
  var panel = document.getElementById("assistant-panel");
  var log = document.querySelector(".assistant-log");
  var askForm = document.querySelector(".assistant-form");
  var input = document.getElementById("assistant-q");
  var knowledge = window.ETPKnowledge || [];

  function addBubble(kind, text, more) {
    if (!log) return;
    var item = document.createElement("div");
    item.className = "bubble " + (kind === "user" ? "bubble-user" : "bubble-assistant");
    var p = document.createElement("p");
    p.textContent = text;
    item.appendChild(p);
    if (more && more.slug) {
      var a = document.createElement("a");
      a.href = root + more.slug;
      a.textContent = "Read more: " + (more.label || "page");
      item.appendChild(a);
    }
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  function tokens(value) {
    return (String(value).toLowerCase().match(/[a-z0-9/+$-]+/g) || []).filter(function (word) {
      return word.length > 2;
    });
  }

  function answer(question) {
    var words = tokens(question);
    var best = null;
    var bestScore = 0;
    knowledge.forEach(function (entry) {
      var score = 0;
      var keys = entry.keywords || [];
      words.forEach(function (word) {
        keys.forEach(function (key) {
          if (key === word) score += 4;
          else if (key.indexOf(word) !== -1 || word.indexOf(key) !== -1) score += 2;
        });
        if (entry.answer && entry.answer.toLowerCase().indexOf(word) !== -1) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });
    if (!best || bestScore < 4) {
      return {
        answer:
          "I can only answer from the pages on this website, and I don't see a clear match. Try Features, Pricing, or the FAQ, or email hello@edgedashpro.com.",
        more: { slug: "sitemap/", label: "Site map" }
      };
    }
    return best;
  }

  function ask(question) {
    var clean = String(question || "").trim();
    if (!clean) return;
    addBubble("user", clean);
    var hit = answer(clean);
    addBubble("assistant", hit.answer, hit.more);
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var willOpen = panel.hasAttribute("hidden");
      if (willOpen) {
        panel.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        if (log && !log.childElementCount) {
          addBubble(
            "assistant",
            "Automated assistant. I answer from the text of this website only. I do not contact an outside service, and I do not place trades."
          );
        }
        if (input) input.focus();
      } else {
        panel.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
    var closer = panel.querySelector(".assistant-close");
    if (closer) {
      closer.addEventListener("click", function () {
        panel.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hasAttribute("hidden")) {
        panel.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
      if (event.key === "Escape" && nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (askForm && input) {
    askForm.addEventListener("submit", function (event) {
      event.preventDefault();
      ask(input.value);
      input.value = "";
    });
  }

  document.querySelectorAll("[data-suggest]").forEach(function (button) {
    button.addEventListener("click", function () {
      ask(button.getAttribute("data-suggest") || button.textContent);
    });
  });
})();
