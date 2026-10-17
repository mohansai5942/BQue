/* BrandiQue Voice AI — site behaviour: nav, config injection, forms, reveal */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  /* ---- Inject config values into [data-config] placeholders ---- */
  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      var val = cfg[key];
      if (val == null) return;
      if (key === "email") { el.textContent = val; if (el.tagName === "A") el.href = "mailto:" + val; }
      else if (key === "phoneDisplay") { el.textContent = val; if (el.tagName === "A") el.href = "tel:+" + String(cfg.phoneHref || "").replace(/\D/g, ""); }
      else if (key === "whatsapp") { if (el.tagName === "A") el.href = "https://wa.me/" + String(val).replace(/\D/g, ""); }
      else { el.textContent = val; }
    });
    document.querySelectorAll("[data-config-href='whatsapp']").forEach(function (el) {
      el.href = "https://wa.me/" + String(cfg.whatsapp || "").replace(/\D/g, "");
    });
    // footer year
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---- Mobile nav ---- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!btn || !links) return;
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  /* ---- Subtle scroll reveal (respects reduced motion via CSS) ---- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Demo-request form: validation + honest confirmation ---- */
  function initForm() {
    var form = document.getElementById("demoForm");
    if (!form) return;
    var success = document.getElementById("formSuccess");

    function setInvalid(input, bad) {
      var field = input.closest(".field");
      if (field) field.classList.toggle("invalid", bad);
      input.setAttribute("aria-invalid", bad ? "true" : "false");
      return !bad;
    }
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
    function validPhone(v) { return /^[+\d][\d\s\-()]{6,18}$/.test(v); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector("#fName");
      var contact = form.querySelector("#fContact");
      var consent = form.querySelector("#fConsent");

      ok = setInvalid(name, name.value.trim().length < 2) && ok;
      var cv = contact.value.trim();
      ok = setInvalid(contact, !(validEmail(cv) || validPhone(cv))) && ok;
      var consentField = consent.closest(".field");
      if (!consent.checked) { consentField.classList.add("invalid"); ok = false; }
      else { consentField.classList.remove("invalid"); }

      if (!ok) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      // Frontend-only: never pretend to send. Show honest confirmation.
      form.style.display = "none";
      if (success) {
        success.classList.add("show");
        var note = success.querySelector("[data-form-note]");
        if (note) {
          note.textContent = cfg.formServiceConfigured
            ? "Your request has been sent. We'll reply within one business day."
            : "Demo form — your details were not sent anywhere. " +
              (cfg.formServiceName ? "Connect " + cfg.formServiceName + " (see README) to receive enquiries, " : "Connect a form service (see README) to receive enquiries, ") +
              "or reach us directly at " + (cfg.email || "our email") + ".";
        }
        success.querySelector("h3").focus && success.setAttribute("tabindex", "-1"), success.focus();
      }
    });

    // live re-validate consent
    var consent = form.querySelector("#fConsent");
    if (consent) consent.addEventListener("change", function () {
      consent.closest(".field").classList.toggle("invalid", !consent.checked);
    });
  }

  /* ---- Interactive sample-call player (scripted demo, clearly illustrative) ---- */
  var CALL_SCRIPT = [
    { who: "ai", label: "AI ASSISTANT", text: "Good afternoon, thanks for calling Green Acres Realty. This is Aria, the virtual assistant. How can I help you today?" },
    { who: "human", label: "CALLER", text: "Hi, I saw your listing for 3BHK flats in Gachibowli. What's the price range?" },
    { who: "ai", label: "AI ASSISTANT", text: "Those start at ₹1.4 crore onwards, depending on the floor and facing. Are you looking to buy soon, or just exploring?" },
    { who: "human", label: "CALLER", text: "Planning to buy within two months. Do you have east-facing units?" },
    { who: "ai", label: "AI ASSISTANT", text: "Yes, a few east-facing units are available. Can I book a site visit for you this Saturday? We have 10 AM and 4 PM slots." },
    { who: "human", label: "CALLER", text: "Saturday 10 AM works for me." },
    { who: "ai", label: "AI ASSISTANT", text: "Done — site visit booked for Saturday at 10 AM. Our team will confirm on WhatsApp shortly. Anything else I can help with?" },
    { who: "human", label: "CALLER", text: "That's all, thanks." }
  ];
  function initCallPlayer() {
    var player = document.getElementById("callPlayer");
    if (!player) return;
    var convo = player.querySelector(".convo");
    var btn = player.querySelector(".player-btn");
    var timers = [];
    function clear() {
      timers.forEach(clearTimeout); timers = [];
      convo.innerHTML = "";
    }
    function addLine(line, done) {
      var d = document.createElement("div");
      d.className = "bubble " + line.who;
      var who = document.createElement("span"); who.className = "who"; who.textContent = line.label;
      d.appendChild(who);
      var typing = document.createElement("span"); typing.className = "typing"; typing.setAttribute("aria-hidden", "true");
      typing.innerHTML = "<span></span><span></span><span></span>";
      d.appendChild(typing);
      convo.appendChild(d);
      convo.scrollTop = convo.scrollHeight;
      timers.push(setTimeout(function () {
        d.removeChild(typing);
        d.appendChild(document.createTextNode(line.text));
        convo.scrollTop = convo.scrollHeight;
        done();
      }, line.who === "ai" ? 1100 : 800));
    }
    btn.addEventListener("click", function () {
      clear();
      btn.disabled = true;
      btn.innerHTML = "▶ Playing…";
      var i = 0;
      (function next() {
        if (i >= CALL_SCRIPT.length) {
          btn.disabled = false;
          btn.innerHTML = "↻ Replay sample call";
          return;
        }
        addLine(CALL_SCRIPT[i++], function () {
          timers.push(setTimeout(next, 650));
        });
      })();
    });
  }

  /* ---- Missed-call cost estimator (math on the visitor's own inputs) ---- */
  function initEstimator() {
    var est = document.getElementById("estimator");
    if (!est) return;
    var missed = est.querySelector("#estMissed");
    var value = est.querySelector("#estValue");
    var rate = est.querySelector("#estRate");
    var outCount = est.querySelector("#estOutCount");
    var outValue = est.querySelector("#estOutValue");
    function fmt(n) {
      return "₹" + Math.round(n).toLocaleString("en-IN");
    }
    function calc() {
      var m = Math.max(0, parseFloat(missed.value) || 0);
      var v = Math.max(0, parseFloat(value.value) || 0);
      var r = Math.min(100, Math.max(0, parseFloat(rate.value) || 0));
      var monthly = m * 30;
      var potential = monthly * (r / 100) * v;
      outCount.textContent = Math.round(monthly).toLocaleString("en-IN");
      outValue.textContent = fmt(potential);
    }
    [missed, value, rate].forEach(function (el) { el.addEventListener("input", calc); });
    calc();
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    initNav();
    initReveal();
    initForm();
    initCallPlayer();
    initEstimator();
  });
})();
