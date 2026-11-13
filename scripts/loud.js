/* loud: runs when the page is parsed; `root` is this section's element. */
(() => {
  const root = document.querySelector('[data-ws="loud"]');
  if (!root) return;

// Note: this section makes no Tauri/notification calls. The
// "plugin:notification|is_permission_granted not allowed by ACL" rejection comes from the
// preview shell; this script only guards its own promise so it never adds one of its own.
const line = root.querySelector(".line");
const words = root.querySelectorAll(".w");

// Layout is pure CSS now; once the display font settles, re-measure the scroll triggers.
if (document.fonts && window.ScrollTrigger) {
  document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
}

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce && window.gsap) {
  // Posters start off the wall; the wet-paste sheen waits off the left of each sheet.
  gsap.set(words, { opacity: 0, scale: 1.12, rotation: -2, transformOrigin: "50% 60%" });
  gsap.set(root.querySelectorAll(".wet"), { opacity: 1, xPercent: -110 });

  // Slap, one at a time: 180ms each (--dur-1), hard back-out, 90ms stagger.
  const slap = gsap.timeline({ paused: true });
  words.forEach((w, i) => {
    const at = i * 0.09;
    slap.to(w, { opacity: 1, scale: 1, rotation: 0, duration: 0.18, ease: "back.out(3)" }, at)
        .to(w.querySelector(".wet"), { xPercent: 110, duration: 0.42, ease: "power2.inOut" }, at + 0.12);
  });

  // Scroll in: the line pastes up. Scroll back: it peels off in reverse.
  ScrollTrigger.create({
    trigger: line,
    start: "top 80%",
    onEnter: () => slap.play(),
    onLeaveBack: () => slap.reverse()
  });

  // The whole line drifts a little across the wall as it passes, so it reads edge to edge.
  gsap.fromTo(line, { xPercent: 1.5 }, {
    xPercent: -1.5,
    ease: "none",
    scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true }
  });
}

})();
