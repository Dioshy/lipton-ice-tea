/* together: runs when the page is parsed; `root` is this section's element. */
(() => {
  const root = document.querySelector('[data-ws="together"]');
  if (!root) return;

// Each moment slaps onto the wall: photo first, then its caption, 90ms apart.
// Scrolling back above a moment peels it off in reverse.
// Note: this section makes no notification calls; the "plugin:notification" ACL rejection comes from the host app.
if (window.gsap && window.ScrollTrigger && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // kit parts carry their tilt in the CSS `rotate` property, so GSAP only adds the slap on top (base 0)
  const KIT = ".k-eyebrow, .k-title, .k-lede";
  const end = root.querySelector(".end");
  const groups = [root.querySelector(".head"), ...root.querySelectorAll(".m"), end];

  groups.forEach((group) => {
    const items = group.matches("[data-slap]") ? [group] : [...group.querySelectorAll("[data-slap]")];
    // the button stays visible and at rest until it enters; it only gets the slap, never the hide
    const isEnd = group === end;
    const tl = gsap.timeline({ paused: true });

    items.forEach((el, i) => {
      const r = el.matches(KIT) ? 0 : parseFloat(el.style.getPropertyValue("--r")) || 0;
      const at = i * 0.09;
      // 120ms in with a hard back-out, swinging 2° past its tilt, then 60ms to settle: 180ms per poster
      tl.fromTo(el,
        { autoAlpha: isEnd ? 1 : 0, scale: 1.12, rotation: r + 3 },
        { autoAlpha: 1, scale: 1, rotation: r - 2, duration: 0.12, ease: "back.out(3)", immediateRender: !isEnd }, at)
        .to(el, { rotation: r, duration: 0.06, ease: "power2.out" }, at + 0.12);
    });

    ScrollTrigger.create({
      trigger: group,
      start: isEnd ? "top bottom" : "top 82%",
      end: "max",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
    });
  });
}

})();
