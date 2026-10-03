/* Study Hub - light / dark theme switch.
   Runs in <head> so the saved theme is applied before the page paints (no flash). */
(function () {
  var root = document.documentElement;
  var KEY = "studyhub-theme";

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) { root.setAttribute("data-theme", theme); }

  apply(saved() === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-toggle");

    function sync() {
      var dark = root.getAttribute("data-theme") === "dark";
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", dark ? "true" : "false");
        b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        var label = b.querySelector(".tt-label");
        if (label) label.textContent = dark ? "Light" : "Dark";
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        sync();
      });
    });
    sync();
  });
})();
