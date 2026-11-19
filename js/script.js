/* AutoDining product page — plain JavaScript, no dependencies.
   >>> Set your Superhive product URL here when it is live. Leave empty until then. <<< */
const AUTODINING_CONFIG = {
  PRODUCT_URL: "" // e.g. "https://superhivemarket.com/products/your-autodining-url"
};

(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.remove("no-js");

  /* ---- Get AutoDining buttons ---- */
  var toast = $("#toast"), tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 4200); }
  $$("[data-buy]").forEach(function (a) {
    if (AUTODINING_CONFIG.PRODUCT_URL) { a.href = AUTODINING_CONFIG.PRODUCT_URL; a.target = "_blank"; a.rel = "noopener"; return; }
    a.addEventListener("click", function (e) {
      if (a.closest("#cta")) { e.preventDefault(); showToast("The Superhive product link is not set yet. Add it to PRODUCT_URL in js/script.js."); }
    });
  });

  /* ---- Mobile menu ---- */
  var burger = $(".burger"), menu = $("#menu");
  function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  burger.addEventListener("click", function () {
    var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu");
  });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* ---- Reveal on scroll + active nav ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
    var links = {}; $$(".menu a[href^='#']").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { $$(".menu a.on").forEach(function (a) { a.classList.remove("on"); }); var l = links[e.target.id]; if (l && !l.classList.contains("btn")) l.classList.add("on"); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "features", "gallery", "videos", "workflow", "faq"].forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* ---- FAQ accordion ---- */
  $$(".faq-q").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      $$(".faq-q").forEach(function (x) { x.setAttribute("aria-expanded", "false"); document.getElementById(x.getAttribute("aria-controls")).hidden = true; });
      if (!open) { b.setAttribute("aria-expanded", "true"); document.getElementById(b.getAttribute("aria-controls")).hidden = false; }
    });
  });

  /* ---- Videos: only one plays at a time ---- */
  var vids = $$("video");
  vids.forEach(function (v) { v.addEventListener("play", function () { vids.forEach(function (o) { if (o !== v) o.pause(); }); }); });
  function swap(v, src, poster) {
    v.pause(); v.poster = poster || ""; v.querySelector("source").src = src; v.load();
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  var mv = $("#mainVideo");
  $$(".v-card").forEach(function (c) {
    c.addEventListener("click", function () {
      $$(".v-card").forEach(function (x) { x.classList.remove("active"); }); c.classList.add("active");
      swap(mv, c.dataset.video, c.dataset.poster);
      $("#mvTitle").textContent = c.dataset.title; $("#mvDesc").textContent = c.dataset.desc;
      mv.setAttribute("aria-label", c.dataset.title);
      mv.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ---- Workflow steps ---- */
  var fv = $("#flowVideo");
  $$(".step").forEach(function (s) {
    s.addEventListener("click", function () {
      $$(".step").forEach(function (x) { x.classList.remove("active"); }); s.classList.add("active");
      var c = s.dataset.clip; swap(fv, "videos/" + c + ".mp4", "images/posters/" + c + ".jpg");
    });
  });

  /* ---- Lightbox ---- */
  var lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbCount = $("#lbCount"), list = [], idx = 0, last = null;
  function show(i) {
    idx = (i + list.length) % list.length; var el = list[idx];
    lbImg.src = el.dataset.full; lbImg.alt = el.alt || ""; lbCap.textContent = el.dataset.caption || "";
    lbCount.textContent = (idx + 1) + " / " + list.length;
    var multi = list.length > 1; $(".lb-p").style.display = $(".lb-n").style.display = multi ? "" : "none";
  }
  function open(el) {
    last = el; list = $$("[data-lightbox][data-group='" + el.dataset.group + "']"); lb.hidden = false; document.body.style.overflow = "hidden";
    show(list.indexOf(el)); $(".lb-x").focus();
  }
  function close() { lb.hidden = true; document.body.style.overflow = ""; lbImg.src = ""; if (last) last.focus(); }
  $$("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function () { open(el); });
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el); } });
  });
  $(".lb-x").addEventListener("click", close); $(".lb-p").addEventListener("click", function () { show(idx - 1); }); $(".lb-n").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") show(idx - 1); else if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "Tab") { var f = $$("button", lb); var i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
  var sx = 0; lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) { var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
})();
