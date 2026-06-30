/*
  Two responsibilities, both scoped to the landing page only:

  1. Isolate the landing page from MkDocs Material's surrounding shell.
     Two prior attempts at this (targeting `.md-header` by name, with a
     `:has()` CSS rule and then a JS-set body class + `!important`) both
     failed to remove a bar showing a "Home" link — guessing at Material's
     exact class names was the wrong approach twice. This version doesn't
     guess: it walks up the DOM from `.bookshelf-landing` to <body>, and
     at every level hides all SIBLINGS of each element on that path.
     Whatever Material calls the offending element (header, tabs bar,
     anything), it gets hidden because it's structurally outside the path
     to our content — no class names required. Everything that belongs to
     this page (cursor dot/ring, #p5wrap, the landing section itself)
     must live INSIDE .bookshelf-landing for this to be safe, which is how
     index.md is structured.

     This removed the visible nav, but left a thin residual gap — Material
     reserves vertical space for its header via padding/margin on the
     elements leading down to our content (not just on a sibling we could
     hide), so the loop below also zeroes top padding/margin on every
     ancestor on the path itself. Paired in bookshelf-landing.css with zeroing the
     `--md-header-height` custom property Material's own layout math reads
     from, in case the gap comes from a calc() using that variable rather
     than a literal padding/margin value.

  2. The custom orbital cursor — dot has zero smoothing (always exactly at
     the OS pointer position, so it stays precisely usable for
     targeting/clicking), the ring is the only element with eased lag.
     Bails out entirely on touch/coarse pointers and under
     prefers-reduced-motion — `cursor: none` is never set unconditionally,
     only once this script has confirmed it can track precisely. Never
     calls .focus()/preventDefault()/intercepts clicks or keys, so
     keyboard navigation and :focus-visible are completely unaffected.
*/

(function isolateLandingPage() {
  const landing = document.querySelector(".bookshelf-landing");
  if (!landing) return;

  document.body.classList.add("bookshelf-landing-page");

  let node = landing;
  while (node && node !== document.body) {
    const parent = node.parentElement;
    if (parent) {
      Array.prototype.forEach.call(parent.children, sibling => {
        if (sibling !== node) sibling.style.display = "none";
      });
      // `parent` stays visible (it's on the path to our content) but may
      // have reserved top spacing for the now-hidden header. Don't touch
      // `landing` itself here — .bookshelf-landing has its own deliberate
      // negative top margin (the full-bleed trick) that this would
      // otherwise clobber via inline-style precedence.
      parent.style.paddingTop = "0";
      parent.style.marginTop = "0";
    }
    node = parent;
  }
})();

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
    const hoverable = el && (el.closest("a") || el.closest(".card:not(.card-dormant)"));
    document.body.classList.toggle("bookshelf-cur-expand", !!hoverable);
  }

  function loop() {
    if (!active) return;
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseleave", deactivate);

  reduceMotion.addEventListener("change", e => {
    if (e.matches) deactivate();
  });
})();
