/* hero: runs when the page is parsed; `root` is this section's element. */
(() => {
  const root = document.querySelector('[data-ws="hero"]');
  if (!root) return;

// Note: this section makes no notification or Tauri plugin calls. The
// "plugin:notification|is_permission_granted not allowed by ACL" rejection
// comes from the host app, not from the hero, so there is nothing to remove here.

// Opening paste-up: every poster slaps onto the wall in order, one at a time.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof gsap !== "undefined") {
    const wall = root.querySelector(".wall");
    const pieces = Array.from(root.querySelectorAll("[data-slap]"));
    const tilt = (el) => parseFloat(el.style.getPropertyValue("--r")) || 0;

    pieces.forEach((el) => gsap.set(el, { rotation: tilt(el), autoAlpha: 0 }));

    const tl = gsap.timeline({ delay: 0.25 });
    pieces.forEach((el, i) => {
      const r = tilt(el);
      const t = i * 0.09; // 90ms stagger

      // 180ms slap: 1.12 → 1, rotation overshoots by 2° then settles hard
      tl.set(el, { autoAlpha: 1, scale: 1.12, rotation: r + 3 }, t)
        .to(el, { scale: 1, rotation: r - 2, duration: 0.11, ease: "power3.out" }, t)
        .to(el, { rotation: r, duration: 0.07, ease: "back.out(3)" }, t + 0.11);

      // the big headline posters hit hard enough to jolt the wall
      if (el.hasAttribute("data-thump")) {
        tl.to(wall, { y: 5, duration: 0.05, yoyo: true, repeat: 1, ease: "power2.out" }, t + 0.1);
      }

      // wet paste catching the light as it is smoothed down
      const wet = el.querySelector(".wet");
      if (wet) {
        tl.fromTo(wet, { xPercent: -110, autoAlpha: 1 },
                       { xPercent: 110, autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, t + 0.14);
      }
    });

    // hand transforms back to CSS so hover states and the tilt tokens take over
    tl.eventCallback("onComplete", () => {
      gsap.set(pieces, { clearProps: "transform,opacity,visibility" });
      gsap.set(wall, { clearProps: "transform" });
    });
  }

})();
