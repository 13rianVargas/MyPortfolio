(function () {
  "use strict";

  // Respect the OS setting: no decorative ripples for reduced-motion users.
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Clicking a control should do that control's job, not spawn a ripple.
  var INTERACTIVE = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "iframe",
    "[role='button']",
    "[role='dialog']",
    "header",
    "footer",
    "nav",
    ".business-card",
    ".card-stage",
    ".glass-panel",
    ".project-card",
    ".dock",
    ".qr-modal",
    ".mobile-menu",
  ].join(", ");

  function createRipple(x, y) {
    var container = document.getElementById("ripples-container");
    if (!container) return;

    var ripple = document.createElement("div");
    ripple.className = "ripple";

    var size = Math.max(window.innerWidth, window.innerHeight) * 0.6;
    ripple.style.width = size + "px";
    ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    container.appendChild(ripple);
    ripple.addEventListener("animationend", function () {
      ripple.remove();
    });
  }

  function handleClick(e) {
    if (reduced.matches) return;
    if (e.target.closest && e.target.closest(INTERACTIVE)) return;
    // clientX/Y, not pageX/Y: the container is position:fixed, so its
    // coordinate space is the viewport.
    createRipple(e.clientX, e.clientY);
  }

  document.addEventListener("click", handleClick, { passive: true });
})();
