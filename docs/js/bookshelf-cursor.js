/*
  Custom orbital cursor for the landing page only.
  - The dot has zero smoothing: it is always exactly at the OS pointer
    position, so the cursor stays precisely usable for targeting/clicking.
  - The ring is the only element with eased "lag," for the orbital feel.
  - Bails out entirely (no custom cursor, native pointer stays as-is) on
    touch/coarse pointers and under prefers-reduced-motion — this is why
    the CSS never sets `cursor: none` unconditionally; native cursor is
    only hidden once this script has confirmed it can track precisely.
  - Never calls .focus()/preventDefault()/intercepts clicks or keys, so
    keyboard navigation and :focus-visible are completely unaffected.
*/

// Marks this page as the landing page so bookshelf.css can hide Material's
// header bar (`body.bookshelf-landing-page .md-header`). Previously this
// lived as an inline <script> directly in index.md's markdown — moved
// here so it's guaranteed to run as plain external JS, never touched by
// Python-Markdown's HTML-block handling (which the inline version
// theoretically could have been, however unlikely). Unconditional: this
// must run even when the cursor feature itself bails out below.
document.body.classList.add("bookshelf-landing-page");

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");

  if (reduceMotion.matches || coarsePointer.matches) return;

  const dot = document.getElementById("bookshelf-cur-dot");
  const ring = document.getElementById("bookshelf-cur-ring");
  if (!dot || !ring) return;

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;
  let active = false;
  let raf = null;

  function activate() {
    if (active) return;
    active = true;
    document.body.classList.add("bookshelf-cur-active");
    dot.style.display = "block";
    ring.style.display = "block";
    loop();
  }

  function deactivate() {
    active = false;
    document.body.classList.remove("bookshelf-cur-active", "bookshelf-cur-expand");
    dot.style.display = "none";
    ring.style.display = "none";
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function onMouseMove(e) {
    mx = e.clientX;
    my = e.clientY;

    if (!active) {
      rx = mx;
      ry = my;
      activate();
    }

    dot.style.left = mx + "px";
    dot.style.top = my + "px";

    const el = document.elementFromPoint(mx, my);
    const hoverable = el && el.closest("a, button, [tabindex]");
    document.body.classList.toggle("bookshelf-cur-expand", !!hoverable);
  }

  function loop() {
    if (!active) return;
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseleave", deactivate);

  reduceMotion.addEventListener("change", e => {
    if (e.matches) {
      // Snap once, stop easing further, and let the native cursor take
      // back over rather than leaving a half-animated trail.
      deactivate();
    }
  });
})();
